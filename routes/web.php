<?php

use App\Http\Controllers\MarkerController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Di routes/api.php
Route::post('/markers', [MarkerController::class, 'store']);
// Route::get('/markers', [MarkerController::class, 'getMarkers']);


// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/maps', function () {
        return Inertia::render('Map', [
            'currentPath' => Request::path(),
        ]);
    })->name('maps');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/maps/marker', function () {
        return Inertia::render('MapOverviewMarker', [
            'currentPath' => Request::path(),
        ]);
    })->name('maps.marker');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/maps/marker/add', function () {
        return Inertia::render('MapAddMarker', [
            'currentPath' => Request::path(),
        ]);
    })->name('maps.marker.add');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/maps/marker/edit-delete', function () {
        return Inertia::render('MapEditOrDeleteMarker', [
            'currentPath' => Request::path(),
        ]);
    })->name('maps.marker.editdelete');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
