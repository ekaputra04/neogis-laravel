<?php

namespace App\Http\Controllers;

use App\Models\RectangleCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRectangleCategoryRequest;
use App\Http\Requests\UpdateRectangleCategoryRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RectangleCategoryController extends Controller
{
    public function getAllRectangleCategories()
    {
        $rectangleCategories = RectangleCategory::all();

        return response()->json($rectangleCategories);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rectangleCategories = RectangleCategory::all();

        return Inertia::render('RectangleCategories', [
            'currentPath' => "/dashboard/rectangle/add",
            'categories' => $rectangleCategories
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

        $category = RectangleCategory::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'color' => $validated['color'],
        ]);

        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(RectangleCategory $rectangleCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RectangleCategory $rectangleCategory)
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

        $rectangleCategory = RectangleCategory::find($id);

        if (!$rectangleCategory) {
            return response()->json(['message' => 'Rectangle category not found'], 404);
        }

        $rectangleCategory->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'color' => $validated['color'],
        ]);

        return response()->json($rectangleCategory, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $rectangleCategory = RectangleCategory::find($id);

        if (!$rectangleCategory) {
            return response()->json([
                'message' => 'Rectangle category not found.'
            ], 404);
        }

        $rectangleCategory->delete();

        return response()->json([
            'message' => 'Rectangle category deleted successfully.'
        ]);
    }
}
