<?php

namespace App\Http\Controllers;

use App\Models\Polygon;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePolygonRequest;
use App\Http\Requests\UpdatePolygonRequest;
use Illuminate\Support\Facades\DB;

class PolygonController extends Controller
{
    public function getAllPolygons()
    {
        $polygons = DB::table('polygons')
            ->join('polygon_categories', 'polygons.category_id', '=', 'polygon_categories.id')
            ->select(
                'polygons.id',
                'polygons.name',
                'polygons.description',
                'polygons.category_id',
                'polygon_categories.name as category_name',
                'polygon_categories.color as category_color',
                DB::raw('ST_AsGeoJSON(polygons.coordinates) AS coordinates')
            )
            ->get()
            ->map(function ($polygon) {
                $geojson = json_decode($polygon->coordinates, true);

                // Pastikan hanya ambil bagian pertama dari koordinat Polygon
                $polygon->coordinates = $geojson['coordinates'][0] ?? [];

                return $polygon;
            });
        return response()->json($polygons);
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
    public function store(StorePolygonRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Polygon $polygon)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Polygon $polygon)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePolygonRequest $request, Polygon $polygon)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Polygon $polygon)
    {
        //
    }
}
