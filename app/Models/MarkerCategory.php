<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarkerCategory extends Model
{
    /** @use HasFactory<\Database\Factories\MarkerCategoryFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function markers()
    {
        return $this->hasMany(Marker::class, 'category_id');
    }
}
