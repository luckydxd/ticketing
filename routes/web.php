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
use App\Http\Controllers\BookingController;
use App\Http\Controllers\Customer\PaymentController;
use App\Http\Controllers\Admin\BookingConfirmationController;
use App\Http\Controllers\Admin\SuratJalanController;
use App\Http\Controllers\Checker\CheckerController;
use App\Http\Controllers\Admin\ReportController;

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
    return redirect()->route('login');
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

            //Rute konfirmasi booking
            Route::get('confirmations', [BookingConfirmationController::class, 'index'])->name('confirmations.index');
            Route::patch('confirmations/{booking}', [BookingConfirmationController::class, 'update'])->name('confirmations.update');

            // Rute surat jalan
            Route::get('surat-jalan', [SuratJalanController::class, 'index'])->name('suratjalan.index');
            Route::post('surat-jalan', [SuratJalanController::class, 'store'])->name('suratjalan.store');

            // Rute laporan
            Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        });

    Route::middleware(['role:customer'])->prefix('customer')->name('customer.')->group(function () {
        //Rute booking
        Route::get('/my-bookings', [BookingController::class, 'index'])->name('booking.index');
        Route::get('/booking/create/{schedule}', [BookingController::class, 'create'])->name('booking.create');
        Route::post('/booking/store', [BookingController::class, 'store'])->name('booking.store');

        //Rute pembayaran
        Route::get('/payment/upload/{booking}', [PaymentController::class, 'show'])->name('payment.show');
        Route::post('/payment/upload/{booking}', [PaymentController::class, 'store'])->name('payment.store');

        //Rute invoice
        Route::get('/invoice/{booking}', [BookingController::class, 'showInvoice'])->name('invoice.show');
    });

    Route::middleware(['role:checker'])
        ->prefix('checker')
        ->name('checker.')
        ->group(function () {

            Route::get('/dashboard', [CheckerController::class, 'index'])->name('dashboard');

            // Halaman detail untuk mengecek penumpang per jadwal
            Route::get('/scan/{schedule}', [CheckerController::class, 'show'])->name('scan.show');

            // Aksi untuk "check-in" penumpang 
            Route::patch('/scan/{booking}', [CheckerController::class, 'update'])->name('scan.update');
        });
});

require __DIR__ . '/auth.php';
