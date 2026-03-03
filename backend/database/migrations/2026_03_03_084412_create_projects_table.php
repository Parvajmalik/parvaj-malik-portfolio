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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->default('General');
            $table->string('featured_image')->nullable();
            $table->text('excerpt')->nullable();           // short card description
            $table->longText('content');                   // CKEditor rich HTML detail
            $table->json('tech_stack')->nullable();        // ["STM32", "C/C++", ...]
            $table->string('live_url')->nullable();
            $table->string('github_url')->nullable();
            $table->unsignedTinyInteger('order')->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
