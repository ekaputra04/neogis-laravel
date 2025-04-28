<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rectangles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('category_id')
                ->constrained('rectangle_categories')
                ->onDelete('cascade');
            $table->timestamps();
        });

        // Kalau migration biasa belum support spatial types:
        DB::statement('ALTER TABLE `rectangles` ADD `coordinates` POLYGON NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rectangles');
    }
};
