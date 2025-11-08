<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('booking_code')->unique();
            $table->foreignUuid('user_id')->constrained('users'); // Customer
            $table->foreignUuid('schedule_id')->constrained('schedules');
            $table->decimal('total_price', 10, 2);
            $table->string('payment_proof')->nullable();

            // pending, konfirmasi, cetak invoice, konfirmasi penumpang kedatangan
            $table->enum('status', ['pending', 'confirmed', 'invoiced', 'checked_in'])
                ->default('pending');

            // Relasi ke user dengan role (admin) dan user dengan role (checker)
            $table->foreignUuid('admin_id')->nullable()->constrained('users');
            $table->foreignUuid('checker_id')->nullable()->constrained('users');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
