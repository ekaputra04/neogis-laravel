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
use Illuminate\Http\Client\Response as HttpClientResponse;

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

            // Cek apakah email sudah ada di database lokal
            $localUserExists = User::where('email', $request->email)->exists();

            // Skenario 1: User sudah ada di lokal
            if ($localUserExists) {
                return $this->handleExistingLocalUser($request, $API_URL);
            }

            // Skenario 2: Buat user baru
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $externalResponse = Http::asForm()->post($API_URL . "/register", [
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
            ]);

            // Handle response API eksternal
            if ($externalResponse->json('meta.status') === 'failed') {
                DB::rollBack();
                return redirect()->back()->withErrors([
                    'email' => 'Email sudah terdaftar di sistem eksternal: ' . $externalResponse->json('meta.message')
                ]);
            }

            if (!$externalResponse->successful()) {
                DB::rollBack();
                return $this->handleExternalError($externalResponse);
            }

            // Simpan external ID jika register berhasil
            $user->update([
                'external_id' => $externalResponse->json('meta.data.id'),
                'external_synced_at' => now()
            ]);

            DB::commit();
            event(new Registered($user));
            return redirect()->route('login');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors([
                'external' => 'Terjadi kesalahan: ' . $e->getMessage()
            ]);
        }
    }

    private function handleExistingLocalUser(Request $request, string $API_URL)
    {
        $user = User::where('email', $request->email)->first();

        // Jika user sudah ada external_id (sudah sync)
        if ($user->external_id) {
            return redirect()->back()->withErrors([
                'email' => 'Email sudah terdaftar di sistem kami'
            ]);
        }

        // Jika belum sync, coba daftarkan ke API eksternal
        $externalResponse = Http::asForm()->post($API_URL . "/register", [
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
        ]);

        if ($externalResponse->json('meta.status') === 'failed') {
            return redirect()->back()->withErrors([
                'email' => 'Email sudah terdaftar di sistem eksternal: ' . $externalResponse->json('meta.message')
            ]);
        }

        if (!$externalResponse->successful()) {
            return $this->handleExternalError($externalResponse);
        }

        // Update user lokal dengan external ID
        $user->update([
            'external_id' => $externalResponse->json('meta.data.id'),
            'external_synced_at' => now(),
        ]);

        event(new Registered($user));
        return redirect()->route('login');
    }

    private function handleExternalError(HttpClientResponse $response)
    {
        $errorMessage = 'Gagal menghubungi sistem eksternal';

        if ($response->json('meta.message')) {
            $errorMessage = $response->json('meta.message');
        }

        return redirect()->back()->withErrors(['external' => $errorMessage]);
    }

    // public function store(Request $request)
    // {
    //     $API_URL = env('API_URL');

    //     $request->validate([
    //         'name' => ['required', 'string', 'max:255'],
    //         'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
    //         'password' => ['required', 'confirmed', Rules\Password::defaults()],
    //     ]);

    //     try {
    //         DB::beginTransaction();

    //         $user = User::create([
    //             'name' => $request->name,
    //             'email' => $request->email,
    //             'password' => Hash::make($request->password),
    //         ]);

    //         if (!$user) {
    //             DB::rollBack();
    //             return redirect()->back()->withErrors([
    //                 'external' => 'Gagal menyimpan user lokal.',
    //             ]);
    //         }

    //         // Kirim sebagai x-www-form-urlencoded
    //         $response = Http::asForm()->post($API_URL . "/register", [
    //             'name' => $request->name,
    //             'email' => $request->email,
    //             'password' => $request->password,
    //         ]);


    //         logger('External Register Response', [
    //             'status' => $response->status(),
    //             'body' => $response->body(),
    //             'headers' => $response->headers(),
    //         ]);


    //         if (!in_array($response->status(), [200, 201])) {
    //             DB::rollBack();
    //             return redirect()->back()->withErrors([
    //                 'external' => 'Gagal register ke sistem eksternal: ' . $response->json('message'),
    //             ]);
    //         }


    //         DB::commit();

    //         event(new Registered($user));

    //         return redirect()->route('login');
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return redirect()->back()->withErrors([
    //             'external' => 'Terjadi kesalahan saat register: ' . $e->getMessage(),
    //         ]);
    //     }
    // }
}
