<?php

namespace App\Http\Controllers;

use App\DBModel\DBmodel;
use App\DBModel\DBmodelAsync;
use App\Library\QueryBuilder;
use App\Library\Utilities;
use Illuminate\Http\Request;

class TweetTracking extends Controller
{
    public function getTweetInfo(Request $request)
    {
        $request->validate([
            'id' => 'required',
        ]);
        $id = $request->input('id');
        $commonObj = new CommonController;
        $data = $commonObj->get_tweets_info($id, false);
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
        $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

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
        $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

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

        $final_result = array();
        $tweet_id_list = array();

        if ($request->input('from')) {
            $from=$request->input('from');
            $stm_list = $qb_obj->get_statement($to, $from, $source_tweet_id, $tweet_id_list_type, 'tweet_track');
        } else {
            $stm_list = $qb_obj->get_statement($to, null, $source_tweet_id, $tweet_id_list_type, 'tweet_track');
        }
        $result = $db_object->execute_query($stm_list[0]);
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



    public function get_tweet_idlist_for_sourceid($to=null, $from=null, $source_tweet_id=null, $tweet_id_list_type=null)
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
        $result = $db_object->execute_query($stm_list[0]);
        foreach ($result as $row) {
            array_push($tweet_id_list, $row['type_tweet_id']);
        }

        $final_result["chart_type"] = "tweet_id_list_for_tweet_track";
        $final_result["data"] = $tweet_id_list;
        return $final_result;
    }
}


