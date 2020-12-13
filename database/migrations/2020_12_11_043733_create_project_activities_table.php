<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectActivitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_activities', function (Blueprint $table) {
            $table->string('user_id');
            $table->string('project_id');
            $table->string('analysis_name');
            $table->string('analysis_datetime');
            $table->string('from_date');
            $table->string('to_date');
            $table->boolean('insertion_successful_flag');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('project_activities');
    }
}
