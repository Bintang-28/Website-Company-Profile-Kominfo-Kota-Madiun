<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        // Admin utama
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // User biasa untuk testing
        User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'User Biasa',
                'password' => Hash::make('user123'),
                'role' => 'user',
            ]
        );

        $this->command->info('✅ Admin dan user berhasil dibuat!');
        $this->command->info('📧 Admin: admin@example.com | Password: admin123');
        $this->command->info('📧 User: user@example.com | Password: user123');
    }
}