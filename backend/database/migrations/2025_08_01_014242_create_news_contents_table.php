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
        Schema::create('news_contents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('news_id')->constrained()->onDelete('cascade');
            $table->string('type')->default('text'); // text, image, video, quote, etc
            $table->longText('content'); // isi konten
            $table->json('metadata')->nullable(); // data tambahan seperti caption, alt text, etc
            $table->integer('urutan')->default(1); // urutan tampil
            $table->boolean('is_active')->default(true); // status aktif
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news_contents');
    }
};
