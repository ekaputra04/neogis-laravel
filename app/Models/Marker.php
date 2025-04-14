<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Marker extends Model
{
    protected $fillable = [
        'name',
        'description',
        'coordinates',
    ];

    protected $appends = ['latitude', 'longitude'];

    public function getLatitudeAttribute()
    {
        return optional(DB::selectOne("SELECT ST_Y(coordinates) AS latitude FROM markers WHERE id = ?", [$this->id]))->latitude;
    }

    public function getLongitudeAttribute()
    {
        return optional(DB::selectOne("SELECT ST_X(coordinates) AS longitude FROM markers WHERE id = ?", [$this->id]))->longitude;
    }
}
