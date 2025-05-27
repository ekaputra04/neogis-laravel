<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StreetController extends Controller
{
    public function overviewStreet()
    {


        return Inertia::render('MapOverviewStreet');
    }

    public function overviewLocation()
    {
        $API_URL = env('API_URL');
        $token = Session::get('external_api_token');

        $provinsi = [];
        $kabupaten = [];
        $kecamatan = [];
        $desa = [];

        try {
            $response = Http::withHeaders(['Authorization' => "Bearer $token",])->get("$API_URL/mregion");

            Log::info('API Response', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $provinsi = $data['provinsi'] ?? [];
                $kabupaten = $data['kabupaten'] ?? [];
                $kecamatan = $data['kecamatan'] ?? [];
                $desa = $data['desa'] ?? [];
            } else {
                Log::error('API request failed', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Exception during API request', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

        return Inertia::render('StreetLocation', [
            'provinsi' => $provinsi,
            'kabupaten' => $kabupaten,
            'kecamatan' => $kecamatan,
            'desa' => $desa,
        ]);
    }

    public function addStreet()
    {
        return Inertia::render('MapAddStreet',);
    }

    public function editStreet($id)
    {
        return Inertia::render('MapEditStreet', [
            'id' => $id,
        ]);
    }
}
