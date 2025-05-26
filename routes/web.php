<?php

use App\Http\Controllers\CircleCategoryController;
use App\Http\Controllers\CircleController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LineCategoryController;
use App\Http\Controllers\LineController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\MarkerCategoryController;
use App\Http\Controllers\MarkerController;
use App\Http\Controllers\PolygonCategoryController;
use App\Http\Controllers\PolygonController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RectangleCategoryController;
use App\Http\Controllers\RectangleController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\StreetController;
use App\Http\Middleware\CheckExternalApiToken;
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


// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard',);
// })->middleware(['auth', 'verified'])->name('dashboard');


Route::get('/api/token', function () {
    return response()->json([
        'token' => session('external_api_token'),
    ]);
})->middleware('auth'); // hanya user login yang bisa akses


Route::get('/', [HomeController::class, 'homePage'])->name('home');
Route::get('/maps', [HomeController::class, 'mapsPage']);

Route::middleware(['auth', 'verified'])->prefix('dashboard')->name('maps.')->group(function () {
    Route::get('/', [MapController::class, 'mapOverview'])->name('index');

    Route::get('/marker', [MarkerController::class, 'overviewMarker'])->name('marker');
    Route::get('/marker/add', [MarkerController::class, 'addMarker'])->name('marker.add');
    Route::get('/marker/edit/{id}', [MarkerController::class, 'editMarker'])->name('marker.edit');
    Route::get('/marker/categories', [MarkerCategoryController::class, 'index'])->name('marker.categories');

    Route::get('/line', [LineController::class, 'overviewLine'])->name('line');
    Route::get('/line/add', [LineController::class, 'addLine'])->name('line.add');
    Route::get('/line/edit/{id}', [LineController::class, 'editLine'])->name('line.edit');
    Route::get('/line/categories', [LineCategoryController::class, 'index'])->name('line.categories');

    Route::get('/polygon', [PolygonController::class, 'overviewPolygon'])->name('polygon');
    Route::get('/polygon/add', [PolygonController::class, 'addPolygon'])->name('polygon.add');
    Route::get('/polygon/edit/{id}', [PolygonController::class, 'editPolygon'])->name('polygon.edit');
    Route::get('/polygon/categories', [PolygonCategoryController::class, 'index'])->name('polygon.categories');

    Route::get('/circle', [CircleController::class, 'overviewCircle'])->name('circle');
    Route::get('/circle/add', [CircleController::class, 'addCircle'])->name('circle.add');
    Route::get('/circle/edit/{id}', [CircleController::class, 'editcircle'])->name('circle.edit');
    Route::get('/circle/categories', [CircleCategoryController::class, 'index'])->name('circle.categories');

    Route::get('/settings', [SettingController::class, 'index'])->name('setting');
    // Route::get('/rectangle', [RectangleController::class, 'overviewRectangle'])->name('rectangle');
    // Route::get('/rectangle/add', [RectangleController::class, 'addRectangle'])->name('rectangle.add');
    // Route::get('/rectangle/categories', [RectangleCategoryController::class, 'index'])->name('rectangle.categories');

    Route::get('/street', [StreetController::class, 'overviewStreet'])->name('street');
    Route::get('/street/add', [StreetController::class, 'addStreet'])->name('street.add');
    Route::get('/street/location', [StreetController::class, 'overviewLocation'])->name('street.location');
    Route::get('/street/edit/{id}', [StreetController::class, 'editStreet'])->name('street.edit');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
