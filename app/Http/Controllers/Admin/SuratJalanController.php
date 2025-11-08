<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SuratJalan;
use App\Models\Schedule;
use App\Models\Bus;
use App\Models\Driver;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuratJalanController extends Controller
{
    public function index()
    {
        $availableSchedules = Schedule::with('route')
            ->where('departure_time', '>', now())
            ->whereDoesntHave('suratJalan')
            ->get();

        $createdSuratJalan = SuratJalan::with('schedule.route', 'bus', 'driver', 'admin')
            ->latest()
            ->get();

        $buses = Bus::all();
        $drivers = Driver::all();

        return Inertia::render('Admin/SuratJalan/Index', [
            'availableSchedules' => $availableSchedules,
            'createdSuratJalan' => $createdSuratJalan,
            'buses' => $buses,
            'drivers' => $drivers,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'schedule_id' => 'required|exists:schedules,id|unique:surat_jalan',
            'bus_id' => 'required|exists:buses,id',
            'driver_id' => 'required|exists:drivers,id',
        ]);

        SuratJalan::create([
            'schedule_id' => $request->schedule_id,
            'bus_id' => $request->bus_id,
            'driver_id' => $request->driver_id,
            'admin_id' => auth()->id(),
        ]);

        return redirect()->back()->with('message', 'Surat Jalan berhasil dibuat!');
    }
}
