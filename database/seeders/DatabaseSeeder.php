<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {

        $this->call(RolesAndPermissionsSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(MasterDataSeeder::class);
        $this->call(ScheduleSeeder::class);
        $this->call(BookingSeeder::class);
    }
}
