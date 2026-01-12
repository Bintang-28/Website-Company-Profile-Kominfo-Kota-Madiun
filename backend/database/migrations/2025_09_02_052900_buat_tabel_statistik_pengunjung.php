<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('statistik_pengunjung', function (Blueprint $table) {
            $table->id();
            // Kolom ini tidak kita perlukan lagi karena tabel ini khusus untuk pengunjung
            $table->bigInteger('jumlah')->default(0);
            $table->timestamps();
        });

        // Langsung isi satu baris data awal untuk hitungan pengunjung
        DB::table('statistik_pengunjung')->insert([
            'jumlah' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('statistik_pengunjung');
    }
};
