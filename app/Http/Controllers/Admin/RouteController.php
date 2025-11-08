<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RouteController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Routes/Index', [
            'routes' => Route::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'origin_city' => 'required|string|max:255',
            'destination_city' => 'required|string|max:255',
        ]);

        Route::create($request->all());

        return redirect()->route('admin.routes.index')
            ->with('message', 'Rute Berhasil Ditambahkan!');
    }

    public function update(Request $request, Route $route)
    {
        $request->validate([
            'origin_city' => 'required|string|max:255',
            'destination_city' => 'required|string|max:255',
        ]);

        $route->update($request->all());

        return redirect()->route('admin.routes.index')
            ->with('message', 'Rute Berhasil Diperbarui!');
    }

    public function destroy(Route $route)
    {
        $route->delete();
        return redirect()->route('admin.routes.index')
            ->with('message', 'Rute Berhasil Dihapus!');
    }
}
