<?php

namespace App\Http\Controllers;

use App\Models\Circle;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCircleRequest;
use App\Http\Requests\UpdateCircleRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CircleController extends Controller
{
    public function getAllcircles()
    {
        $circles = DB::table('circles')
            ->select(
                'id',
                'name',
                'description',
                'category_id',
                DB::raw('ST_Y(center) AS latitude'),
                DB::raw('ST_X(center) AS longitude'),
                'radius',
            )
            ->get();

        return response()->json($circles);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'required|numeric',
            'category_id' => 'required|numeric',
        ]);

        // Simpan circle
        $circle = Circle::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'category_id' => $validated['category_id'],
            'center' => DB::raw("ST_GeomFromText('POINT({$validated['longitude']} {$validated['latitude']})')"),
            'radius' => $validated['radius'],
        ]);

        // Ambil center dengan query
        $location = DB::selectOne("SELECT ST_X(center) AS longitude, ST_Y(center) AS latitude FROM circles WHERE id = ?", [$circle->id]);

        // Gabungkan data circle dengan koordinat
        $response = [
            'id' => $circle->id,
            'name' => $circle->name,
            'description' => $circle->description,
            'category_id' => $circle->category_id,
            'latitude' => $location->latitude,
            'longitude' => $location->longitude,
            'radius' => $circle->radius,
        ];

        return response()->json($response, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Circle $circle)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Circle $circle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'required|numeric',
            'category_id' => 'required|numeric',
        ]);

        // Cari circle berdasarkan ID
        $circle = Circle::find($id);

        // Jika circle tidak ditemukan
        if (!$circle) {
            return response()->json(['message' => 'Circle not found'], 404);
        }

        // Update data circle
        $circle->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'category_id' => $validated['category_id'],
            'center' => DB::raw("ST_GeomFromText('POINT({$validated['longitude']} {$validated['latitude']})')"),
            'radius' => $validated['radius'],
        ]);

        // Ambil center yang baru
        $location = DB::selectOne("SELECT ST_X(center) AS longitude, ST_Y(center) AS latitude FROM circles WHERE id = ?", [$circle->id]);

        // Gabungkan data circle dengan koordinat
        $response = [
            'id' => $circle->id,
            'name' => $circle->name,
            'description' => $circle->description,
            'category_id' => $circle->category_id,
            'latitude' => $location->latitude,
            'longitude' => $location->longitude,
            'radius' => $circle->radius,
        ];

        return response()->json($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $circle = Circle::find($id);

        if (!$circle) {
            return response()->json([
                'message' => 'Circle not found.'
            ], 404);
        }

        $circle->delete();

        return response()->json([
            'message' => 'Circle deleted successfully.'
        ]);
    }
}
