<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'ronald@miracode.tech'],
            [
                'name' => 'Ronald Gutierrez Flores',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]
        );

        if ($admin->role !== 'admin') {
            $admin->update(['role' => 'admin']);
        }

        if (!$admin->empresa) {
            $admin->empresa()->create([
                'nombre_empresa' => 'Prueba',
                'slug' => 'prueba',
                'celular' => '71231231',
                'tipo' => 'catalogo',
                'activo' => true,
                'fecha_expiracion' => now()->addMonth(),
            ]);
        }
    }
}
