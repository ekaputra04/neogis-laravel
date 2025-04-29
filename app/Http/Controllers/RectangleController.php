<?php

namespace App\Http\Controllers;

use App\Models\Rectangle;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRectangleRequest;
use App\Http\Requests\UpdateRectangleRequest;
use App\Models\RectangleCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RectangleController extends Controller
{

    public function getAllRectangles()
    {
        // $rectangles = DB::table('rectangles')
        //     ->select(
        //         'id',
        //         'name',
        //         'description',
        //         DB::raw('ST_AsGeoJSON(coordinates) AS coordinates')
        //     )
        //     ->get()
        //     ->map(function ($rectangle) {
        //         $geojson = json_decode($rectangle->coordinates, true);

        //         // Pastikan hanya ambil bagian pertama dari koordinat Polygon
        //         $rectangle->coordinates = $geojson['coordinates'][0] ?? [];

        //         return $rectangle;
        //     });

        $rectangles = DB::table('rectangles')
            ->join('rectangle_categories', 'rectangles.category_id', '=', 'rectangle_categories.id')
            ->select(
                'rectangles.id',
                'rectangles.name',
                'rectangles.description',
                'rectangles.category_id',
                'rectangle_categories.name as category_name',
                'rectangle_categories.color as category_color',
                DB::raw('ST_AsGeoJSON(rectangles.coordinates) AS coordinates')
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
    public function store(Request $request)
    {
        // Validasi input dasar
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'coordinates' => 'required|array|min:4', // minimal 4 titik
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
            // Buat data dasar rectangle tanpa koordinat
            $rectangle = new Rectangle();
            $rectangle->name = $validated['name'];
            $rectangle->description = $validated['description'] ?? null;
            $rectangle->category_id = $validated['category_id'];
            $rectangle->save();

            // Format ke WKT (Well-Known Text) untuk polygon yang valid
            $pointsStr = [];
            foreach ($coordinates as $point) {
                $pointsStr[] = $point[0] . ' ' . $point[1];
            }

            $polygonString = 'POLYGON((' . implode(',', $pointsStr) . '))';

            // Update rectangle menggunakan query langsung untuk menangani data spatial
            DB::statement(
                'UPDATE rectangles SET coordinates = ST_GeomFromText(?) WHERE id = ?',
                [$polygonString, $rectangle->id]
            );

            // Ambil kembali data rectangle dengan format yang tepat
            $location = DB::selectOne(
                "SELECT id, name, description, category_id, ST_AsGeoJSON(coordinates) AS geojson, created_at, updated_at 
                 FROM rectangles 
                 WHERE id = ?",
                [$rectangle->id]
            );

            // Siapkan response
            $geojson = json_decode($location->geojson, true);

            $response = [
                'id' => $rectangle->id,
                'name' => $location->name,
                'description' => $location->description,
                'category_id' => $location->category_id,
                'coordinates' => $geojson['coordinates'] ?? null,
                'created_at' => $location->created_at,
                'updated_at' => $location->updated_at
            ];

            return response()->json($response, 201);
        } catch (\Exception $e) {
            // Jika rectangle sudah dibuat tapi update gagal, hapus rectangle
            if (isset($rectangle) && $rectangle->id) {
                $rectangle->delete();
            }

            return response()->json([
                'message' => 'Failed to create rectangle: ' . $e->getMessage()
            ], 500);
        }
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
    public function update(Request $request, $id)
    {
        // Cek apakah rectangle dengan ID tersebut ada
        $rectangle = Rectangle::findOrFail($id);

        // Validasi input dasar
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'coordinates' => 'sometimes|required|array|min:4', // minimal 4 titik
            'category_id' => 'sometimes|required|numeric',
        ]);

        try {
            // Update atribut dasar rectangle
            if (isset($validated['name'])) {
                $rectangle->name = $validated['name'];
            }

            if (array_key_exists('description', $validated)) {
                $rectangle->description = $validated['description'];
            }

            if (isset($validated['category_id'])) {
                $rectangle->category_id = $validated['category_id'];
            }

            // Simpan perubahan non-spatial
            $rectangle->save();

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

                // Update rectangle menggunakan query langsung untuk menangani data spatial
                DB::statement(
                    'UPDATE rectangles SET coordinates = ST_GeomFromText(?) WHERE id = ?',
                    [$polygonString, $rectangle->id]
                );
            }

            // Ambil kembali data rectangle dengan format yang tepat
            $location = DB::selectOne(
                "SELECT id, name, description, category_id, ST_AsGeoJSON(coordinates) AS geojson, created_at, updated_at 
                 FROM rectangles 
                 WHERE id = ?",
                [$rectangle->id]
            );

            // Siapkan response
            $geojson = json_decode($location->geojson, true);

            $response = [
                'id' => $rectangle->id,
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
                'message' => 'Failed to update rectangle: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            // Cek apakah rectangle dengan ID tersebut ada
            $rectangle = Rectangle::findOrFail($id);

            // Hapus rectangle
            $rectangle->delete();

            return response()->json([
                'message' => 'Rectangle deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Rectangle not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete rectangle: ' . $e->getMessage()
            ], 500);
        }
    }

    public function overviewRectangle()
    {
        $rectangles = DB::table('rectangles')
            ->join('rectangle_categories', 'rectangles.category_id', '=', 'rectangle_categories.id')
            ->select(
                'rectangles.id',
                'rectangles.name',
                'rectangles.description',
                'rectangles.category_id',
                'rectangle_categories.name as category_name',
                'rectangle_categories.color as color',
                DB::raw('ST_AsGeoJSON(rectangles.coordinates) AS coordinates')
            )
            ->get()
            ->map(function ($rectangle) {
                $geojson = json_decode($rectangle->coordinates, true);

                // Pastikan hanya ambil bagian pertama dari koordinat Polygon
                $rectangle->coordinates = $geojson['coordinates'][0] ?? [];

                return $rectangle;
            });

        // dd($rectangles);

        return Inertia::render('MapOverviewRectangle', [
            'currentPath' => '/dashboard/rectangle',
            'rectangles' => $rectangles,
        ]);

        // return Inertia::render('MapOverviewRectangle',);
    }

    public function addRectangle()
    {
        $categories = RectangleCategory::all();
        return Inertia::render('MapAddRectangle', [
            'currentPath' => "/dashboard/rectangle/add",
            'categories' => $categories
        ]);
    }
}
