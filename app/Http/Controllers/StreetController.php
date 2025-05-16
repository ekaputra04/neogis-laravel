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

    public function addStreet()
    {
        $API_URL = env('API_URL');
        $token = Session::get('external_api_token');

        $provinsi = [];
        $kabupaten = [];
        $kecamatan = [];
        $desa = [];
        $eksisting = [];
        $jenis = [];
        $kondisi = [];

        try {
            $responseLocation = Http::withHeaders(['Authorization' => "Bearer $token",])->get("$API_URL/mregion");

            if ($responseLocation->successful()) {
                $data = $responseLocation->json();
                $provinsi = $data['provinsi'] ?? [];
                $kabupaten = $data['kabupaten'] ?? [];
                $kecamatan = $data['kecamatan'] ?? [];
                $desa = $data['desa'] ?? [];
            } else {
                Log::error('API request failed', [
                    'status' => $responseLocation->status(),
                    'body' => $responseLocation->body()
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Exception during API request', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

        try {
            $responseEksisting = Http::withHeaders(['Authorization' => "Bearer $token",])->get("$API_URL/meksisting");

            if ($responseEksisting->successful()) {
                $data = $responseEksisting->json();
                $eksisting = $data['eksisting'] ?? [];
            } else {
                Log::error('API request failed', [
                    'status' => $responseEksisting->status(),
                    'body' => $responseEksisting->body()
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Exception during API request', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

        try {
            $responseJenis = Http::withHeaders(['Authorization' => "Bearer $token",])->get("$API_URL/mjenisjalan");

            if ($responseJenis->successful()) {
                $data = $responseJenis->json();
                $jenis = $data['eksisting'] ?? [];
            } else {
                Log::error('API request failed', [
                    'status' => $responseJenis->status(),
                    'body' => $responseJenis->body()
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Exception during API request', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

        try {
            $responseKondisi = Http::withHeaders(['Authorization' => "Bearer $token",])->get("$API_URL/mkondisi");

            if ($responseKondisi->successful()) {
                $data = $responseKondisi->json();
                $kondisi = $data['eksisting'] ?? [];
            } else {
                Log::error('API request failed', [
                    'status' => $responseKondisi->status(),
                    'body' => $responseKondisi->body()
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Exception during API request', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

        return Inertia::render('MapAddStreet', [
            'provinsi' => $provinsi,
            'kabupaten' => $kabupaten,
            'kecamatan' => $kecamatan,
            'desa' => $desa,
            'eksisting' => $eksisting,
            'jenis' => $jenis,
            'kondisi' => $kondisi
        ]);
    }

    public function store(Request $request)
    {
        $API_URL = env('API_URL');
        $token = Session::get('external_api_token');

        // Validasi input dasar
        $validated = $request->validate([
            'path' => 'required|string',
            'desa_id' => 'required|numeric',
            'kode_ruas' => 'required|string',
            'nama_ruas' => 'required|string',
            'panjang' => 'required|numeric',
            'lebar' => 'required|numeric',
            'eksisting_id' => 'required|numeric',
            'kondisi_id' => 'required|numeric',
            'jenisjalan_id' => 'required|numeric',
            'keterangan' => 'required|string',
        ]);

        try {
            $response = Http::withHeaders(['Authorization' => "Bearer $token",])->post("$API_URL/ruasjalan")->json($validated);

            Log::info('API Response', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);
        } catch (\Exception $e) {
            Log::error('Exception during API request', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

        return response()->json($validated, 201);
    }
}
