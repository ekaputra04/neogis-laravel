<?php

namespace App\Http\Controllers;

use App\Models\Polygon;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePolygonRequest;
use App\Http\Requests\UpdatePolygonRequest;
use App\Models\PolygonCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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
    public function store(Request $request)
    {
        // Validasi input dasar
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'coordinates' => 'required|array|min:3', // minimal 3 titik
            'category_id' => 'required|numeric',
        ]);

        // Validasi manual isi dari coordinates
        foreach ($validated['coordinates'] as $point) {
            if (!is_array($point) || count($point) != 2 || !is_numeric($point[0]) || !is_numeric($point[1])) {
                return response()->json([
                    'message' => 'Each coordinate must be an array of two numeric values [latitude, longitude].'
                ], 422);
            }
        }

        $coordinates = $validated['coordinates'];

        // Pastikan polygon tertutup (titik pertama == titik terakhir)
        $firstPoint = $coordinates[0];
        $lastPoint = end($coordinates);

        // Bandingkan nilai, bukan referensi array
        if ($firstPoint[0] != $lastPoint[0] || $firstPoint[1] != $lastPoint[1]) {
            $coordinates[] = $firstPoint; // Tambahkan titik pertama di akhir untuk menutup polygon
        }

        try {
            // Buat data dasar polygon tanpa koordinat
            $polygon = new Polygon();
            $polygon->name = $validated['name'];
            $polygon->description = $validated['description'] ?? null;
            $polygon->category_id = $validated['category_id'];
            $polygon->save();

            // Format ke WKT (Well-Known Text) untuk polygon yang valid
            $pointsStr = [];
            foreach ($coordinates as $point) {
                $pointsStr[] = $point[0] . ' ' . $point[1];
            }

            $polygonString = 'POLYGON((' . implode(',', $pointsStr) . '))';

            // Update polygon menggunakan query langsung untuk menangani data spatial
            DB::statement(
                'UPDATE `polygons` SET `coordinates` = ST_GeomFromText(?) WHERE id = ?',
                [$polygonString, $polygon->id]
            );

            // Ambil kembali data polygon dengan format yang tepat
            $location = DB::selectOne(
                "SELECT id, name, description, category_id, ST_AsGeoJSON(coordinates) AS geojson, created_at, updated_at 
                 FROM `polygons` 
                 WHERE id = ?",
                [$polygon->id]
            );

            // Siapkan response
            $geojson = json_decode($location->geojson, true);

            $response = [
                'id' => $polygon->id,
                'name' => $location->name,
                'description' => $location->description,
                'category_id' => $location->category_id,
                'coordinates' => $geojson['coordinates'] ?? null,
                'created_at' => $location->created_at,
                'updated_at' => $location->updated_at
            ];

            return response()->json($response, 201);
        } catch (\Exception $e) {
            // Jika polygon sudah dibuat tapi update gagal, hapus polygon
            if (isset($polygon) && $polygon->id) {
                $polygon->delete();
            }

            return response()->json([
                'message' => 'Failed to create polygon: ' . $e->getMessage()
            ], 500);
        }
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
    public function update(Request $request, $id)
    {
        // Cek apakah polygon dengan ID tersebut ada
        $polygon = Polygon::findOrFail($id);

        // Validasi input dasar
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'coordinates' => 'sometimes|required|array|min:3', // minimal 3 titik
            'category_id' => 'sometimes|required|numeric',
        ]);

        try {
            // Update atribut dasar polygon
            if (isset($validated['name'])) {
                $polygon->name = $validated['name'];
            }

            if (array_key_exists('description', $validated)) {
                $polygon->description = $validated['description'];
            }

            if (isset($validated['category_id'])) {
                $polygon->category_id = $validated['category_id'];
            }

            // Simpan perubahan non-spatial
            $polygon->save();

            // Jika ada koordinat yang diupdate
            if (isset($validated['coordinates'])) {
                // Validasi manual isi dari coordinates
                foreach ($validated['coordinates'] as $point) {
                    if (!is_array($point) || count($point) != 2 || !is_numeric($point[0]) || !is_numeric($point[1])) {
                        return response()->json([
                            'message' => 'Each coordinate must be an array of two numeric values [latitude, longitude].'
                        ], 422);
                    }
                }

                $coordinates = $validated['coordinates'];

                // Pastikan polygon tertutup (titik pertama == titik terakhir)
                $firstPoint = $coordinates[0];
                $lastPoint = end($coordinates);

                // Bandingkan nilai, bukan referensi array
                if ($firstPoint[0] != $lastPoint[0] || $firstPoint[1] != $lastPoint[1]) {
                    $coordinates[] = $firstPoint; // Tambahkan titik pertama di akhir untuk menutup polygon
                }

                // Format ke WKT (Well-Known Text) untuk polygon yang valid
                $pointsStr = [];
                foreach ($coordinates as $point) {
                    $pointsStr[] = $point[0] . ' ' . $point[1];
                }

                $polygonString = 'POLYGON((' . implode(',', $pointsStr) . '))';

                // Update polygon menggunakan query langsung untuk menangani data spatial
                DB::statement(
                    'UPDATE polygons SET coordinates = ST_GeomFromText(?) WHERE id = ?',
                    [$polygonString, $polygon->id]
                );
            }

            // Ambil kembali data polygon dengan format yang tepat
            $location = DB::selectOne(
                "SELECT id, name, description, category_id, ST_AsGeoJSON(coordinates) AS geojson, created_at, updated_at 
                 FROM `polygons` 
                 WHERE id = ?",
                [$polygon->id]
            );

            // Siapkan response
            $geojson = json_decode($location->geojson, true);

            $response = [
                'id' => $polygon->id,
                'name' => $location->name,
                'description' => $location->description,
                'category_id' => $location->category_id,
                'coordinates' => $geojson['coordinates'] ?? null,
                'created_at' => $location->created_at,
                'updated_at' => $location->updated_at
            ];

            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update polygon: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            // Cek apakah polygon dengan ID tersebut ada
            $polygon = Polygon::findOrFail($id);

            // Hapus polygon
            $polygon->delete();

            return response()->json([
                'message' => 'Polygon deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Polygon not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete polygon: ' . $e->getMessage()
            ], 500);
        }
    }

    public function overviewPolygon()
    {
        $polygons = DB::table('polygons')
            ->join('polygon_categories', 'polygons.category_id', '=', 'polygon_categories.id')
            ->select(
                'polygons.id',
                'polygons.name',
                'polygons.description',
                'polygons.category_id',
                'polygon_categories.name as category_name',
                'polygon_categories.color as color',
                DB::raw('ST_AsGeoJSON(polygons.coordinates) AS coordinates')
            )
            ->get()
            ->map(function ($polygon) {
                $geojson = json_decode($polygon->coordinates, true);

                // Pastikan hanya ambil bagian pertama dari koordinat Polygon
                $polygon->coordinates = $geojson['coordinates'][0] ?? [];

                return $polygon;
            });


        return Inertia::render('MapOverviewPolygon', [
            'currentPath' => '/dashboard/polygon',
            'polygons' => $polygons,
        ]);
    }

    public function addPolygon()
    {
        $categories = PolygonCategory::all();
        return Inertia::render('MapAddPolygon', [
            'currentPath' => "/dashboard/polygon/add",
            'categories' => $categories
        ]);
    }
}
