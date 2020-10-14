<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CrawlerList extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'track',
        'handle',
        'type',
        'status',
        'date',
    ];
}
