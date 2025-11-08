<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Buses/Index', [
            'buses' => Bus::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'license_plate' => 'required|string|max:20|unique:buses',
        ]);

        Bus::create($request->all());

        return redirect()->route('admin.buses.index')
            ->with('message', 'Data Bus Berhasil Ditambahkan!');
    }

    public function update(Request $request, Bus $bus)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'license_plate' => 'required|string|max:20|unique:buses,license_plate,' . $bus->id,
        ]);

        $bus->update($request->all());

        return redirect()->route('admin.buses.index')
            ->with('message', 'Data Bus Berhasil Diperbarui!');
    }

    public function destroy(Bus $bus)
    {
        $bus->delete();
        return redirect()->route('admin.buses.index')
            ->with('message', 'Data Bus Berhasil Dihapus!');
    }
}
