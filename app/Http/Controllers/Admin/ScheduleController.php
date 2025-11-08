<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Schedules/Index', [
            'schedules' => Schedule::with('route')->latest()->get(),
            'routes' => Route::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'route_id' => 'required|exists:routes,id',
            'departure_time' => 'required|date',
            'arrival_time' => 'required|date|after:departure_time',
            'total_seats' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        Schedule::create($request->all());

        return redirect()->route('admin.schedules.index')
            ->with('message', 'Jadwal Berhasil Ditambahkan!');
    }

    public function update(Request $request, Schedule $schedule)
    {
        $request->validate([
            'route_id' => 'required|exists:routes,id',
            'departure_time' => 'required|date',
            'arrival_time' => 'required|date|after:departure_time',
            'total_seats' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        $schedule->update($request->all());

        return redirect()->route('admin.schedules.index')
            ->with('message', 'Jadwal Berhasil Diperbarui!');
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        return redirect()->route('admin.schedules.index')
            ->with('message', 'Jadwal Berhasil Dihapus!');
    }
}
