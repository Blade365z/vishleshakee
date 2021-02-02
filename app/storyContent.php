<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class storyContent extends Model
{
    //
    protected $fillable = [
        'storyID',
        'storyName',
        'analysisID',
        'analysisName',
        'analysisDescription',
    ];
}
