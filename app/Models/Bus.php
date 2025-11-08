<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Bus extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'license_plate',
    ];

    public function suratJalan()
    {
        return $this->hasMany(SuratJalan::class);
    }
}
