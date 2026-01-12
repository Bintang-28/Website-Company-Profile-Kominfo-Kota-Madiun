<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi.
     */
    public function up(): void
    {
        // Membuat tabel baru dengan nama 'kunjungan_harian'
        Schema::create('kunjungan_harian', function (Blueprint $table) {
            $table->id(); // Kolom ID auto-increment
            $table->date('tanggal_kunjungan')->unique(); // Setiap tanggal hanya punya satu baris
            $table->unsignedBigInteger('jumlah_kunjungan')->default(0); // Jumlah kunjungan pada tanggal tersebut
            $table->timestamps(); // Kolom created_at dan updated_at
        });
    }

    /**
     * Batalkan migrasi.
     */
    public function down(): void
    {
        // Hapus tabel jika migrasi dibatalkan
        Schema::dropIfExists('kunjungan_harian');
    }
};
