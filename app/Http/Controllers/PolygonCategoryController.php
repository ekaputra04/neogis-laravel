<?php

namespace App\Http\Controllers;

use App\Models\PolygonCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePolygonCategoryRequest;
use App\Http\Requests\UpdatePolygonCategoryRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PolygonCategoryController extends Controller
{
    public function getAllPolygonCategories()
    {
        $polygonCategories = PolygonCategory::all();

        return response()->json($polygonCategories);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $polygonCategories = PolygonCategory::all();

        return Inertia::render('PolygonCategories', [
            'currentPath' => "/dashboard/polygon/add",
            'categories' => $polygonCategories
        ]);
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        $category = PolygonCategory::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'color' => $validated['color'],
        ]);

        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(PolygonCategory $polygonCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PolygonCategory $polygonCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        $polygonCategory = PolygonCategory::find($id);

        if (!$polygonCategory) {
            return response()->json(['message' => 'Polygon category not found'], 404);
        }

        $polygonCategory->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'color' => $validated['color'],
        ]);

        return response()->json($polygonCategory, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $polygonCategory = PolygonCategory::find($id);

        if (!$polygonCategory) {
            return response()->json([
                'message' => 'Polygon category not found.'
            ], 404);
        }

        $polygonCategory->delete();

        return response()->json([
            'message' => 'Polygon category deleted successfully.'
        ]);
    }
}
