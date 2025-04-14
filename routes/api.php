<?php

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
