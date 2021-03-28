<?php

namespace App\Http\Controllers;

use App\DBModel\DBmodel;
use App\DBModel\DBmodelAsync;
use App\Library\QueryBuilder;
use App\Library\Utilities;
use Illuminate\Http\Request;
ini_set('max_execution_time', '600');



class TweetTracking extends Controller
{
    public function getTweetInfo(Request $request)
    {
        $request->validate([
            'id' => 'required',
        ]);
        $pname = null;
        if ($request->input('pname'))
            $pname = $request->input('pname');
        $id = $request->input('id');
        $commonObj = new CommonController;
        // echo $id;
        $data = $commonObj->get_tweets_info($id, false, $pname);
        return $data;
    }



    
    public function dummyFunctionForFreq()
    {
        $tempArr = array("range_type" => "hour", "chart_type" => "freq_dist", "data" => [["2020-09-24 01:00:00", "3"], ["2020-09-24 02:00:00", "13"], ["2020-09-24 03:00:00", "28"], ["2020-09-24 04:00:00", "21"], ["2020-09-24 05:00:00", "30"], ["2020-09-24 06:00:00", "28"], ["2020-09-24 07:00:00", "30"], ["2020-09-24 08:00:00", "36"], ["2020-09-24 09:00:00", "35"], ["2020-09-24 10:00:00", "30"], ["2020-09-24 11:00:00", "28"], ["2020-09-24 12:00:00", "28"], ["2020-09-24 13:00:00", "21"], ["2020-09-24 14:00:00", "5"]]);
        return $tempArr;
    }




