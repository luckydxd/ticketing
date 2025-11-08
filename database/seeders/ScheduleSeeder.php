<?php

namespace Database\Seeders;

use App\Models\Route;
use App\Models\Schedule;
use Illuminate\Database\Seeder;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $routeJC = Route::where('origin_city', 'Jakarta')
            ->where('destination_city', 'Cirebon')
            ->first();

        $routeCJ = Route::where('origin_city', 'Cirebon')
            ->where('destination_city', 'Jakarta')
            ->first();

        Schedule::create([
            'route_id' => $routeJC->id,
            'departure_time' => now()->addDay()->setTime(8, 0, 0),
            'arrival_time' => now()->addDay()->setTime(11, 0, 0),
            'total_seats' => 40,
            'price' => 150000,
        ]);

        Schedule::create([
            'route_id' => $routeJC->id,
            'departure_time' => now()->addDay()->setTime(14, 0, 0),
            'arrival_time' => now()->addDay()->setTime(17, 0, 0),
            'total_seats' => 40,
            'price' => 150000,
        ]);

        Schedule::create([
            'route_id' => $routeCJ->id,
            'departure_time' => now()->addDays(2)->setTime(9, 0, 0),
            'arrival_time' => now()->addDays(2)->setTime(12, 0, 0),
            'total_seats' => 40,
            'price' => 145000,
        ]);
    }
}
