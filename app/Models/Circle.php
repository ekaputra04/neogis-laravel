<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Circle extends Model
{
    /** @use HasFactory<\Database\Factories\CircleFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'center',
        'radius',
        'category_id'
    ];

    protected $appends = ['latitude', 'longitude'];

    public function category()
    {
        return $this->belongsTo(CircleCategory::class, 'category_id');
    }

    public function getLatitudeAttribute()
    {
        return optional(DB::selectOne("SELECT ST_Y(center) AS latitude FROM `circles` WHERE id = ?", [$this->id]))->latitude;
    }

    public function getLongitudeAttribute()
    {
        return optional(DB::selectOne("SELECT ST_X(center) AS longitude FROM `circles` WHERE id = ?", [$this->id]))->longitude;
    }
}