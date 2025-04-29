<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Polygon extends Model
{
    /** @use HasFactory<\Database\Factories\PolygonFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category_id',
        // Tidak menyertakan 'coordinates' karena akan ditangani secara khusus dengan query spasial
    ];

    // Menentukan kolom mana yang di-hidden dari serialisasi
    protected $hidden = [
        'coordinates', // Menyembunyikan kolom coordinates spasial
    ];

    public function category()
    {
        return $this->belongsTo(PolygonCategory::class, 'category_id');
    }

    // Menetapkan accessor untuk mendapatkan koordinat dalam format GeoJSON
    public function getCoordinatesGeoJsonAttribute()
    {
        if (!$this->attributes['coordinates']) {
            return null;
        }

        $result = DB::selectOne(
            "SELECT ST_AsGeoJSON(coordinates) as geojson FROM `polygons` WHERE id = ?",
            [$this->id]
        );

        return $result ? json_decode($result->geojson, true) : null;
    }
}