<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            $user = $request->user();
            $target = $user->role === 'admin' 
                ? route('admin.empresas.index', absolute: false)
                : ($user->empresa ? route('dashboard', ['empresa' => $user->empresa->slug], absolute: false) : '/');
            return redirect()->intended($target);
        }

        return Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }
}
