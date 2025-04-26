<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LineCategory extends Model
{
    /** @use HasFactory<\Database\Factories\LineCategoryFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'color',
    ];

    // public function markers()
    // {
    //     return $this->hasMany(Marker::class, 'category_id');
    // }
}
