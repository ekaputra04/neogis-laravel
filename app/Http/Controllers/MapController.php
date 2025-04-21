<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Marker;
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
        return Inertia::render('MapOverview', [
            'currentPath' => '/dashboard',
            'markers' => $markers,
        ]);
    }
}