    public function getFrequencyDistributionTweet(Request $request)
    {
        $request->validate([
            'to' => 'required',
            'from' => 'required',
            'id' => 'required',
            'type' => 'required',
        ]);

        $to = $request->input('to');
        $from = $request->input('from');
        $source_tweet_id = $request->input('id');
        $distribution_type = $request->input('type');
        $pname = null;
        if ($request->input('pname')){
            $pname = $request->input('pname');
        }
        $from_datetime = date('Y-m-d H:i:s', strtotime($from) + 0);
        $to_datetime = date('Y-m-d H:i:s', strtotime($to) + 0);
        $db_object = new DBmodelAsync;
        $qb_obj = new QueryBuilder;
        $ut_obj = new Utilities;
        $final_result = array();
        $temp_arr = array();
        $monthsArr = [ "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December" ];   


        $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $source_tweet_id, $distribution_type, 'tweet_track');
        $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0], $pname);

        foreach ($result_async_from_db as $rows) {
            $total_count = 0;
            foreach ($rows as $row) {
                $t = $row['datetime'];
                $datetime1 = $ut_obj->get_date_time_from_cass_date_obj($t, "Y-m-d") . ' 00:00:00';
                $total_count += 1;
                $month=$monthsArr[explode("-",$datetime1)[1]-1];
                $week=$this->weekOfMonth($datetime1);
            }

            if ($total_count > 0) {
                array_push($temp_arr,array($datetime1,$total_count,$month ,$week));
            }

        }

        $final_result["chart_type"] = "freq_dist_tweet_tracking_of_type_$distribution_type";
        $final_result["data"] = $temp_arr;

        return json_encode($final_result);
    }




    public function getDatesDist(Request $request)
    {
        $request->validate([
            'to' => 'required',
            'from' => 'required',
            'id' => 'required',
            'type' => 'required',
        ]);

        $to = $request->input('to');
        $from = $request->input('from');
        $source_tweet_id = $request->input('id');
        $distribution_type = $request->input('type');
        $pname = null;
        if ($request->input('pname')){
            $pname = $request->input('pname');
        }
        $from_datetime = date('Y-m-d H:i:s', strtotime($from) + 0);
        $to_datetime = date('Y-m-d H:i:s', strtotime($to) + 0);
        $db_object = new DBmodelAsync;
        $qb_obj = new QueryBuilder;
        $ut_obj = new Utilities;
        $final_result = array();
        $temp_arr = array();
        $monthsArr = [ "January", "February", "March", "April", "May", "June", 
         "July", "August", "September", "October", "November", "December" ];   

        $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $source_tweet_id, $distribution_type, 'tweet_track');
        $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0], $pname);

        foreach ($result_async_from_db as $rows) {
            $total_count = 0;         
            foreach ($rows as $row) {                
                if($row['tweet_type']){
                    $t = $row['datetime'];
                    $datetime1 = $ut_obj->get_date_time_from_cass_date_obj($t, "Y-m-d");
                    $total_count += 1;
                    $month=$monthsArr[explode("-",$datetime1)[1]-1];
                    $week=$this->weekOfMonth($datetime1);
                }
            }
            if ($total_count > 0) {
                array_push($temp_arr, array($datetime1,$total_count,$month ,$week));
                // $temp_arr[$type] = $datetime1;
            }
        }
    
        $final_result["chart_type"] = "freq_dist_tweet_tracking_of_type_$distribution_type";
        $final_result["data"] = $temp_arr;

        return json_encode($final_result);
    }



    public function weekOfMonth($date) {
        $firstOfMonth = date("Y-m-01", strtotime($date));
        $res = intval(date("W", strtotime($date))) - intval(date("W", strtotime($firstOfMonth)));
        if($res ==0){
            $res=$res+1;
        }
         return $res;
    }




    public function get_tweet_idlist_for_track_type_sourceid(Request $request)
    {
        $request->validate([
            'sid' => 'required',
            'to' => 'required',
            'tweet_id_list_type' => 'required'
        ]);
        $db_object = new DBmodel;
        $qb_obj = new QueryBuilder;
        $ut_obj = new Utilities;
        $to = $request->input('to');
        $source_tweet_id = $request->input('sid');
        $tweet_id_list_type = $request->input('tweet_id_list_type');
        $pname = null;
        if ($request->input('pname')){
            $pname = $request->input('pname');
        }

        $final_result = array();
        $tweet_id_list = array();

        if ($request->input('from')) {
            $from=$request->input('from');
            $stm_list = $qb_obj->get_statement($to, $from, $source_tweet_id, $tweet_id_list_type, 'tweet_track');
        } else {
            $stm_list = $qb_obj->get_statement($to, null, $source_tweet_id, $tweet_id_list_type, 'tweet_track');
        }
        $result = $db_object->execute_query($stm_list[0], null, $pname);
        foreach ($result as $row) {
            array_push($tweet_id_list, $row['type_tweet_id']);
        }

        $final_result["chart_type"] = "tweet_id_list_for_tweet_track";
        if($request->input('k')){
            $final_result["data"] = array_slice($tweet_id_list, $request->input('k'));
        }else
            $final_result["data"] = $tweet_id_list;
        return $final_result;
    }



    public function get_tweet_idlist_for_sourceid($to=null, $from=null, $source_tweet_id=null, $tweet_id_list_type=null, $pname=null)
    {
        $db_object = new DBmodel;
        $qb_obj = new QueryBuilder;
        $ut_obj = new Utilities;

        $final_result = array();
        $tweet_id_list = array();

        if ($from) {
            $stm_list = $qb_obj->get_statement($to, $from, $source_tweet_id, $tweet_id_list_type, 'tweet_track');
        } else {
            $stm_list = $qb_obj->get_statement($to, null, $source_tweet_id, $tweet_id_list_type, 'tweet_track');
        }
        $result = $db_object->execute_query($stm_list[0], null, $pname);
        foreach ($result as $row) {
            array_push($tweet_id_list, $row['type_tweet_id']);
        }

        $final_result["chart_type"] = "tweet_id_list_for_tweet_track";
        $final_result["data"] = $tweet_id_list;
        return $final_result;
    }




    public function generate_tweet_network_(Request $request)
    {
        $pname = null;
       
        if ($request->input('pname')) {
            $pname = $request->input('pname');
        }
        // echo $pname;

        $date_list = $request->input('dateArr');
        $dir_name = $request->input('userID');
        $hop_count = 0;

        $tweet_id = $request->input('id');
        $SourceTweetID = new \SplQueue();
        $SourceTweetID->enqueue($tweet_id);
        $SourceTweetID->enqueue("H");

        $file = fopen("storage/".$dir_name."/".$tweet_id.".csv","w");
        $file = fopen("storage/".$dir_name."/".$tweet_id.".csv","a+");
        fputcsv($file,array());
        fclose($file);

        
        // nested function
        function r_($SourceTweetID,$hop_count,$date_list,$tweet_id,$dir_name, $pname)
        {
            // print_r($SourceTweetID);
            $SourceTweetID->rewind();
            $ST_id = $SourceTweetID->current();
            if ($hop_count!=10) {              
                if ($ST_id=="H") {
                    $SourceTweetID->dequeue();
                    $SourceTweetID->rewind();
                    $temp_check = $SourceTweetID->current();
                    if ($temp_check) {
                        $hop_count = $hop_count + 1;
                        $SourceTweetID->enqueue("H");                        
                        r_($SourceTweetID,$hop_count,$date_list,$tweet_id,$dir_name, $pname);
                    }
                    else {                        
                        return array($tweet_id);
                    }                    
                }
                else {
                    $SourceTweetID->rewind();
                    $ST_id = $SourceTweetID->current();
                    $SourceTweetID->dequeue();
                    
                    $all_type_data = process_source_($ST_id, $date_list, $pname);
        
                    foreach($all_type_data["Reply"] as $q){
                        $SourceTweetID->enqueue($q);
                    }
                    foreach($all_type_data["QuotedTweet"] as $q){
                        $SourceTweetID->enqueue($q);
                    }
                    
                    prepare_the_graph_($ST_id,$all_type_data,$tweet_id,$dir_name, $pname);
                    r_($SourceTweetID,$hop_count,$date_list,$tweet_id,$dir_name, $pname);
                }
            }
            else {
                return;
            }
        }
       

        // nested function
        function process_source_($ST_id, $date_list, $pname)
        {
            $tweet_id_type = ["retweet", "QuotedTweet", "Reply"];
            $trigger = new TweetTracking;
            $all_type_data = array();
            foreach ($tweet_id_type as $type) {
                $temp_data = [];
                foreach ($date_list as $date) {
                    $result = $trigger->get_tweet_idlist_for_sourceid($to = $date, $from = null, $source_tweet_id = $ST_id, $tweet_id_list_type = $type, $pname);
                    array_push($temp_data, $result["data"]);
                }
                $temp_data = call_user_func_array('array_merge', $temp_data);
                $all_type_data[$type] = $temp_data;
            }
            // echo json_encode($all_type_data);
            return $all_type_data;
        }
        
        
        // nested function
        function prepare_the_graph_($ST_id,$total_nodes,$tweet_id,$dir_name, $pname){

            $commonObj = new CommonController;
            
            // $temp_ST = json_decode($commonObj->get_tweets_info(array($ST_id), false, $pname),true);
            $temp_ST = json_decode($commonObj->get_tweets_info(array($ST_id), true, $pname),true);


            // todo - mala ..this part need to improve. error- message": "The request queue has reached capacity", "exception": "Cassandra\\Exception\\RuntimeException", "file": "/var/www/html/vishleshakee/app/DBModel/DBmodelAsync.php",
            foreach ($total_nodes as $key => $value) {
                $chunk_of_tidlist = array_chunk($value, 8000);
                $final_data = array();
                foreach ($chunk_of_tidlist as $tid_list) {
                    $temp_data = json_decode($commonObj->get_tweets_info($tid_list, true, $pname),true);
                    // print_r($temp_data);
                    $final_data = array_merge($final_data, $temp_data);
                }
                
                // print_r($final_data);
                for ($i=0; $i < sizeof($final_data) ; $i++) {                         
                    $file = fopen("storage/".$dir_name."/".$tweet_id.".csv","a+");
                    fputcsv($file,array('QW'.$ST_id.'*$#*##||____||##*#$*'.$temp_ST[0]['author'],'QW'.$final_data[$i]['tid'].'*$#*##||____||##*#$*'.$final_data[$i]['author'],"$key", $temp_ST[0]['sentiment'], $final_data[$i]['sentiment']));
                    fclose($file);
                }
            }   
        }
        
        
        r_($SourceTweetID,$hop_count,$date_list,$tweet_id,$dir_name, $pname);
        return json_encode("success");
    }
}