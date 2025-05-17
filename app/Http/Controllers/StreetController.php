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
            'token' => $token
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
            'kondisi' => $kondisi,
            'token' => $token
        ]);
    }

    public function editStreet($id)
    {
        $API_URL = env('API_URL');
        $token = Session::get('external_api_token');

        $editedStreet = null;
        $provinsi = [];
        $kabupaten = [];
        $kecamatan = [];
        $desa = [];
        $selectedProvinsi = [];
        $selectedKabupaten = [];
        $selectedKecamatan = [];
        $selectedDesa = [];
        $eksisting = [];
        $jenis = [];
        $kondisi = [];

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer $token",
            ])->get("$API_URL/ruasjalan");

            Log::info('API Response', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $streets = $data['ruasjalan'] ?? [];

                $editedStreet = collect($streets)->firstWhere('id', (int) $id);

                Log::info('Edited street data', ['editedStreet' => $editedStreet]);
                if (!$editedStreet) {
                    return Inertia::render('NotFound');
                }
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

        try {
            $desa_id = $editedStreet["desa_id"];

            $responseSelected = Http::withHeaders([
                'Authorization' => "Bearer $token",
            ])->get("$API_URL/kecamatanbydesaid/$desa_id");

            Log::info('API Response', [
                'status' => $responseSelected->status(),
                'body' => $responseSelected->json()
            ]);

            if ($responseSelected->successful()) {
                $data = $responseSelected->json();
                $selectedProvinsi = $data['provinsi'] ?? [];
                $selectedKabupaten = $data['kabupaten'] ?? [];
                $selectedKecamatan = $data['kecamatan'] ?? [];
                $selectedDesa = $data['desa'] ?? [];
            } else {
                Log::error('API request failed', [
                    'status' => $responseSelected->status(),
                    'body' => $responseSelected->body()
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Exception during API request', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

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

        return Inertia::render('MapEditStreet', [
            'street' => $editedStreet,
            'provinsi' => $provinsi,
            'kabupaten' => $kabupaten,
            'kecamatan' => $kecamatan,
            'desa' => $desa,
            'eksisting' => $eksisting,
            'jenis' => $jenis,
            'kondisi' => $kondisi,
            'token' => $token,
            'selectedProvinsi' => $selectedProvinsi,
            'selectedKabupaten' => $selectedKabupaten,
            'selectedKecamatan' => $selectedKecamatan,
            'selectedDesa' => $selectedDesa
        ]);
    }
}
