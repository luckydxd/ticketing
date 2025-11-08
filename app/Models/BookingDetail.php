<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class BookingDetail extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'booking_id',
        'passenger_name',
        'seat_number',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
