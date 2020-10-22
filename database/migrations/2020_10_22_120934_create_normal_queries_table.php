<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNormalQueriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('normal_queries', function (Blueprint $table) {
            $table->string('queryID');
            $table->string('userID');
            $table->string('query');
            $table->string('fromDate');
            $table->string('toDate');
            $table->string('status');
            $table->string('type');
            $table->string('hashtagID');
            $table->string('mentionID');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('normal_queries');
    }
   
}
