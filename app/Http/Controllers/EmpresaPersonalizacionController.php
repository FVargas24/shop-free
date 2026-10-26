<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmpresaPersonalizacionController extends Controller
{
    public function edit(Request $request)
    {
        $empresa = $request->user()->empresa;

        return Inertia::render('personalizar', [
            'empresa' => $empresa,
            'productosMuestra' => $empresa->productos()->take(4)->get()
        ]);
    }

    public function update(Request $request)
    {
        $empresa = $request->user()->empresa;

        $validated = $request->validate([
            'nombre_empresa' => 'required|string|max:255',
            'celular' => 'nullable|string|max:30',
            'descripcion' => 'nullable|string|max:500',
            'tema_color' => 'required|string|in:emerald,indigo,rose,amber,violet,slate',
            'fondo_estilo' => 'required|string|in:dots,grid,aurora,mesh,clean,dark-slate,cyber-circuit,midnight-glass',
            'tipografia' => 'required|string|in:inter,outfit,poppins,dmsans,playfair,cinzel,jakarta',
            'layout_vista' => 'required|string|in:grid,list',
            'banner_url' => 'nullable|string',
            'logo_url' => 'nullable|string',
        ]);

        $empresa->update($validated);

        return back()->with('success', 'Catálogo personalizado con éxito');
    }
}
