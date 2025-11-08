<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Booking;
use App\Models\BookingDetail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $bookings = Booking::where('user_id', $request->user()->id)
            ->with('schedule.route', 'bookingDetails')
            ->latest()
            ->get();

        return Inertia::render('Customer/Booking/Index', [
            'bookings' => $bookings
        ]);
    }

    public function create(Schedule $schedule)
    {
        $schedule->load('route');

        $bookedSeats = BookingDetail::whereHas('booking', function ($query) use ($schedule) {
            $query->where('schedule_id', $schedule->id);
        })
            ->pluck('seat_number')
            ->toArray();

        return Inertia::render('Customer/Booking/Create', [
            'schedule' => $schedule,
            'bookedSeats' => $bookedSeats,
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'schedule_id' => 'required|exists:schedules,id',
            'passengers' => 'required|array|min:1',
            'passengers.*' => 'required|string|max:60',
            'total_price' => 'required|numeric',
        ]);

        $schedule = Schedule::findOrFail($request->schedule_id);

        try {
            DB::beginTransaction();

            $bookedSeats = BookingDetail::whereHas('booking', function ($query) use ($schedule) {
                $query->where('schedule_id', $schedule->id);
            })
                ->pluck('seat_number')
                ->toArray();

            foreach ($request->seats as $seat) {
                if (in_array($seat, $bookedSeats)) {
                    DB::rollBack();
                    return redirect()->back()
                        ->withErrors(['seat' => 'Maaf, kursi ' . $seat . ' baru saja dipesan orang lain.']);
                }
            }

            $booking = Booking::create([
                'booking_code' => 'BOOK-' . strtoupper(Str::random(6)),
                'user_id' => $request->user()->id,
                'schedule_id' => $schedule->id,
                'total_price' => $request->total_price,
                'status' => 'pending',
                'payment_proof' => null,
            ]);

            foreach ($request->passengers as $seatName => $passengerName) {
                BookingDetail::create([
                    'booking_id' => $booking->id,
                    'passenger_name' => $passengerName,
                    'seat_number' => $seatName,
                ]);
            }

            DB::commit();

            return redirect()->route('customer.booking.index')
                ->with('message', 'Booking Berhasil! Silakan upload bukti pembayaran.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    public function showInvoice(Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($booking->status !== 'invoiced') {
            return redirect()->route('customer.booking.index');
        }

        $booking->load('user', 'schedule.route', 'bookingDetails', 'admin');

        return Inertia::render('Customer/Booking/Invoice', [
            'booking' => $booking
        ]);
    }
}
