<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StreetController extends Controller
{
    public function overviewStreet()
    {
        $API_URL = env('API_URL');
        $token = Session::get('external_api_token');

        $streets = [];

        try {
            $response = Http::withHeaders(['Authorization' => "Bearer $token",])->get("$API_URL/ruasjalan");

            Log::info('API Response', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $streets = $data['ruasjalan'] ?? [];

                Log::info('Streets data for frontend', ['streets' => $streets]);
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

        return Inertia::render('MapOverviewStreet', [
            'streets' => $streets,
        ]);
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
}
