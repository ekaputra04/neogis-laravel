<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\MarkerCategoryController;
use App\Http\Controllers\MarkerController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard',);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/', [HomeController::class, 'homePage'])->name('home');



Route::middleware(['auth', 'verified'])->prefix('maps')->name('maps.')->group(function () {
    Route::get('/', [MapController::class, 'mapOverview'])->name('index');

    Route::get('/marker', [MarkerController::class, 'overviewMarker'])->name('marker');
    Route::get('/marker/add', [MarkerController::class, 'addMarker'])->name('marker.add');
    Route::get('/marker/edit/{id}', [MarkerController::class, 'editMarker'])->name('marker.editdelete');
    Route::get('/marker/categories', [MarkerCategoryController::class, 'index'])->name('marker.categories');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
