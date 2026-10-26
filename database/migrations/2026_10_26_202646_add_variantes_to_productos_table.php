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
        Schema::table('productos', function (Blueprint $table) {
            $table->json('tallas')->nullable();  // ej: ["S", "M", "L", "XL"] o ["38", "40", "42"]
            $table->json('colores')->nullable(); // ej: [{"nombre": "Negro", "hex": "#000000"}, {"nombre": "Blanco", "hex": "#ffffff"}]
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn(['tallas', 'colores']);
        });
    }
};
