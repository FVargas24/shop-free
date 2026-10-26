<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    //
    protected $fillable = [
        'user_id',
        'nombre_empresa',
        'slug',
        'celular',
        'tipo',
        'activo',
        'fecha_expiracion',
        'tema_color',
        'fondo_estilo',
        'tipografia',
        'banner_url',
        'logo_url',
        'descripcion',
        'layout_vista'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($empresa) {
            if (empty($empresa->slug)) {
                $slug = \Illuminate\Support\Str::slug($empresa->nombre_empresa);
                $originalSlug = $slug;
                $count = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = $originalSlug . '-' . $count++;
                }
                $empresa->slug = $slug;
            }

            if (empty($empresa->fecha_expiracion)) {
                // 1 mes gratis por defecto
                $empresa->fecha_expiracion = now()->addMonth();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function productos()
    {
        return $this->hasMany(Producto::class);
    }

    public function pedidos()
    {
        return $this->hasMany(Pedido::class);
    }
}
