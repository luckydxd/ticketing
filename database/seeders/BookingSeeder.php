<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\BookingDetail;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::role('customer')->first();
        $schedule = Schedule::first();

        $booking = Booking::create([
            'booking_code' => 'BOOK-001',
            'user_id' => $customer->id,
            'schedule_id' => $schedule->id,
            'total_price' => $schedule->price * 2,
            'payment_proof' => null,
            'status' => 'pending',
        ]);

        BookingDetail::create([
            'booking_id' => $booking->id,
            'passenger_name' => $customer->name,
            'seat_number' => '1A',
        ]);

        BookingDetail::create([
            'booking_id' => $booking->id,
            'passenger_name' => 'Penumpang Lain',
            'seat_number' => '1B',
        ]);
    }
}
