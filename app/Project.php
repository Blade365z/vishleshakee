<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    //
    public $timestamps = false;
    protected $fillable = [
        'project_id',
        'project_name',
        'project_creation_date',
        'user_id',
        'status',
        'project_description'
    ];
}
