<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    // public function store(LoginRequest $request): RedirectResponse
    // {
    //     $request->authenticate();

    //     $request->session()->regenerate();

    //     return redirect()->intended(route('maps.index', absolute: false));
    // }

    public function store(LoginRequest $request): RedirectResponse
    {
        $API_URL = env('API_URL');

        try {
            // Kirim permintaan login ke API eksternal
            $response = Http::asForm()->post($API_URL . '/login', [
                'email' => $request->email,
                'password' => $request->password,
            ]);

            // Periksa apakah login gagal
            if ($response->json('meta.code') !== 200) {
                return redirect()->back()->withErrors([
                    'email' => 'Login ke sistem eksternal gagal: ' . ($response->json('meta.message') ?? 'Unknown error'),
                ]);
            }

            // Ambil token dan waktu kedaluwarsa
            $token = $response->json('meta.token');
            $expiredInSeconds = $response->json('meta.token-expired');

            if (!$token || !$expiredInSeconds) {
                Log::error('Invalid API response: missing token or expiration time', [
                    'response' => $response->json(),
                ]);
                return redirect()->back()->withErrors([
                    'email' => 'Respons API tidak valid.',
                ]);
            }

            // Hitung waktu kedaluwarsa
            $expiredAt = now()->addSeconds($expiredInSeconds);

            // Buat cookie untuk token dan waktu kedaluwarsa
            $tokenCookie = cookie(
                'external_api_token',
                $token,
                $expiredInSeconds / 60, // Durasi dalam menit
                null, // Path
                null, // Domain
                true, // Secure (hanya HTTPS)
                true, // HttpOnly
                false, // Raw
                'Strict' // SameSite
            );

            $expiredAtCookie = cookie(
                'external_token_expired_at',
                $expiredAt->toDateTimeString(),
                $expiredInSeconds / 60,
                null,
                null,
                true,
                true,
                false,
                'Strict'
            );

            // Cari atau buat user lokal
            $user = User::where('email', $request->email)->first();
            if (!$user) {
                $user = User::create([
                    'name' => 'User',
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                ]);
            }

            // Login lokal dengan Laravel Breeze
            $request->authenticate();
            $request->session()->regenerate();

            // Kembalikan redirect dengan cookie
            return redirect()->intended(route('maps.index', absolute: false))
                ->withCookie($tokenCookie)
                ->withCookie($expiredAtCookie);
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage(), [
                'email' => $request->email,
            ]);
            return redirect()->back()->withErrors([
                'email' => 'Terjadi kesalahan saat login: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    // public function destroy(Request $request): RedirectResponse
    // {
    //     Auth::guard('web')->logout();

    //     $request->session()->invalidate();

    //     $request->session()->regenerateToken();

    //     return redirect('/');
    // }

    public function destroy(Request $request): RedirectResponse
    {
        $API_URL = env('API_URL');
        $token = Session::get('external_api_token');

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer $token"
            ])->post("$API_URL/logout");

            Log::info('API Logout Response', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            if ($response->successful()) {
                // Logout dari Laravel
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                Session::forget('external_api_token');


                return redirect('/')->with('message', 'Logout berhasil');
            } else {
                Log::error('External API logout failed', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return redirect()->back()->withErrors('Gagal logout dari server eksternal.');
            }
        } catch (\Exception $e) {
            Log::error('Exception during API logout', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->withErrors('Terjadi kesalahan saat logout.');
        }
    }
}
