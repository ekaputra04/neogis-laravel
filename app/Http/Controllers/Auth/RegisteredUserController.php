<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $API_URL = env('API_URL');

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            if (!$user) {
                DB::rollBack();
                return redirect()->back()->withErrors([
                    'external' => 'Gagal menyimpan user lokal.',
                ]);
            }

            // Kirim sebagai x-www-form-urlencoded
            $response = Http::asForm()->post($API_URL . "/register", [
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
            ]);


            logger('External Register Response', [
                'status' => $response->status(),
                'body' => $response->body(),
                'headers' => $response->headers(),
            ]);


            if (!in_array($response->status(), [200, 201])) {
                DB::rollBack();
                return redirect()->back()->withErrors([
                    'external' => 'Gagal register ke sistem eksternal: ' . $response->json('message'),
                ]);
            }


            DB::commit();

            event(new Registered($user));

            return redirect()->route('login');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors([
                'external' => 'Terjadi kesalahan saat register: ' . $e->getMessage(),
            ]);
        }
    }
}
