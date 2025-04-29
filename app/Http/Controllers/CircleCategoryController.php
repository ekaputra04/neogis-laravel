<?php

namespace App\Http\Controllers;

use App\Models\CircleCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCircleCategoryRequest;
use App\Http\Requests\UpdateCircleCategoryRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CircleCategoryController extends Controller
{
    public function getAllCircleCategories()
    {
        $circleCategories = CircleCategory::all();

        return response()->json($circleCategories);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $circleCategories = CircleCategory::all();

        return Inertia::render('CircleCategories', [
            'categories' => $circleCategories
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

        $category = CircleCategory::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'color' => $validated['color'],
        ]);

        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(CircleCategory $circleCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CircleCategory $circleCategory)
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

        $circleCategory = CircleCategory::find($id);

        if (!$circleCategory) {
            return response()->json(['message' => 'Circle category not found'], 404);
        }

        $circleCategory->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'color' => $validated['color'],
        ]);

        return response()->json($circleCategory, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $circleCategory = CircleCategory::find($id);

        if (!$circleCategory) {
            return response()->json([
                'message' => 'Circle category not found.'
            ], 404);
        }

        $circleCategory->delete();

        return response()->json([
            'message' => 'Circle category deleted successfully.'
        ]);
    }
}
