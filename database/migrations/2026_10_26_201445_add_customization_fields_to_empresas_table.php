<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->string('tema_color')->default('emerald')->nullable();
            $table->string('fondo_estilo')->default('dots')->nullable(); // dots, grid, aurora, clean, mesh
            $table->string('tipografia')->default('inter')->nullable();  // inter, outfit, playfair, jakarta
            $table->string('banner_url')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('descripcion')->nullable();
            $table->string('layout_vista')->default('grid')->nullable(); // grid, list
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->dropColumn([
                'tema_color',
                'fondo_estilo',
                'tipografia',
                'banner_url',
                'logo_url',
                'descripcion',
                'layout_vista'
            ]);
        });
    }
};
