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

Route::middleware(['auth', 'verified'])->prefix('maps')->name('maps.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Map', [
            'currentPath' => Request::path(),
        ]);
    })->name('index');

    Route::get('/marker', function () {
        return Inertia::render('MapOverviewMarker', [
            'currentPath' => Request::path(),
        ]);
    })->name('marker');

    Route::get('/marker/add', function () {
        return Inertia::render('MapAddMarker', [
            'currentPath' => Request::path(),
        ]);
    })->name('marker.add');

    Route::get('/marker/edit-delete', function () {
        return Inertia::render('MapEditOrDeleteMarker', [
            'currentPath' => Request::path(),
        ]);
    })->name('marker.editdelete');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
