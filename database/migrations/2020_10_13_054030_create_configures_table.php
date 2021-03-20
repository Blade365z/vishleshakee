<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConfiguresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('configures', function (Blueprint $table) {
            $table->id();
            $table->string('appUrl');
            $table->string('dbUser');
            $table->string('dbPass');
            $table->string('dbNodes');
            $table->string('dbKeyspace');
            $table->string('dbPort');
            $table->string('sparkEngine');
            $table->string('defaultKeyspace');
            $table->tinyInteger('isProjectFlag')->default('1');
            $table->string('org');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('configures');
    }
}
