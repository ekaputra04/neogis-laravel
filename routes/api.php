<?php

use App\Http\Controllers\Auth\ExternalAuthController;
use App\Http\Controllers\CircleCategoryController;
use App\Http\Controllers\CircleController;
use App\Http\Controllers\LineCategoryController;
use App\Http\Controllers\LineController;
use App\Http\Controllers\MarkerCategoryController;
use App\Http\Controllers\MarkerController;
use App\Http\Controllers\PolygonCategoryController;
use App\Http\Controllers\PolygonController;
use App\Http\Controllers\RectangleCategoryController;
use App\Http\Controllers\RectangleController;
use App\Http\Controllers\StreetController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/users/check', [UserController::class, 'checkUser']);
Route::post('/users', [UserController::class, 'store']);


Route::get('/maps/markers-categories', [MarkerCategoryController::class, 'getAllMarkerCategories']);
Route::post('/maps/markers-categories', [MarkerCategoryController::class, 'store']);
Route::put('/maps/markers-categories/{id}', [MarkerCategoryController::class, 'update']);
Route::delete('/maps/markers-categories/{id}', [MarkerCategoryController::class, 'destroy']);

Route::get('/maps/lines-categories', [LineCategoryController::class, 'getAllLineCategories']);
Route::post('/maps/lines-categories', [LineCategoryController::class, 'store']);
Route::put('/maps/lines-categories/{id}', [LineCategoryController::class, 'update']);
Route::delete('/maps/lines-categories/{id}', [LineCategoryController::class, 'destroy']);

Route::get('/maps/polygons-categories', [PolygonCategoryController::class, 'getAllPolygonCategories']);
Route::post('/maps/polygons-categories', [PolygonCategoryController::class, 'store']);
Route::put('/maps/polygons-categories/{id}', [PolygonCategoryController::class, 'update']);
Route::delete('/maps/polygons-categories/{id}', [PolygonCategoryController::class, 'destroy']);

Route::get('/maps/circles-categories', [CircleCategoryController::class, 'getAllCircleCategories']);
Route::post('/maps/circles-categories', [CircleCategoryController::class, 'store']);
Route::put('/maps/circles-categories/{id}', [CircleCategoryController::class, 'update']);
Route::delete('/maps/circles-categories/{id}', [CircleCategoryController::class, 'destroy']);

Route::get('/maps/markers', [MarkerController::class, 'getAllMarkers']);
Route::post('/maps/markers', [MarkerController::class, 'store']);
Route::put('/maps/markers/{id}', [MarkerController::class, 'update']);
Route::delete('/maps/markers/{id}', [MarkerController::class, 'destroy']);

Route::get('/maps/lines', [LineController::class, 'getAllLines']);
Route::post('/maps/lines', [LineController::class, 'store']);
Route::put('/maps/lines/{id}', [LineController::class, 'update']);
Route::delete('/maps/lines/{id}', [LineController::class, 'destroy']);

Route::get('/maps/polygons', [PolygonController::class, 'getAllPolygons']);
Route::post('/maps/polygons', [PolygonController::class, 'store']);
Route::put('/maps/polygons/{id}', [PolygonController::class, 'update']);
Route::delete('/maps/polygons/{id}', [PolygonController::class, 'destroy']);

Route::get('/maps/circles', [CircleController::class, 'getAllCircles']);
Route::post('/maps/circles', [CircleController::class, 'store']);
Route::put('/maps/circles/{id}', [CircleController::class, 'update']);
Route::delete('/maps/circles/{id}', [CircleController::class, 'destroy']);

// Route::get('/maps/rectangles-categories', [RectangleCategoryController::class, 'getAllRectangleCategories']);
// Route::post('/maps/rectangles-categories', [RectangleCategoryController::class, 'store']);
// Route::put('/maps/rectangles-categories/{id}', [RectangleCategoryController::class, 'update']);
// Route::delete('/maps/rectangles-categories/{id}', [RectangleCategoryController::class, 'destroy']);

// Route::get('/maps/rectangles', [RectangleController::class, 'getAllRectangles']);
// Route::post('/maps/rectangles', [RectangleController::class, 'store']);
// Route::put('/maps/rectangles/{id}', [RectangleController::class, 'update']);
// Route::delete('/maps/rectangles/{id}', [RectangleController::class, 'destroy']);