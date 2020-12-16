<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LocationCode extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'location',
        'code',
    ];
}
