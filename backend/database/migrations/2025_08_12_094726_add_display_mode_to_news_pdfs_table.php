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
        Schema::table('news_pdfs', function (Blueprint $table) {
            $table->enum('display_mode', ['link', 'embed'])->default('link')->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news_pdfs', function (Blueprint $table) {
            $table->dropColumn('display_mode');
        });
    }
};