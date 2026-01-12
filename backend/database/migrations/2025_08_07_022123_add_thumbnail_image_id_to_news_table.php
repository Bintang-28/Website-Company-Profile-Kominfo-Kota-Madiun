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
            $table->unsignedBigInteger('thumbnail_image_id')->nullable()->after('source_url');
            $table->foreign('thumbnail_image_id')->references('id')->on('news_images')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropForeign(['thumbnail_image_id']);
            $table->dropColumn('thumbnail_image_id');
        });
    }
};