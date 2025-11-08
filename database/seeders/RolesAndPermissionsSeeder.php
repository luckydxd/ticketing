<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Membuat roles menggunakan laravel spatie permission package
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'customer']);
        Role::create(['name' => 'checker']);
    }
}
