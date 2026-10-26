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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('empresa')->after('email'); // 'admin' | 'empresa'
        });

        Schema::table('empresas', function (Blueprint $table) {
            $table->boolean('activo')->default(true)->after('tipo');
            $table->timestamp('fecha_expiracion')->nullable()->after('activo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });

        Schema::table('empresas', function (Blueprint $table) {
            $table->dropColumn(['activo', 'fecha_expiracion']);
        });
    }
};
