<?php

namespace App\Http\Controllers;

use App\Models\RectangleCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRectangleCategoryRequest;
use App\Http\Requests\UpdateRectangleCategoryRequest;

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
    public function index(): void
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
    public function store(StoreRectangleCategoryRequest $request)
    {
        //
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
    public function update(UpdateRectangleCategoryRequest $request, RectangleCategory $rectangleCategory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RectangleCategory $rectangleCategory)
    {
        //
    }
}
