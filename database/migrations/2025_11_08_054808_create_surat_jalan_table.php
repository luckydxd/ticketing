<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surat_jalan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            // Satu surat jalan per jadwal
            $table->foreignUuid('schedule_id')->unique()->constrained('schedules');
            $table->foreignUuid('bus_id')->constrained('buses');
            $table->foreignUuid('driver_id')->constrained('drivers');
            $table->foreignUuid('admin_id')->constrained('users'); // Admin yang membuat
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_jalan');
    }
};
