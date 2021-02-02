<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class story extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'storyID',
        'projectID',
        'storyName',
        'storyDescription',
        'createdOn'
    ];
}
