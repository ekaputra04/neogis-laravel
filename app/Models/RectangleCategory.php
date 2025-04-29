<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RectangleCategory extends Model
{
    /** @use HasFactory<\Database\Factories\RectangleCategoryFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'color',
    ];

    public function rectangles()
    {
        return $this->hasMany(Rectangle::class, 'category_id');
    }
}
