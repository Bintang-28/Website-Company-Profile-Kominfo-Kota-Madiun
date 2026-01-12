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
            $table->string('file_type')->default('pdf')->after('original_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news_pdfs', function (Blueprint $table) {
            $table->dropColumn('file_type');
        });
    }
};