<?php

namespace App\Http\Controllers;

use App\Project;
use App\ProjectActivity;
use Illuminate\Http\Request;
use DateTime;
use App\QueryStatus;

date_default_timezone_set('Asia/Kolkata');  //enable to get datetime as local


class ProjectActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    // public function index()
    // {
    //     //
    // }
    
    
    
    public function create_table_keyspace(Request $request){
        $keyspace_name = $request->input('projectName');
        $user_id = $request->input('user_id');
        $project_id = $request->input('project_id');
        $command = escapeshellcmd('/usr/bin/python python_files/create_keyspace_and_tables.py ' . $keyspace_name);
        shell_exec($command);
        // insert into mysql
        $datetimeobj = new DateTime();
        $project_creation_date = $datetimeobj->format('Y-m-d');
        // $project_id = $datetimeobj->getTimestamp(); 
        $this->storeToProjectTable($project_id, $keyspace_name, $project_creation_date, $user_id);
        echo json_encode(array("res"=>"success"));
    }



    public function insert_to_new_keyspace(Request $request){
        $keyspace_name = $request->input('projectName');
        $user_id = $request->input('user_id');
        $project_id = $request->input('project_id');
        $query = $request->input('query');
        $from_date = $request->input('from_date');
        $to_date = $request->input('to_date');
        $module_name = $request->input('module_name');
        $command = escapeshellcmd('/usr/bin/python python_files/insert_data_from_one_keyspace_to_another_keyspace.py '.$keyspace_name.' "'.$query.'" '.$from_date.' '.$to_date.' '.$module_name);
        shell_exec($command);
        // insert into mysql
        $datetimeobj = new DateTime();
        $analysis_datetime = $datetimeobj->format('Y-m-d H:m:s');
        $insertion_successful_flag=0;
        $this->storeToProjectActivityTable($user_id, $project_id, $query, $analysis_datetime, $from_date, $to_date, $insertion_successful_flag);
        echo json_encode(array("res"=>"success"));
    }



    /**
     * Store into project table
     */
    public function storeToProjectTable($project_id, $project_name, $project_creation_date, $user_id)
    {
        $statusObj = new Project([
            'project_id' => $project_id,
            'project_name' => $project_name,
            'project_creation_date' => $project_creation_date,
            'user_id' => $user_id
        ]);
        $statusObj->save();
        return response()->json(['data' => 'Submitted Successfully!'], 200);
    }


    /**
     * Store into projectActivity table
     */
    public function storeToProjectActivityTable($user_id, $project_id, $analysis_name, $analysis_datetime, $from_date, $to_date, $insertion_successful_flag)
    {
        $statusObj = new ProjectActivity([
            'user_id' => $user_id,
            'project_id' => $project_id,
            'analysis_name' => $analysis_name,
            'analysis_datetime' => $analysis_datetime,
            'from_date' => $from_date,
            'to_date' => $to_date,
            'insertion_successful_flag' => $insertion_successful_flag
        ]);
        $statusObj->save();
        return response()->json(['data' => 'Submitted Successfully to ProjectActivityTable!'], 200);
    }



    public function show(Request $request, $id)
    {
        $statusObj = ProjectActivity::where('user_id', $id)->get();
        // $statusObj =  QueryStatus::where([['userID', '=', $id],['type','=',$request->input('mode')]])->get();
        return $statusObj;
    }



    public function get_project_name($project_id){
        $statusObj = Project::where('project_id', $project_id)->get();
        return $statusObj;
    }


    public function get_all_projects($uid){
        $statusObj = Project::where('user_id', $uid)->get();
        return $statusObj;
    }

}