<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
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

        $response = Http::asForm()->post($API_URL . '/login', [
            'email' => $request->email,
            'password' => $request->password,
        ]);

        if ($response->json('meta.code') !== 200) {
            return redirect()->back()->withErrors([
                'email' => 'Login ke sistem eksternal gagal: ' . $response->json('meta.message'),
            ]);
        }

        // simpan token
        $token = $response->json('meta.token');
        $expiredInSeconds = $response->json('meta.token-expired');
        $expiredAt = now()->addSeconds($expiredInSeconds);

        session([
            'external_api_token' => $token,
            'external_token_expired_at' => $expiredAt,
        ]);

        // Login lokal
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('maps.index', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
