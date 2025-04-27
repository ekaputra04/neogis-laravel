<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Line extends Model
{
    /** @use HasFactory<\Database\Factories\LineFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'coordinates',
        'category_id',
    ];

    // Jika kamu ingin langsung mengambil array koordinat, bisa pakai accessor ini
    protected $appends = ['line_coordinates'];

    public function category()
    {
        return $this->belongsTo(LineCategory::class, 'category_id');
    }

    public function getLineCoordinatesAttribute()
    {
        $result = DB::selectOne("SELECT ST_AsGeoJSON(coordinates) as geojson FROM lines WHERE id = ?", [$this->id]);

        if ($result && $result->geojson) {
            $geojson = json_decode($result->geojson, true);
            return $geojson['coordinates'] ?? null;
        }

        return null;
    }
}