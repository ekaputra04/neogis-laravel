<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PolygonCategory extends Model
{
    /** @use HasFactory<\Database\Factories\PolygonCategoryFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'color',
    ];

    public function polygons()
    {
        return $this->hasMany(Polygon::class, 'category_id');
    }
}
