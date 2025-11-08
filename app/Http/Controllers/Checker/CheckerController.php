<?php

namespace App\Http\Controllers\Checker;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class CheckerController extends Controller
{
    public function index()
    {
        $schedulesToday = Schedule::with('route')
            ->whereDate('departure_time', Carbon::today())
            ->whereHas('bookings')
            ->get();

        return Inertia::render('Checker/Dashboard', [
            'schedulesToday' => $schedulesToday
        ]);
    }

    public function show(Schedule $schedule)
    {
        $passengers = Booking::with('user', 'bookingDetails')
            ->where('schedule_id', $schedule->id)
            ->whereIn('status', ['invoiced', 'checked_in'])
            ->get();

        return Inertia::render('Checker/Show', [
            'schedule' => $schedule->load('route'),
            'passengers' => $passengers
        ]);
    }

    public function update(Request $request, Booking $booking)
    {
        if ($booking->status !== 'invoiced') {
            return redirect()->back()->withErrors(['error' => 'Booking ini tidak bisa di check-in.']);
        }

        $booking->update([
            'status' => 'checked_in',
            'checker_id' => auth()->id()
        ]);

        return redirect()->back()->with('message', 'Penumpang berhasil di check-in!');
    }
}
