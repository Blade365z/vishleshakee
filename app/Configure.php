<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Configure extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'appUrl',
        'dbUser',
        'dbPass',
        'dbNodes',
        'dbKeyspace',
        'dbPort'
    ];
}
