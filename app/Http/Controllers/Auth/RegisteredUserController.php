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

            // Simpan user lokal
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->string('password')),
            ]);

            // Register ke API eksternal
            $response = Http::asForm()->post($API_URL, [
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
            ]);

            if (!$response->successful()) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Gagal register ke sistem eksternal.',
                    'error' => $response->json(),
                ], 500);
            }

            DB::commit();

            // Trigger event jika diperlukan
            event(new Registered($user));

            // Redirect ke login page
            return redirect()->route('login');
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Terjadi kesalahan saat register.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
