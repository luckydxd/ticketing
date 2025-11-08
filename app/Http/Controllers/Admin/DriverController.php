<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DriverController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Drivers/Index', [
            'drivers' => Driver::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20|unique:drivers',
        ]);

        Driver::create($request->all());

        return redirect()->route('admin.drivers.index')
            ->with('message', 'Data Driver Berhasil Ditambahkan!');
    }

    public function update(Request $request, Driver $driver)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20|unique:drivers,phone_number,' . $driver->id,
        ]);

        $driver->update($request->all());

        return redirect()->route('admin.drivers.index')
            ->with('message', 'Data Driver Berhasil Diperbarui!');
    }

    public function destroy(Driver $driver)
    {
        $driver->delete();
        return redirect()->route('admin.drivers.index')
            ->with('message', 'Data Driver Berhasil Dihapus!');
    }
}
