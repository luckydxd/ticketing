<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingConfirmationController extends Controller
{
    public function index()
    {
        $bookings = Booking::where('status', 'confirmed')
            ->with('user', 'schedule.route', 'bookingDetails')
            ->latest()
            ->get();

        return Inertia::render('Admin/Confirmations/Index', [
            'bookings' => $bookings
        ]);
    }

    public function update(Request $request, Booking $booking)
    {
        $booking->update([
            'status' => 'invoiced',
            'admin_id' => auth()->id()
        ]);

        return redirect()->back()->with('message', 'Booking berhasil dikonfirmasi!');
    }
}
