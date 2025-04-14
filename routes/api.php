<?php

use App\Http\Controllers\MarkerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/maps/markers', [MarkerController::class, 'getMarkers']);
Route::post('/maps/markers', [MarkerController::class, 'store']);
Route::delete('/maps/markers/{id}', [MarkerController::class, 'destroy']);
