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
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        // Simpan marker
        $marker = Marker::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'coordinates' => DB::raw("ST_GeomFromText('POINT({$validated['longitude']} {$validated['latitude']})')"),
        ]);

        // Ambil coordinates dengan query
        $location = DB::selectOne("SELECT ST_X(coordinates) AS longitude, ST_Y(coordinates) AS latitude FROM markers WHERE id = ?", [$marker->id]);

        // Gabungkan data marker dengan koordinat
        $response = [
            'id' => $marker->id,
            'name' => $marker->name,
            'description' => $marker->description,
            'latitude' => $location->latitude,
            'longitude' => $location->longitude,
        ];

        return response()->json($response, 201);
    }

    public function destroy($id)
    {
        $marker = Marker::find($id);

        if (!$marker) {
            return response()->json([
                'message' => 'Marker not found.'
            ], 404);
        }

        $marker->delete();

        return response()->json([
            'message' => 'Marker deleted successfully.'
        ]);
    }

    public function getMarkers()
    {
        $markers = DB::table('markers')
            ->select(
                'id',
                'name',
                'description',
                DB::raw('ST_Y(coordinates) AS latitude'),
                DB::raw('ST_X(coordinates) AS longitude')
            )
            ->get();

        return response()->json($markers);
    }
}
