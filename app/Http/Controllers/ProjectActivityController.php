<?php

namespace App\Http\Controllers;

use App\Project;
use App\ProjectActivity;
use DateTime;
use Illuminate\Http\Request;
use App\DBModel\DBmodel;
use App\DBModel\DBmodelAsync;
use App\Library\QueryBuilder as QB;
use App\Library\Utilities as Ut;

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
        $seed_tokens = $request->input('seed_tokens');
        $from_date = $request->input('from_date');
        $to_date = $request->input('to_date');

        // insert into mysql
        $datetimeobj = new DateTime();
        $project_creation_date = $datetimeobj->format('Y-m-d');
        // $project_id = $datetimeobj->getTimestamp();

        $status = 0;
        $this->storeToProjectTable($project_id, $keyspace_name, $project_creation_date, $user_id, $status, $project_description, $seed_tokens, $from_date, $to_date);
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
        $query_list = $request->input('query_list');
        $uniqueTimeStamp = $request->input('uniqueTimeStamp');
        $this->create_table_keyspace($keyspace_name, $option, $user_id, $query, $from_date,  $to_date, $query_list, $uniqueTimeStamp);
    }



    public function create_table_keyspace($keyspace_name, $option, $user_id, $query, $from_date,  $to_date, $query_list, $uniqueTimeStamp)
    {
        // echo json_encode(array("res" => 'running'));
        if($option == 'baseDataset'){
            // 1 trigger spark for to compute final tweet id list
            $rname = $uniqueTimeStamp.'a77';//should be uniquetimestamp
            $result = $this->curlData($query_list,  $rname);
            $result = json_decode($result, true);
            $status = $result['state'];
            $spark_id =  $result['id'];
            echo json_encode(array('query_time' => $rname, 'status' => $status, 'id' => $spark_id));

            // 2 create ks
            $command = escapeshellcmd('/usr/bin/python python_files/create_keyspace_and_tables.py ' . $keyspace_name);
            $d = shell_exec($command);
            // echo json_encode("table created");


            // 3 insert to tables.....doing
            // if($status == 'starting' or $status == 'running'){
                // $this->insert_to_new_keyspace($keyspace_name, $user_id, $query, $from_date,  $to_date, $spark_id);
            // }            
        }else{
            // $command = escapeshellcmd('/usr/bin/python python_files/create_keyspace_and_tables.py ' . $keyspace_name);
            // exec("nohup " . $command . " > /dev/null 2>&1 &");
        }

        // check in cassandra is ks is there and have all the tables.. ...if successfully created then update status=1 otheriwse status=-1............TODO
    }




    //TODO
    public  function  curlData($query_list, $rname)
    {
        $curl = curl_init();
        $data['conf'] = array('spark.jars.packages' => 'anguenot:pyspark-cassandra:2.4.0', 'spark.cassandra.connection.host' => '172.16.117.201', 'spark.cores.max' => 4);
        $data['file'] = 'local:/home/anurag/smat/spark/batch/advance_query_project.py';
        $data['args'] = $query_list;
        $data['name'] = strval($rname) . 'a77';
        $data['executorCores'] = 4;
        $data['numExecutors'] = 2;
        $data['executorMemory'] = '6G';
        $data = json_encode($data);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Connection: Keep-Alive'
        ));
        curl_setopt($curl, CURLOPT_URL, '172.16.117.50:8998/batches');
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_TIMEOUT, 0);
        $curl_result = curl_exec($curl);
        return $curl_result;
    }



    public function insert_to_new_keyspace($keyspace_name, $user_id, $query, $from_date,  $to_date, $spark_id=null)
    {      
        // triggered insert command
        $command = escapeshellcmd('/usr/bin/python python_files/insert_data_from_one_keyspace_to_another_keyspace.py ' . $keyspace_name . ' ' . $query . ' ' . $from_date . ' ' . $to_date . ' ' . $user_id . ' '. $spark_id);
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
    public function storeToProjectTable($project_id, $project_name, $project_creation_date, $user_id, $status, $project_description,  $seed_tokens, $from_date, $to_date)
    {
        $statusObj = new Project([
            'project_id' => $project_id,
            'project_name' => $project_name,
            'project_creation_date' => $project_creation_date,
            'user_id' => $user_id,
            'status' => $status,
            'project_description' => $project_description,
            'seed_tokens' => $seed_tokens,
            'from_date' => $from_date,
            'to_date' => $to_date
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



    public function getTweetidListOrderByTweetTypeCount(Request $request)
    {
        $request->validate([
            'projectID' => 'required',
            'userID' => 'required',
            'tweetType' => 'required',
        ]);
        
        try {
            $userID = $request->input('userID');
            $projectID = $request->input('projectID');
            $type = $request->input('tweetType');
            if ($type === 'retweet') {
                $filePath = "storage/$userID/$projectID/statistics/tweets_orderby_rtcount.csv";
            } else if ($type === 'QuotedTweet') {
                $filePath = "storage/$userID/$projectID/statistics/tweets_orderby_qtcount.csv";
            } else if ($type === 'Reply') {
                $filePath = "storage/$userID/$projectID/statistics/tweets_orderby_replycount.csv";
            }
            $file_data_array = array_slice(file($filePath), 1);
            // $tweet_arr = array_map(function($x){ return str_getcsv($x)[0]; }, $str);
            // $tweet_arr_with_count = array_map(function($x){ $d = str_getcsv($x); return array($d[0] => $d[1]); }, $str);
            $tweet_arr = [];
            $tweet_count_hashmap = [];
            foreach ($file_data_array as $line) {
                $temp_arr = str_getcsv($line);
                array_push($tweet_arr, $temp_arr[0]);
                if ($type === 'retweet')
                    $type = 'retweet';
                else if ($type === 'QuotedTweet')
                    $type = 'QuotedTweet';
                else if ($type === 'Reply')
                    $type = 'Reply';
                $tweet_count_hashmap[$temp_arr[0]] = array('count' => $temp_arr[1], 'type' => $type);
            }
            $json = json_encode(array('tweetid_list' => $tweet_arr, 'tweet_count_hashmap' => $tweet_count_hashmap));
            return $json;
        } catch (Exception $e) {
            return response()->json(['error' => 'Some error occured!'], 404);
        }
    }


    public function getProjectFrequencyDistributionData(Request $request)
    {   
        $to = $request->input('to');
        $from = $request->input('from');
        $pname = null;
        if ($request->input('pname')){
            $pname = $request->input('pname');
        }
        $range_type = 'day';
        $category_info_details = true;
        $category_info_total = true;


        $db_object = new DBmodelAsync;
        $db_object_not_async = new DBmodel;
        $qb_obj = new QB;
        $ut_obj = new Ut;


        $final_result = array();
        $temp_arr = array();
        $total = 0;
        $total_com = 0;
        $total_sec = 0;
        $total_com_sec = 0;
        $total_non_com_sec = 0;
        $from_datetime = date('Y-m-d H:i:s', strtotime($from) + 0);
        $to_datetime = date('Y-m-d H:i:s', strtotime($to) + 0);
        if ($range_type == "day") {
            // past days
            $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, null, null, 'dataset_distribution');
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0], $pname);

            foreach ($result_async_from_db as $rows) {
                $com = 0;
                $sec = 0;
                $com_sec = 0;
                $non_com_sec = 0;
                foreach ($rows as $row) {
                    $t = $row['created_date'];                    
                    $datetime1 = $ut_obj->get_date_time_from_cass_date_obj($t, "Y-m-d");
                    $count_list = $row['count_list']->values();     
                    $category_class_list = $row['category_class_list']->values();                    
                    $ar_sum = array_sum($count_list);
                    if ($category_info_details or $category_info_total) {
                        $com += $count_list[$this->get_index_of_category(11, $category_class_list)] + $count_list[$this->get_index_of_category(12, $category_class_list)] + $count_list[$this->get_index_of_category(13, $category_class_list)];

                        $sec += $count_list[$this->get_index_of_category(101, $category_class_list)] + $count_list[$this->get_index_of_category(102, $category_class_list)] + $count_list[$this->get_index_of_category(103, $category_class_list)];

                        $com_sec += $count_list[$this->get_index_of_category(111, $category_class_list)] + $count_list[$this->get_index_of_category(112, $category_class_list)] + $count_list[$this->get_index_of_category(113, $category_class_list)];

                        $non_com_sec += $count_list[$this->get_index_of_category(1, $category_class_list)] + $count_list[$this->get_index_of_category(2, $category_class_list)] + $count_list[$this->get_index_of_category(3, $category_class_list)];

                        array_push($temp_arr, array($datetime1, $ar_sum, $com, $sec, $com_sec, $non_com_sec));
                        $total_com += $com;
                        $total_sec += $sec;
                        $total_com_sec += $com_sec;
                        $total_non_com_sec += $non_com_sec;
                    } else {
                        array_push($temp_arr, array($datetime1, $ar_sum));
                    }
                }
            }            
        }

        $final_result["range_type"] = $range_type;
        $final_result["chart_type"] = "freq_dist";
        if ($category_info_details or $category_info_total) {
            if ($category_info_details) {
                $final_result["data"] = $temp_arr;
            }
            $final_result["com"] = $total_com;
            $final_result["sec"] = $total_sec;
            $final_result["com_sec"] = $total_com_sec;
            $final_result["normal"] = $total_non_com_sec;
            $final_result["total"] = $total_com + $total_sec + $total_com_sec + $total_non_com_sec;
        } else {
            $final_result["data"] = $temp_arr;
        }
        return ($final_result);
    }


    public function get_index_of_category($query, $cat_arr){
        $index  =  array_search($query,$cat_arr);
        return $index;
    }

    public function getProjectSentimentDistributionData(Request $request)
    {   
        $to = $request->input('to');
        $from = $request->input('from');
        $pname = null;
        if ($request->input('pname')){
            $pname = $request->input('pname');
        }
        $range_type = 'day';
        $category_info_details = true;
        $category_info_total = true;


        $db_object = new DBmodelAsync;
        $db_object_not_async = new DBmodel;
        $qb_obj = new QB;
        $ut_obj = new Ut;


        $final_result = array();
        $temp_arr = array();
       
        $from_datetime = date('Y-m-d H:i:s', strtotime($from) + 0);
        $to_datetime = date('Y-m-d H:i:s', strtotime($to) + 0);
        if ($range_type == "day") {
            // past days
            $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, null, null, 'dataset_distribution');
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0], $pname);


            foreach ($result_async_from_db as $rows) {
                $datetime1 = null;
                $pos = 0;
                $neg = 0;
                $neu = 0;
                foreach ($rows as $row) {
                    $t = $row['created_date'];
                    $datetime1 = $ut_obj->get_date_time_from_cass_date_obj($t, "Y-m-d");
                    $count_list = $row['count_list']->values();
                    $category_class_list = $row['category_class_list']->values();               
                    for($i=0; $i < sizeof($category_class_list); $i++){
                        $cat = $category_class_list[$i];
                        $count_sum = $count_list[$i];
                        if($cat%10 == 1)
                            $pos += $count_sum;
                        else if($cat%10 == 2)
                            $neg += $count_sum;
                        else if($cat%10 == 3)
                            $neu += $count_sum;
                    }     
                }
                if ($datetime1) {
                    array_push($temp_arr, array($datetime1, $pos, $neg, $neu));
                }
            }      
        }

        $final_result["range_type"] = $range_type;
        $final_result["chart_type"] = "sent_dist";
        $final_result["data"] = $temp_arr;
        return ($final_result);       
    }


    // TODO
    public function getTweetidListProject(Request $request)
    {
        // $to_datetime = null, $from_datetime = null, $token = null, $range_type = null, $filter_type=null, $ks=null
        $to = $request->input('to');
        $from = $request->input('from');
        $filter_type = null;
        $filter_type = $request->input('filter_type');
        $ks = null;
        if ($request->input('pname')){
            $ks = $request->input('pname');
        }
        $range_type = 'day';
        $db_object = new DBmodelAsync;
        $db_object_not_async = new DBmodel;
        $qb_obj = new QB;
        $ut_obj = new Ut;


        $final_result = array();
        $temp_arr = array();
        $tweet_id_list = array();
       
        $from_datetime = date('Y-m-d H:i:s', strtotime($from) + 0);
        $to_datetime = date('Y-m-d H:i:s', strtotime($to) + 0);

        $index_arr = array();
        if($filter_type)
            $index_arr = $this->get_index_arr_of_category($filter_type);       
        
      
        $feature_option = 'dataset_distribution';

        if ($range_type == "day") {
            // past days
            $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token='tweet', null, $feature_option);
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0], $ks);

            $i = 0;       
            foreach ($result_async_from_db as $rows) {
                foreach ($rows as $row) {        
                    $tweet_list = $row['tweetidlist']->values();   
                    $i = 0;
                    foreach ($tweet_list as $t) {   
                        if($filter_type){   
                            if(in_array($i, $index_arr)){
                                $tweet_l = $t->values();
                                foreach ($tweet_l as $t1) {
                                    if ($t1 != "0") {
                                        array_push($tweet_id_list, $t1);
                                    }
                                }
                            }
                        }else{
                            $tweet_l = $t->values();
                            foreach ($tweet_l as $t1) {
                                if ($t1 != "0") {
                                    array_push($tweet_id_list, $t1);
                                }
                            }
                        }
                        $i++;
                    }
                }
            }         
        }


        $final_result["range_type"] = $range_type;
        $final_result["chart_type"] = "tweet";
        $final_result["data"] = $tweet_id_list;
        return ($final_result);
    }


    public function get_index_arr_of_category($filter_type){
        if($filter_type == 'com'){
            $index_arr = [3, 4, 5];                            
        }else if($filter_type == 'sec'){
            $index_arr = [6, 7, 8];
        }else if($filter_type == 'com_sec'){
            $index_arr = [9, 10, 11];
        }else if($filter_type == 'normal'){
            $index_arr = [0, 1, 2];
        }else if($filter_type == 'pos'){
            $index_arr = [0, 3, 6, 9];
        }else if($filter_type == 'neg'){
            $index_arr = [1, 4, 7, 10];
        }else if($filter_type == 'neu'){
            $index_arr = [2, 5, 8, 11];
        }else if($filter_type == 'all'){
            $index_arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        }
        return $index_arr;
    }



    public function  getTweetIDListHavingLocation(Request $request){
        $userID = $request->input('userID');
        $projectID = $request->input('projectID');
        $filePath = "storage/$userID/$projectID/statistics/loc_tweet.csv";
        $file_data_array = array_slice(file($filePath), 1);
        return array_map(function($str){ return str_replace("\n","",$str);}, $file_data_array);
    }
}