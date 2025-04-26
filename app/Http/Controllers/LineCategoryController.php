<?php

namespace App\Http\Controllers;

use App\Models\LineCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLineCategoryRequest;
use App\Http\Requests\UpdateLineCategoryRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LineCategoryController extends Controller
{
    public function getAllLineCategories()
    {
        $lineCategories = LineCategory::all();

        return response()->json($lineCategories);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lineCategories = LineCategory::all();

        return Inertia::render('LineCategories', [
            'currentPath' => "/dashboard/line/add",
            'categories' => $lineCategories
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

        $category = LineCategory::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'color' => $validated['color'],
        ]);

        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(LineCategory $lineCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LineCategory $lineCategory)
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

        $lineCategory = LineCategory::find($id);

        if (!$lineCategory) {
            return response()->json(['message' => 'Line category not found'], 404);
        }

        $lineCategory->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'color' => $validated['color'],
        ]);

        return response()->json($lineCategory, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $lineCategory = LineCategory::find($id);

        if (!$lineCategory) {
            return response()->json([
                'message' => 'Line category not found.'
            ], 404);
        }

        $lineCategory->delete();

        return response()->json([
            'message' => 'Line category deleted successfully.'
        ]);
    }
}