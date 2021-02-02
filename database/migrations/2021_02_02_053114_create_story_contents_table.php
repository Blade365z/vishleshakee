<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStoryContentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('story_contents', function (Blueprint $table) {
            $table->string('storyID');
            $table->string('storyName');
            $table->string('analysisID');
            $table->string('analysisName');
            $table->string('analysisDescription');
            $table->primary(['storyID','analysisID']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('story_contents');
    }
}
