<?php

use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProductoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Guest auth routes remain global and must be defined BEFORE the {empresa} catch-all
require __DIR__.'/auth-guest.php'; 

Route::get('/', function () {
    if (\Illuminate\Support\Facades\Auth::check() && \Illuminate\Support\Facades\Auth::user()->empresa) {
        return redirect()->route('dashboard', ['empresa' => \Illuminate\Support\Facades\Auth::user()->empresa->slug]);
    }
    return redirect('/login');
})->name('home');

Route::prefix('{empresa}')->group(function () {
    Route::get('/', function () {
        $tenant = app('tenant');
        $productos = $tenant ? $tenant->productos()->latest()->get() : \App\Models\Producto::all();

        return Inertia::render('welcome', [
            'productos' => $productos,
            'empresa' => $tenant
        ]);
    })->name('catalog.show');

    Route::post('/pedidos', [PedidoController::class, 'store'])->name('pedidos.store');

    Route::middleware(['auth'])->group(function () {
        Route::get('dashboard', [PedidoController::class, 'index'])->name('dashboard');

        Route::get('productos', [ProductoController::class, 'index'])->name('productos.index');
        Route::post('productos', [ProductoController::class, 'store'])->name('productos.store');
        Route::post('productos/{producto}', [ProductoController::class, 'update'])->name('productos.update.post');
        Route::patch('productos/{producto}', [ProductoController::class, 'update'])->name('productos.update');
        Route::delete('productos/{producto}', [ProductoController::class, 'destroy'])->name('productos.destroy');

        Route::get('personalizar', [\App\Http\Controllers\EmpresaPersonalizacionController::class, 'edit'])->name('personalizar.edit');
        Route::patch('personalizar', [\App\Http\Controllers\EmpresaPersonalizacionController::class, 'update'])->name('personalizar.update');

        // Move settings inside
        require __DIR__.'/settings.php';
        
        // Authenticated auth routes
        Route::get('verify-email', \App\Http\Controllers\Auth\EmailVerificationPromptController::class)
            ->name('verification.notice');

        Route::get('verify-email/{id}/{hash}', \App\Http\Controllers\Auth\VerifyEmailController::class)
            ->middleware(['signed', 'throttle:6,1'])
            ->name('verification.verify');

        Route::post('email/verification-notification', [\App\Http\Controllers\Auth\EmailVerificationNotificationController::class, 'store'])
            ->middleware('throttle:6,1')
            ->name('verification.send');

        Route::get('confirm-password', [\App\Http\Controllers\Auth\ConfirmablePasswordController::class, 'show'])
            ->name('password.confirm');

        Route::post('confirm-password', [\App\Http\Controllers\Auth\ConfirmablePasswordController::class, 'store']);

        Route::post('logout', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])
            ->name('logout');
    });
});

