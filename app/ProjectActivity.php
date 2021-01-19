<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProjectActivity extends Model
{
    //
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'project_id',
        'analysis_name',
        'analysis_datetime',
        'from_date',
        'to_date',
        'insertion_successful_flag',
        'module_name',
        'full_query'
    ];
}
