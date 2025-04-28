<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Rectangle extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'coordinates',
        'category_id',
    ];

    protected $casts = [
        'coordinates' => 'array', // agar bisa di-cast otomatis ke array
    ];

    protected $appends = ['rectangle_coordinates'];

    public function category()
    {
        return $this->belongsTo(RectangleCategory::class, 'category_id');
    }

    /**
     * Accessor untuk mengambil coordinates dalam bentuk array [ [ [lng, lat], ...] ]
     */
    public function getRectangleCoordinatesAttribute()
    {
        if (!$this->coordinates) {
            return [];
        }

        // Ambil GeoJSON dari DB
        $result = DB::selectOne(
            "SELECT ST_AsGeoJSON(coordinates) as geojson FROM rectangles WHERE id = ?",
            [$this->id]
        );

        if ($result && $result->geojson) {
            $geojson = json_decode($result->geojson, true);

            // GeoJSON Polygon berbentuk: { "type": "Polygon", "coordinates": [ [ [lng, lat], [lng, lat], ... ] ] }
            if (isset($geojson['coordinates']) && is_array($geojson['coordinates'])) {
                return $geojson['coordinates'][0] ?? [];
                // ambil level pertama (karena coordinates[0] itu array dari titik-titik polygon)
            }
        }

        return [];
    }
}
