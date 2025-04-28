<?php

namespace App\Http\Controllers;

use App\Models\Rectangle;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRectangleRequest;
use App\Http\Requests\UpdateRectangleRequest;
use Illuminate\Support\Facades\DB;

class RectangleController extends Controller
{

    public function getAllRectangles()
    {
        $rectangles = DB::table('rectangles')
            ->select(
                'id',
                'name',
                'description',
                DB::raw('ST_AsGeoJSON(coordinates) AS coordinates')
            )
            ->get()
            ->map(function ($rectangle) {
                $geojson = json_decode($rectangle->coordinates, true);

                // Pastikan hanya ambil bagian pertama dari koordinat Polygon
                $rectangle->coordinates = $geojson['coordinates'][0] ?? [];

                return $rectangle;
            });

        return response()->json($rectangles);
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
    public function store(StoreRectangleRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Rectangle $rectangle)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rectangle $rectangle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRectangleRequest $request, Rectangle $rectangle)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rectangle $rectangle)
    {
        //
    }
}
