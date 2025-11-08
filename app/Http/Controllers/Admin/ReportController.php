<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $allBookings = Booking::with([
            'user',
            'schedule.route',
            'bookingDetails',
            'admin',
            'checker'
        ])
            ->latest()
            ->get();

        return Inertia::render('Admin/Reports/Index', [
            'allBookings' => $allBookings
        ]);
    }
}
