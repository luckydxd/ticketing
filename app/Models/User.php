<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUuids, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    public function userData()
    {
        return $this->hasOne(UserData::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'user_id');
    }

    public function confirmedBookings()
    {
        return $this->hasMany(Booking::class, 'admin_id');
    }

    public function checkedInBookings()
    {
        return $this->hasMany(Booking::class, 'checker_id');
    }

    public function createdSuratJalan()
    {
        return $this->hasMany(SuratJalan::class, 'admin_id');
    }
}
