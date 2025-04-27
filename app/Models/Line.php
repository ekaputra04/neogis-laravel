<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Line extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'coordinates',
        'category_id',
    ];

    // Menambahkan property virtual 'line_coordinates'
    protected $appends = ['line_coordinates'];

    public function category()
    {
        return $this->belongsTo(LineCategory::class, 'category_id');
    }

    // Accessor untuk mengambil coordinates dalam bentuk array
    public function getLineCoordinatesAttribute()
    {
        if (!$this->coordinates) {
            return null;
        }

        $result = DB::selectOne("SELECT ST_AsGeoJSON(coordinates) as geojson FROM lines WHERE id = ?", [$this->id]);

        if ($result && $result->geojson) {
            $geojson = json_decode($result->geojson, true);
            return $geojson['coordinates'] ?? null;
        }

        return null;
    }
}