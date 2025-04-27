<?php

use App\Http\Controllers\LineCategoryController;
use App\Http\Controllers\LineController;
use App\Http\Controllers\MarkerCategoryController;
use App\Http\Controllers\MarkerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/maps/markers', [MarkerController::class, 'getAllMarkers']);
Route::get('/maps/markers/{id}', [MarkerController::class, 'getMarkerById']);
Route::post('/maps/markers', [MarkerController::class, 'store']);
Route::put('/maps/markers/{id}', [MarkerController::class, 'update']);
Route::delete('/maps/markers/{id}', [MarkerController::class, 'destroy']);

Route::get('/maps/markers-categories', [MarkerCategoryController::class, 'getAllMarkerCategories']);
Route::post('/maps/markers-categories', [MarkerCategoryController::class, 'store']);
Route::put('/maps/markers-categories/{id}', [MarkerCategoryController::class, 'update']);
Route::delete('/maps/markers-categories/{id}', [MarkerCategoryController::class, 'destroy']);

Route::get('/maps/lines-categories', [LineCategoryController::class, 'getAllLineCategories']);
Route::post('/maps/lines-categories', [LineCategoryController::class, 'store']);
Route::put('/maps/lines-categories/{id}', [LineCategoryController::class, 'update']);
Route::delete('/maps/lines-categories/{id}', [LineCategoryController::class, 'destroy']);

Route::get('/maps/lines', [LineController::class, 'getAllLines']);
Route::post('/maps/lines', [LineController::class, 'store']);
Route::put('/maps/lines/{id}', [LineController::class, 'update']);
Route::delete('/maps/lines/{id}', [LineController::class, 'destroy']);