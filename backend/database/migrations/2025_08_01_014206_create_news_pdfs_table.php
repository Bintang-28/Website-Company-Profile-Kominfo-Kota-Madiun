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
        Schema::create('news_pdfs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('news_id')->constrained()->onDelete('cascade');
            $table->string('path'); // path file di storage
            $table->string('original_name'); // nama asli file yang diupload
            $table->string('title')->nullable(); // judul untuk PDF (opsional)
            $table->text('description')->nullable(); // deskripsi PDF (opsional)
            $table->integer('file_size')->nullable(); // ukuran file dalam bytes
            $table->integer('urutan')->default(1); // urutan tampil
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news_pdfs');
    }
};
