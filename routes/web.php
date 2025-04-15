<?php

use App\Http\Controllers\MarkerController;
use App\Http\Controllers\ProfileController;
use App\Models\Marker;
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


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->prefix('maps')->name('maps.')->group(function () {
    Route::get('/', function () {
        $markers = Marker::all()->map(function ($marker) {
            return [
                'id' => $marker->id,
                'name' => $marker->name,
                'description' => $marker->description,
                'latitude' => $marker->latitude,
                'longitude' => $marker->longitude,
            ];
        });

        return Inertia::render('MapOverview', [
            'currentPath' => Request::path(),
            'markers' => $markers,
        ]);
    })->name('index');

    Route::get('/marker', function () {
        $markers = Marker::all()->map(function ($marker) {
            return [
                'id' => $marker->id,
                'name' => $marker->name,
                'description' => $marker->description,
                'latitude' => $marker->latitude,
                'longitude' => $marker->longitude,
            ];
        });
        return Inertia::render('MapOverviewMarker', [
            'currentPath' => Request::path(),
            'markers' => $markers,
        ]);
    })->name('marker');

    Route::get('/marker/add', function () {
        return Inertia::render('MapAddMarker', [
            'currentPath' => Request::path(),
        ]);
    })->name('marker.add');

    Route::get('/marker/edit/{id}', function ($id) {
        $marker = Marker::find($id);

        if (!$marker) {
            return Inertia::render('NotFound');
        }

        return Inertia::render('MapEditMarker', [
            'currentPath' => Request::path(),
            'marker' => [
                'id' => $marker->id,
                'name' => $marker->name,
                'description' => $marker->description,
                'latitude' => $marker->latitude,
                'longitude' => $marker->longitude,
            ],
        ]);
    })->name('marker.editdelete');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';