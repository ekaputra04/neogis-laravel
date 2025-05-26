<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CheckExternalApiToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->cookie('external_api_token');
        $expiredAt = $request->cookie('external_token_expired_at');

        Log::info('CheckExternalApiToken', [
            'token' => $token ? 'exists' : 'missing',
            'expired_at' => $expiredAt,
            'current_time' => Carbon::now()->toDateTimeString(),
            'is_inertia' => $request->header('X-Inertia'),
        ]);

        if (!$token || !$expiredAt) {
            Log::warning('Missing token or expiration time');
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            $cookie1 = cookie()->forget('external_api_token');
            $cookie2 = cookie()->forget('external_token_expired_at');
            return $request->header('X-Inertia')
                ? response()->json(['error' => 'Sesi tidak ditemukan'], 409)->withCookie($cookie1)->withCookie($cookie2)
                : redirect()->route('login')->with('error', 'Sesi API eksternal tidak ditemukan.')->withCookie($cookie1)->withCookie($cookie2);
        }

        try {
            if (Carbon::now()->greaterThanOrEqualTo(Carbon::parse($expiredAt))) {
                Log::warning('Token expired', ['expired_at' => $expiredAt]);
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                $cookie1 = cookie()->forget('external_api_token');
                $cookie2 = cookie()->forget('external_token_expired_at');
                return $request->header('X-Inertia')
                    ? response()->json(['error' => 'Sesi kedaluwarsa'], 409)->withCookie($cookie1)->withCookie($cookie2)
                    : redirect()->route('login')->with('error', 'Sesi API eksternal telah kedaluwarsa.')->withCookie($cookie1)->withCookie($cookie2);
            }
        } catch (\Exception $e) {
            Log::error('Error parsing token expiration', ['error' => $e->getMessage()]);
            $cookie1 = cookie()->forget('external_api_token');
            $cookie2 = cookie()->forget('external_token_expired_at');
            return $request->header('X-Inertia')
                ? response()->json(['error' => 'Kesalahan sesi'], 500)->withCookie($cookie1)->withCookie($cookie2)
                : redirect()->route('login')->with('error', 'Kesalahan pada sesi.')->withCookie($cookie1)->withCookie($cookie2);
        }

        return $next($request);
    }
}
