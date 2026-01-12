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
        $table->string('author')->nullable();
        $table->string('category')->nullable();
        $table->unsignedBigInteger('views')->default(0); // <-- untuk views otomatis
        $table->string('slug')->nullable()->unique();
        $table->text('excerpt')->nullable();
        $table->enum('status', ['draft', 'published'])->default('published');
        $table->string('source_url')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn(['author', 'category', 'views', 'slug', 'excerpt', 'status', 'source_url']);
        });
    }
};
