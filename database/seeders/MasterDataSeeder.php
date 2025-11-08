<?php

namespace Database\Seeders;

use App\Models\Bus;
use App\Models\Driver;
use App\Models\Route;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        Route::create(['origin_city' => 'Jakarta', 'destination_city' => 'Cirebon']);
        Route::create(['origin_city' => 'Cirebon', 'destination_city' => 'Jakarta']);
        Route::create(['origin_city' => 'Jakarta', 'destination_city' => 'Surabaya']);

        Bus::create(['name' => 'Bus Sugeng Rahayu 01', 'license_plate' => 'E 5631 ABC']);
        Bus::create(['name' => 'Bus Harapan Jaya 02', 'license_plate' => 'B 5678 DEF']);

        Driver::create(['name' => 'Pak Budi', 'phone_number' => '08151234567']);
        Driver::create(['name' => 'Pak Anto', 'phone_number' => '08157654321']);
    }
}
