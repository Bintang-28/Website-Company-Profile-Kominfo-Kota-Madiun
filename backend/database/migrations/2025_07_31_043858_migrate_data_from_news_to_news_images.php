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
        // Ambil semua berita yang memiliki gambar di kolom lama
        $old_news_with_images = DB::table('news')->whereNotNull('image')->get();

        foreach ($old_news_with_images as $news) {
            // Masukkan data gambar lama ke tabel baru
            DB::table('news_images')->insert([
                'news_id' => $news->id,
                'path' => $news->image, // Ambil path dari kolom lama
                'urutan' => 1, // Anggap gambar lama sebagai gambar pertama
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news_images', function (Blueprint $table) {
            DB::table('news_images')->truncate();
        });
    }
};
