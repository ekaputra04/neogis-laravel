<?php

namespace App\Http\Controllers;

use App\Models\Marker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MarkerController extends Controller
{
    // Menyimpan data marker
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'coordinates' => 'required|array', // Harus berupa array [lng, lat]
            'coordinates.*' => 'numeric',
        ]);

        // Menyimpan marker
        $marker = Marker::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'coordinates' => DB::raw("ST_GeomFromText('POINT({$validated['coordinates'][0]} {$validated['coordinates'][1]})')"),
        ]);

        return response()->json($marker, 201);
    }

    public function getMarkers()
    {
        $markers = Marker::all(); // Ambil semua marker
        return response()->json($markers);
    }

    public function showMap()
    {
        $markers = Marker::all(); // Ambil semua data marker
        return view('map', compact('markers'));
    }
}