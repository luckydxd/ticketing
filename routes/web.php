<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Models\Schedule;
use Inertia\Inertia;
use App\Http\Controllers\Admin\RouteController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\Admin\BusController;
use App\Http\Controllers\Admin\DriverController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    // Ambil data jadwal dengan filter
    $availableSchedules = Schedule::with('route')
        // ketika: lewat batas waktu perjalanan
        ->where('departure_time', '>', now())

        // belum dicetak surat jalan 
        ->whereDoesntHave('suratJalan')
        ->latest('departure_time')
        ->get();
    return Inertia::render('Dashboard', [
        'schedules' => $availableSchedules // <-- Kirim data jadwal ke frontend
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware(['role:admin'])
        ->prefix('admin')
        ->name('admin.')
        ->group(function () {
            Route::get('/dashboard', function () {
                return Inertia::render('Dashboard');
            })->name('dashboard');

            // Rute Master
            Route::get('routes', [RouteController::class, 'index'])->name('routes.index');
            Route::post('routes', [RouteController::class, 'store'])->name('routes.store');
            Route::put('routes/{route}', [RouteController::class, 'update'])->name('routes.update');
            Route::delete('routes/{route}', [RouteController::class, 'destroy'])->name('routes.destroy');

            // Rute Jadwal
            Route::get('schedules', [ScheduleController::class, 'index'])->name('schedules.index');
            Route::post('schedules', [ScheduleController::class, 'store'])->name('schedules.store');
            Route::put('schedules/{schedule}', [ScheduleController::class, 'update'])->name('schedules.update');
            Route::delete('schedules/{schedule}', [ScheduleController::class, 'destroy'])->name('schedules.destroy');

            // Rute Bus
            Route::get('buses', [BusController::class, 'index'])->name('buses.index');
            Route::post('buses', [BusController::class, 'store'])->name('buses.store');
            Route::put('buses/{bus}', [BusController::class, 'update'])->name('buses.update');
            Route::delete('buses/{bus}', [BusController::class, 'destroy'])->name('buses.destroy');

            // Rute Driver
            Route::get('drivers', [DriverController::class, 'index'])->name('drivers.index');
            Route::post('drivers', [DriverController::class, 'store'])->name('drivers.store');
            Route::put('drivers/{driver}', [DriverController::class, 'update'])->name('drivers.update');
            Route::delete('drivers/{driver}', [DriverController::class, 'destroy'])->name('drivers.destroy');
        });
});

require __DIR__ . '/auth.php';
