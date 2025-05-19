<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Circle;
use App\Models\CircleCategory;
use App\Models\Line;
use App\Models\LineCategory;
use App\Models\Marker;
use App\Models\MarkerCategory;
use App\Models\PolygonCategory;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MapController extends Controller
{
    public function mapOverview()
    {
        $markers = Marker::with('category')->get()->map(function ($marker) {
            return [
                'id' => $marker->id,
                'name' => $marker->name,
                'description' => $marker->description,
                'latitude' => $marker->latitude,
                'longitude' => $marker->longitude,
                'category_name' => $marker->category?->name,
            ];
        });

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

        $circles = Circle::with('category')->get()->map(function ($circle) {
            return [
                'id' => $circle->id,
                'name' => $circle->name,
                'description' => $circle->description,
                'latitude' => $circle->latitude,
                'longitude' => $circle->longitude,
                'radius' => $circle->radius,
                'category_name' => $circle->category?->name,
                'color' => $circle->category?->color,
            ];
        });

        $markerCategories = MarkerCategory::count();
        $lineCategories = LineCategory::count();
        $polygonCategories = PolygonCategory::count();
        $circleCategories = CircleCategory::count();

        $API_KEY_GEOCODING = env('GEOCODING_API_KEY');

        return Inertia::render('MapOverview', [
            'currentPath' => '/dashboard',
            'markers' => $markers,
            'lines' => $lines,
            'polygons' => $polygons,
            'circles' => $circles,
            'markerCategories' => $markerCategories,
            'lineCategories' => $lineCategories,
            'polygonCategories' => $polygonCategories,
            'circleCategories' => $circleCategories,
            // 'API_KEY_GEOCODING' => $API_KEY_GEOCODING
        ]);
    }
}
