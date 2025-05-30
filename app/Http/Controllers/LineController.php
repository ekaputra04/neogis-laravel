<?php

namespace App\Http\Controllers;

use App\Models\Line;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLineRequest;
use App\Http\Requests\UpdateLineRequest;
use App\Models\LineCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class LineController extends Controller
{
    public function getAllLines()
    {
        $lines = DB::table('lines')
            ->select(
                'id',
                'name',
                'description',
                DB::raw('ST_AsGeoJSON(coordinates) AS coordinates')
            )
            ->get()
            ->map(function ($line) {
                $geojson = json_decode($line->coordinates, true);
                $line->coordinates = $geojson['coordinates'] ?? null;
                return $line;
            });

        return response()->json($lines);
    }

    public function getLineById($id)
    {
        $line = DB::table('lines')
            ->select(
                'id',
                'name',
                'description',
                DB::raw('ST_AsGeoJSON(coordinates) AS coordinates')
            )
            ->where('id', $id)
            ->first();

        if (!$line) {
            return response()->json(['message' => 'Line not found'], 404);
        }

        $geojson = json_decode($line->coordinates, true);
        $line->coordinates = $geojson['coordinates'] ?? null;

        return response()->json($line);
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
        // Validasi input dasar
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'coordinates' => 'required|array|min:2',
            'category_id' => 'required|numeric',
        ]);

        // Validasi manual isi dari coordinates
        foreach ($validated['coordinates'] as $point) {
            if (!is_array($point) || count($point) != 2 || !is_numeric($point[0]) || !is_numeric($point[1])) {
                return response()->json([
                    'message' => 'Each coordinate must be an array of two numeric values [longitude, latitude].'
                ], 422);
            }
        }

        // Format coordinates ke format LINESTRING
        $coordinates = array_map(function ($point) {
            return "{$point[0]} {$point[1]}"; // longitude latitude
        }, $validated['coordinates']);

        $linestring = 'LINESTRING(' . implode(', ', $coordinates) . ')';

        // Simpan line
        $line = Line::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'category_id' => $validated['category_id'],
            'coordinates' => DB::raw("ST_GeomFromText('$linestring')"),
        ]);

        // Ambil kembali data line
        $location = DB::selectOne("SELECT ST_AsGeoJSON(coordinates) AS geojson FROM `lines` WHERE id = ?", [$line->id]);

        $geojson = json_decode($location->geojson, true);

        // Gabungkan semua
        $response = [
            'id' => $line->id,
            'name' => $line->name,
            'description' => $line->description,
            'category_id' => $line->category_id,
            'coordinates' => $geojson['coordinates'] ?? null,
        ];

        return response()->json($response, 201);
    }



    /**
     * Display the specified resource.
     */
    public function show(Line $line)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Line $line)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Validasi input dasar
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'coordinates' => 'required|array|min:2',
            'category_id' => 'required|numeric',
        ]);

        // Cari line berdasarkan id
        $line = Line::find($id);

        if (!$line) {
            return response()->json(['message' => 'Line not found'], 404);
        }

        // Validasi manual isi dari coordinates
        foreach ($validated['coordinates'] as $point) {
            if (!is_array($point) || count($point) != 2 || !is_numeric($point[0]) || !is_numeric($point[1])) {
                return response()->json([
                    'message' => 'Each coordinate must be an array of two numeric values [longitude, latitude].'
                ], 422);
            }
        }

        // Format coordinates ke format LINESTRING
        $coordinates = array_map(function ($point) {
            return "{$point[0]} {$point[1]}"; // longitude latitude
        }, $validated['coordinates']);

        $linestring = 'LINESTRING(' . implode(', ', $coordinates) . ')';

        // Update data line
        $line->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'category_id' => $validated['category_id'],
            'coordinates' => DB::raw("ST_GeomFromText('$linestring')"),
        ]);

        // Ambil kembali data line
        $location = DB::selectOne("SELECT ST_AsGeoJSON(coordinates) AS geojson FROM `lines` WHERE id = ?", [$line->id]);

        $geojson = json_decode($location->geojson, true);

        // Gabungkan semua untuk response
        $response = [
            'id' => $line->id,
            'name' => $line->name,
            'description' => $line->description,
            'category_id' => $line->category_id,
            'coordinates' => $geojson['coordinates'] ?? null,
        ];

        return response()->json($response, 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $line = Line::find($id);

        if (!$line) {
            return response()->json([
                'message' => 'Line not found.'
            ], 404);
        }

        $line->delete();

        return response()->json([
            'message' => 'Line deleted successfully.'
        ]);
    }

    public function overviewLine()
    {
        $lines = Line::with('category')->get()->map(function ($line) {
            return [
                'id' => $line->id,
                'name' => $line->name,
                'description' => $line->description,
                'coordinates' => $line->line_coordinates, // Ambil dari accessor
                'category_id' => $line->category_id,
                'category_name' => $line->category?->name, // tetap pakai optional chaining
                'color' => $line->category?->color, // tetap pakai optional chaining
            ];
        });

        return Inertia::render('MapOverviewLine', [
            'currentPath' => '/dashboard/line',
            'lines' => $lines,
        ]);
    }

    public function addLine()
    {
        $categories = LineCategory::all();
        return Inertia::render('MapAddLine', [
            'currentPath' => "/dashboard/line/add",
            'categories' => $categories
        ]);
    }

    public function editLine($id)
    {
        // Mengambil line berdasarkan ID menggunakan find() yang langsung mengambil satu data
        $line = Line::with('category')->find($id);

        if (!$line) {
            // Jika data line tidak ditemukan, render halaman 404
            return Inertia::render('NotFound');
        }

        // Mapping data line untuk format yang diinginkan
        $lineData = [
            'id' => $line->id,
            'name' => $line->name,
            'description' => $line->description,
            'coordinates' => $line->line_coordinates, // Ambil dari accessor
            'category_id' => $line->category_id,
            'category_name' => $line->category?->name, // tetap pakai optional chaining
            'color' => $line->category?->color, // tetap pakai optional chaining
        ];

        // Ambil semua kategori untuk ditampilkan di form
        $categories = LineCategory::all();

        // Render halaman MapEditMarker dengan data line dan kategori
        return Inertia::render('MapEditLine', [
            'currentPath' => '/dashboard/line/edit',
            'line' => $lineData,
            'categories' => $categories
        ]);
    }
}
