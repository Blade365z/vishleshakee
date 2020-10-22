<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class NormalQueries extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'queryID',
        'userID',
        'query',
        'fromDate',
        'toDate',
        'status',
        'type',
        'hashtagID',
        'mentionID',    ];
}
