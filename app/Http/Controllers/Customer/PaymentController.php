<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
    public function show(Booking $booking)
    {
        if ($booking->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Customer/Payment/Upload', [
            'booking' => $booking->load('schedule.route', 'bookingDetails')
        ]);
    }

    public function store(Request $request, Booking $booking)
    {
        if ($booking->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $path = $request->file('payment_proof')->store('payment_proofs', 'public');

        $booking->update([
            'payment_proof' => $path,
            'status' => 'confirmed'
        ]);

        return redirect()->route('customer.booking.index')
            ->with('message', 'Bukti pembayaran berhasil di-upload! Menunggu konfirmasi admin.');
    }
}
