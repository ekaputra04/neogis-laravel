<?php

namespace App\Http\Controllers;

use App\Models\MarkerCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMarkerCategoryRequest;
use App\Http\Requests\UpdateMarkerCategoryRequest;

class MarkerCategoryController extends Controller
{
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
    public function store(StoreMarkerCategoryRequest $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category = MarkerCategory::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(MarkerCategory $markerCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MarkerCategory $markerCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMarkerCategoryRequest $request, MarkerCategory $markerCategory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MarkerCategory $markerCategory)
    {
        //
    }
}
