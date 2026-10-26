<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $slug = \Illuminate\Support\Str::slug($request->nombre_empresa);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class.',email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'nombre_empresa' => 'required|string|max:255|unique:empresas,nombre_empresa|unique:empresas,slug',
            'celular' => 'required|string|max:30',
            'tipo' => 'required|string|max:255',
        ], [
            'email.unique' => 'Este correo electrónico ya está registrado. Por favor inicia sesión o usa otro.',
            'nombre_empresa.unique' => 'El nombre de esta tienda ya está en uso. Por favor elige otro nombre para tu negocio.',
            'email.email' => 'Ingresa un correo electrónico válido.',
            'password.confirmed' => 'La confirmación de la contraseña no coincide.',
            'celular.required' => 'El número de WhatsApp es obligatorio.',
        ]);

        // Verificar además si el slug resultante ya existe
        if (Empresa::where('slug', $slug)->exists()) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'nombre_empresa' => 'El nombre de esta tienda ya está en uso. Por favor elige otro nombre para tu negocio.',
            ]);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $empresa = $user->empresa()->create([
            'nombre_empresa' => $request->nombre_empresa,
            'celular' => $request->celular,
            'tipo' => $request->tipo,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard', ['empresa' => $empresa->slug]);
    }

    /**
     * Check if a store name or email is already taken in real time.
     */
    public function checkAvailability(Request $request)
    {
        $type = $request->query('type');
        $value = trim($request->query('value', ''));

        if (!$value) {
            return response()->json(['available' => true]);
        }

        if ($type === 'email') {
            $exists = User::where('email', strtolower($value))->exists();
            return response()->json([
                'available' => !$exists,
                'message' => $exists ? 'Este correo ya está registrado.' : null,
            ]);
        }

        if ($type === 'empresa') {
            $slug = \Illuminate\Support\Str::slug($value);
            $exists = Empresa::where('nombre_empresa', $value)
                ->orWhere('slug', $slug)
                ->exists();

            return response()->json([
                'available' => !$exists,
                'message' => $exists ? 'El nombre de esta tienda ya está en uso.' : null,
            ]);
        }

        return response()->json(['available' => true]);
    }
}
