<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProductoController extends Controller
{
    public function index(Request $request)
    {
        $productos = $request->user()->empresa?->productos ?? [];
        return Inertia::render('productos', [
            'productos' => $productos
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'tallas' => 'nullable|array',
            'colores' => 'nullable|array',
        ], [
            'nombre.required' => 'El nombre del producto es obligatorio.',
            'precio.required' => 'El precio del producto es obligatorio.',
            'precio.numeric' => 'El precio debe ser un número válido.',
            'imagen.image' => 'El archivo seleccionado debe ser una imagen.',
            'imagen.mimes' => 'Formato no válido. Solo se permiten imágenes en JPG, PNG, WEBP o GIF.',
            'imagen.max' => 'La imagen no debe pesar más de 2 MB.',
        ]);

        $data = $request->all();

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('productos', 'public');
            $data['imagen'] = '/storage/' . $path;
        }

        $request->user()->empresa->productos()->create($data);

        return back();
    }

    public function update(Request $request, string $empresa, Producto $producto)
    {
        Gate::authorize('update', $producto);

        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'tallas' => 'nullable|array',
            'colores' => 'nullable|array',
        ], [
            'nombre.required' => 'El nombre del producto es obligatorio.',
            'precio.required' => 'El precio del producto es obligatorio.',
            'precio.numeric' => 'El precio debe ser un número válido.',
            'imagen.image' => 'El archivo seleccionado debe ser una imagen.',
            'imagen.mimes' => 'Formato no válido. Solo se permiten imágenes en JPG, PNG, WEBP o GIF.',
            'imagen.max' => 'La imagen no debe pesar más de 2 MB.',
        ]);

        $data = $request->except(['imagen']);

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('productos', 'public');
            $data['imagen'] = '/storage/' . $path;
        }

        $producto->update($data);

        return back();
    }

    public function destroy(string $empresa, Producto $producto)
    {
        Gate::authorize('delete', $producto);
        $producto->delete();
        return back();
    }
}
