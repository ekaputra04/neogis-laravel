<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class CheckExternalApiToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $token = Session::get('external_api_token');
        $expiredAt = Session::get('external_token_expired_at');

        if (!$token || !$expiredAt || Carbon::now()->greaterThanOrEqualTo(Carbon::parse($expiredAt))) {
            return redirect()->route('login');
        }

        return $next($request);
    }
}
