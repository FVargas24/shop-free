<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminEmpresasController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Acceso restringido a Administradores.');
        }

        $empresas = Empresa::with(['user', 'productos'])
            ->withCount(['productos', 'pedidos'])
            ->latest()
            ->get();

        return Inertia::render('admin/empresas', [
            'empresas' => $empresas,
        ]);
    }

    public function toggleStatus(Request $request, Empresa $empresa)
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Acceso restringido a Administradores.');
        }

        $empresa->activo = !$empresa->activo;
        $empresa->save();

        return back()->with('success', "Estado de {$empresa->nombre_empresa} actualizado.");
    }

    public function extendTrial(Request $request, Empresa $empresa)
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Acceso restringido a Administradores.');
        }

        $days = (int) $request->input('dias', 30);
        $baseDate = $empresa->fecha_expiracion && $empresa->fecha_expiracion > now()
            ? $empresa->fecha_expiracion
            : now();

        $empresa->fecha_expiracion = \Carbon\Carbon::parse($baseDate)->addDays($days);
        $empresa->activo = true;
        $empresa->save();

        return back()->with('success', "Se extendió el período de {$empresa->nombre_empresa} por {$days} días.");
    }
}
