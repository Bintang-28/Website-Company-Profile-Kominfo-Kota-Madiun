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
        Schema::table('news', function (Blueprint $table) {
            // Mengubah kolom 'content' agar bisa menerima nilai NULL
            $table->text('content')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            // Opsi untuk mengembalikan jika diperlukan
            // Hati-hati jika ada data NULL yang sudah ada
            $table->text('content')->nullable(false)->change();
        });
    }
};