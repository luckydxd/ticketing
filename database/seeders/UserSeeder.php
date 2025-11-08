<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserData;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // User Admin
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');
        UserData::create([
            'user_id' => $admin->id,
            'phone_number' => '081200000001',
            'address' => 'Kantor Pusat',
        ]);

        // User Customer
        $customer = User::create([
            'name' => 'Customer User',
            'email' => 'customer@test.com',
            'password' => Hash::make('password'),
        ]);
        $customer->assignRole('customer');
        UserData::create([
            'user_id' => $customer->id,
            'phone_number' => '081200000002',
            'address' => 'Rumah Customer',
        ]);

        // User Checker
        $checker = User::create([
            'name' => 'Checker User',
            'email' => 'checker@test.com',
            'password' => Hash::make('password'),
        ]);
        $checker->assignRole('checker');
        UserData::create([
            'user_id' => $checker->id,
            'phone_number' => '081200000003',
            'address' => 'Pos Checker',
        ]);
    }
}
