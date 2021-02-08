<?php

namespace App\Http\Controllers;

use App\Project;
use App\ProjectActivity;
use DateTime;
use Illuminate\Http\Request;

date_default_timezone_set('Asia/Kolkata'); //enable to get datetime as local

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

    public function getRelatedWords(Request $request)
    {  
        if ($request->input('to') && $request->input('from') && $request->input('query')) {
            $limit = 100;
            $query = $request->input('query');
            $from = $request->input('from');
            $to = $request->input('to');
            $limit =  $request->input('limit');
            $fromTime = date('Y-m-d H:i:s', strtotime($from) + 0);
            $toTime = date('Y-m-d H:i:s', strtotime($to) + 0);
            $query_list = explode('|', $query);
            $final_list = array();
            $commonObj = new CommonController;
            $option = 'hashtag';      //it will find for co_occur_hashtag
            foreach ($query_list as $key => $value) {         
                $temp_list = array();               
                $data = $commonObj->get_co_occur_data($toTime, $fromTime, $value, null, $option);  
                $temp_list=array_slice($data["data"], 0, $limit, true);                
                foreach ($temp_list as $key => $value) {
                    if(array_key_exists($key, $final_list))
                        $final_list[$key] += $value;
                    else
                        $final_list[$key] = $value;
                }
            }
            arsort($final_list);
            return (array_slice($final_list, 0, $limit, true));    
        } else {
            return response()->json(['error' => 'Please check yout arguments'], 404);
        }
    }



    public function store_to_project_table_api(Request $request){
        $keyspace_name = $request->input('projectName');
        $user_id = $request->input('user_id');
        $project_id = $request->input('project_id');
        $project_description = $request->input('project_description');

        // insert into mysql
        $datetimeobj = new DateTime();
        $project_creation_date = $datetimeobj->format('Y-m-d');
        // $project_id = $datetimeobj->getTimestamp();

        $status = 0;
        $this->storeToProjectTable($project_id, $keyspace_name, $project_creation_date, $user_id, $status, $project_description);
        echo json_encode(array("res" => 'success'));
    }



    public function store_to_project_activity_table_api(Request $request){        
        $user_id = $request->input('user_id');
        $project_id = $request->input('project_id');
        $analysis_name = $request->input('analysis_name');
        $from_date = $request->input('from_date');
        $to_date = $request->input('to_date');
        $module_name = $request->input('module_name');
        $full_query = $request->input('full_query');

        // insert into mysql
        $datetimeobj = new DateTime();
        $analysis_datetime = $datetimeobj->format('Y-m-d H:i:s');

        $this->storeToProjectActivityTable($user_id, $project_id, $analysis_name, $analysis_datetime, $from_date, $to_date, $module_name, $full_query);
        echo json_encode(array("res" => 'inserted'));
    }



    public function create_table_keyspace_api(Request $request){
        $keyspace_name = $request->input('projectName');
        $option = $request->input('option');
        $user_id = $request->input('user_id');
        $query = $request->input('query');
        $from_date = $request->input('from_date');
        $to_date = $request->input('to_date');
        $this->create_table_keyspace($keyspace_name, $option, $user_id, $query, $from_date,  $to_date);
    }



    public function create_table_keyspace($keyspace_name, $option, $user_id, $query, $from_date,  $to_date)
    {
        echo json_encode(array("res" => 'running'));
        if($option == 'baseDataset'){
            $command = escapeshellcmd('/usr/bin/python python_files/create_keyspace_and_tables.py ' . $keyspace_name);
            $d = shell_exec($command);

            $this->insert_to_new_keyspace($keyspace_name, $user_id, $query, $from_date,  $to_date);
        }else{
            $command = escapeshellcmd('/usr/bin/python python_files/create_keyspace_and_tables.py ' . $keyspace_name);
            exec("nohup " . $command . " > /dev/null 2>&1 &");
        }

        // check in cassandra is ks is there and have all the tables.. ...if successfully created then update status=1 otheriwse status=-1............TODO
    }





    public function insert_to_new_keyspace($keyspace_name, $user_id, $query, $from_date,  $to_date)
    {      
        // triggered insert command
        $command = escapeshellcmd('/usr/bin/python python_files/insert_data_from_one_keyspace_to_another_keyspace.py ' . $keyspace_name . ' ' . $query . ' ' . $from_date . ' ' . $to_date . ' ' . $user_id);
        exec("nohup " .$command. " > /dev/null 2>&1 &");

        // for testing.....
        // $command = escapeshellcmd('/usr/bin/python python_files/insert_data_from_one_keyspace_to_another_keyspace.py parkjimin #ParkJimin 2020-12-22 2020-12-22 ha');
        // $d = shell_exec($command);
    }








    public function insert_to_new_keyspace_old(Request $request)
    {
        $keyspace_name = $request->input('projectName');
        $user_id = $request->input('user_id');
        $project_id = $request->input('project_id');
        $query = $request->input('query');
        $from_date = $request->input('from_date');
        $to_date = $request->input('to_date');
        $module_name = $request->input('module_name');
        $full_query = $request->input('full_query');
        // insert into mysql
        $datetimeobj = new DateTime();
        $analysis_datetime = $datetimeobj->format('Y-m-d H:m:s');
        $insertion_successful_flag = 0;


        if($query[0] == '#'){
            $aname = ltrim($query, '#');
            $full_query = $user_id.$project_id.'HASH'.$aname.$from_date.$to_date.$module_name;
        }
        else
            $full_query = $user_id.$project_id.$query.$from_date.$to_date.$module_name;


        $this->storeToProjectActivityTable($user_id, $project_id, $query, $analysis_datetime, $from_date, $to_date, $insertion_successful_flag, $module_name, $full_query);        
        echo json_encode(array("res" => "running", "full_query" => $full_query));

        // triggered insert command
        $command = escapeshellcmd('/usr/bin/python python_files/insert_data_from_one_keyspace_to_another_keyspace.py ' . $keyspace_name . ' ' . $query . ' ' . $from_date . ' ' . $to_date . ' ' . $module_name . ' ' . $user_id);

        exec("nohup " .$command. " > /dev/null 2>&1 &");
        // for testing.....
        // $command = escapeshellcmd('/usr/bin/python python_files/insert_data_from_one_keyspace_to_another_keyspace.py parkjimin #ParkJimin 2020-12-22 2020-12-22 ha');
        // $d = shell_exec($command);
    }










    /**
     * Store into project table
     */
    public function storeToProjectTable($project_id, $project_name, $project_creation_date, $user_id, $status, $project_description)
    {
        $statusObj = new Project([
            'project_id' => $project_id,
            'project_name' => $project_name,
            'project_creation_date' => $project_creation_date,
            'user_id' => $user_id,
            'status' => $status,
            'project_description' => $project_description
        ]);
        $statusObj->save();
        return response()->json(['data' => 'Submitted Successfully!'], 200);
    }

    /**
     * Store into projectActivity table
     */
    public function storeToProjectActivityTable($user_id, $project_id, $analysis_name, $analysis_datetime, $from_date, $to_date, $module_name, $full_query)
    {
        $statusObj = new ProjectActivity([
            'user_id' => $user_id,
            'project_id' => $project_id,
            'analysis_name' => $analysis_name,
            'analysis_datetime' => $analysis_datetime,
            'from_date' => $from_date,
            'to_date' => $to_date,
            'module_name' => $module_name,
            'full_query' => $full_query,
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

    public function checkIfAnyKeySpaceCreating(Request $request, $id)
    {
        $statusObj = Project::where([['user_id', '=', $id], ['status', '=', 0]])->get();
        return $statusObj;
    }

    public function get_project_name($project_id)
    {
        $statusObj = Project::where('project_id', $project_id)->get();
        return $statusObj;
    }

    public function get_all_projects($uid)
    {
        $statusObj = Project::where('user_id', $uid)->get();
        return $statusObj;
    }

    public function update_status_of_project($status, $project_id)
    {
        $statusObj = Project::where('project_id', $project_id)->update(array(
            'status' => $status));
        return 1;
    }

    public function deleteProjectFromRecords(Request $request)
    {
        $statusObj = Project::where([['user_id', '=', $request->input('userID')], ['project_id', '=', $request->input('projectID')]])->delete();
        return $statusObj;
    }
    public function checkIfAnyAnalysisStoreGoingOn(Request $request, $id)
    {
        $statusObj = ProjectActivity::where([['user_id', '=', $id], ['insertion_successful_flag', '=', 0]])->get();
        return $statusObj;
    }
    public function getAnalysisDetails($userID,$queryString)
    {
        $statusObj = ProjectActivity::where([['user_id', '=', $userID], ['full_query', '=', $queryString]])->get();
        return $statusObj;
    }

    
    // getAnalysisForUserUnderProject
    public function getAnalysisForUserUnderProject($userID,$projectID,$type)
    {
        if($type == 'all')
            $statusObj = ProjectActivity::where([['user_id', '=', $userID], ['project_id', '=', $projectID]])->get();
        else
            $statusObj = ProjectActivity::where([['user_id', '=', $userID], ['project_id', '=', $projectID], ['module_name', '=', $type]])->get();
        return $statusObj;
    }

    
    public function checkAnalysisExistorNot($full_query_id){
        $statusObj = ProjectActivity::where('full_query', $full_query_id)->get();
        return $statusObj;
    }


    public function deleteFromProjectActivityTable(Request $request)
    {
        $statusObj = ProjectActivity::where('full_query', $request->input('full_query_id'))->delete();
        return $statusObj;
    }
    
    public function checkIfProjectExitsByName( $name){
        $statusObj = Project::where('project_name', $name)->first();
        if($statusObj){
            return 1;
        }else{
            return 0;
        }
    }   
}