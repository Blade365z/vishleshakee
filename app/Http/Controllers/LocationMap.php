<?php

namespace App\Http\Controllers;

use App\DBModel\DBmodel;
use App\DBModel\DBmodelAsync;
use App\Http\Controllers\CommonController;
use App\Http\Controllers\TweetTracking;
use App\Http\Controllers\Home as Hm;
use Illuminate\Http\Request;
use App\CityState;
use App\LocationCode;

use function GuzzleHttp\json_decode;
use function PHPSTORM_META\type;

class LocationMap extends Controller
{

    // This will provide tweet information
    // given tweet id.
    // param: tweet_id list
    // output: tweet information
    public function tweet_info(Request $request)
    {
        $tweetid_list_array = $request->input('tweetid_list_array');
        $pname = null;
        if ($request->input('pname')) {
            $pname = $request->input('pname');
        }

        $commonObj = new CommonController;
        return $commonObj->get_tweets_info($tweetid_list_array, true, $pname);
    }
    public function tweet_info_for_tracking(Request $request)
    {
        $input_args = array();
        $tweetid_list_array = $request->input('arr');
        foreach ($tweetid_list_array as $value) {
            array_push($input_args, array($value));
        }
        $commonObj = new CommonController;
        return $commonObj->get_tweets_info($tweetid_list_array);
    }



    public function get_current_date_time()
    {
        $interval = $_GET['interval'];
        $datetime_object = new Hm;
        $current_datetime_to_datetime = $datetime_object->CurrentDateTimeGeneratorPublic($interval);

        return $current_datetime_to_datetime;
    }

    public function get_tweet_id_list(Request $request)
    {

        $query = $request->input('query');
        $from_datetime = $request->input('from');
        $to_datetime = $request->input('to');
        $option = $request->input('option');
        $pname = null;
        if ($request->input('pname')) {
            $pname = $request->input('pname');
        }

        $commonObj = new CommonController;

        $r = $commonObj->get_tweets($to_datetime, $from_datetime, $query, '10sec', 'all', $pname);

        $tweetid_list_array = array();

        foreach ($r['data'] as $tid) {
            array_push($tweetid_list_array, $tid);
        }

        if ($option == "tweet_id") {
            return $tweetid_list_array;
        } else if ($option == "tweet_info") {
            return $commonObj->get_tweets_info($tweetid_list_array, true, $pname);
        }
    }

    public function get_top_hashtags(Request $request)
    {
        $commonObj = new CommonController;
        $query = $request->input('query');
        $from_datetime = $request->input('from');
        $to_datetime = $request->input('to');
        $type = $request->input('type');
        $r = $commonObj->get_top_data_cat_by_location($to_datetime, $from_datetime, 'top_latlng_hashtag', $query, '10sec');
        return $r;
    }

    public function get_hashtags(Request $request)
    {

        $commonObj = new CommonController;
        $query = $request->input('query');
        $from_datetime = $request->input('from');
        $to_datetime = $request->input('to');
        $type = $request->input('type');
        $r = $commonObj->get_top_data_lat_lng($to_datetime, $from_datetime, 'top_latlng_hashtag', $query, '10sec');
        return json_encode($r);
    }

    // This function is used for
    // public page to plot on the map
    // param: query as hashtag, intervals
    //        as time
    // output: echo the results in json format

    public function location_tweet(Request $request)
    {

        if ($request->input('to') && $request->input('from') && $request->input('query')) {
            $rangeType = $request->input('rangeType');
            $query = $request->input('query');
            $from = $request->input('from');
            $to = $request->input('to');
            $pname = null;
            if ($request->input('pname')) {
                $pname = $request->input('pname');
            }

            if ($request->input('isDateTimeAlready') == 0) {
                $fromTime = date('Y-m-d H:i:s', strtotime($from) + 0);
                $toTime = date('Y-m-d H:i:s', strtotime($to) + 0);
            } else {
                $fromTime = $from;
                $toTime = $to;
            }

            if ($request->input('filter') != 'all') {
                $filter = $request->input('filter');
            } else {
                $filter = null;
            }

            //A little extra processing for 10seconds plot.
            if ($rangeType == '10sec') {
                $fromTime = date('Y-m-d H:i:s', strtotime($fromTime) - 3600);
                $toTime = date('Y-m-d H:i:s', strtotime($toTime) + 0);
            }

            $arrTemp = ["range_type" => $rangeType, "fromTime" => $fromTime, "toTime" => $toTime, "query" => $query, "filter" => $filter];
            $commonObj = new CommonController;
            $data = $commonObj->get_tweets($toTime, $fromTime, $query, $rangeType, $filter, $pname);


            $tweetid_list_array = array();
            // array_push($tweetid_list_array,'1300689867836395526');
            // array_push($tweetid_list_array,'1305520073982054400');

            foreach ($data['data'] as $tid) {
                array_push($tweetid_list_array, $tid);
            }

            $tweetid_list_array = array_unique($tweetid_list_array);

            return $commonObj->get_tweets_info($tweetid_list_array, true, $pname);
            // return $this->tweet_info($tweetid_list_array);
        }
    }

    public function location_tweet_home($intervalArg = null, $queryArg = null, Request $request)
    {
        if (!$request->input('fromTime') || !$request->input('toTime')) {
            $pname = null;
            if ($request->input('pname')) {
                $pname = $request->input('pname');
            }

            if ($request->input('interval') && $request->input('query')) {
                $interval = $request->input('interval');
                if ($interval > 86400) {
                    return response()->json(['error' => 'Not Allowed'], 400);
                }
                $query = $request->input('query');
            } else if ($intervalArg && $queryArg) {
                $interval = $intervalArg;
                $query = $queryArg;
            } else {
                return response()->json(['error' => 'interval  or query not set'], 400);
            }

            $datetime_object = new Hm;
            $dateTimeArgs = $datetime_object->CurrentDateTimeGeneratorPublic($interval);
            $fromTime = $dateTimeArgs[0];
            $toTime = $dateTimeArgs[1];
        } else {
            $fromTime = $request->input('fromTime');
            $toTime = $request->input('toTime');
            $query = $request->input('query');
        }
        if ($request->input('filter')) {
            $filter = $request->input('filter');
        } else {
            $filter = null;
        }
        $commonObj = new CommonController;
        // $data = $commonObj->get_tweets($toTime, $fromTime, $query, '10sec', $filter, 'tweet');
        $data = $commonObj->get_tweets($toTime, $fromTime, $query, '10sec', $filter,$pname);
        // return $data;
        $tweetid_list_array = array();
        // array_push($tweetid_list_array,'1300689867836395526');
        // array_push($tweetid_list_array,'1305520073982054400');

        foreach ($data['data'] as $tid) {
            array_push($tweetid_list_array, $tid);
        }

        $tweetid_list_array = array_unique($tweetid_list_array);

        return $commonObj->get_tweets_info($tweetid_list_array, true, $pname);
        // return $this->tweet_info($tweetid_list_array);
    }

    public function checkLocation_(Request $request)
    {
        $place = $request->input('place');
        $trigger = new DBmodel;
        $statement = "SELECT code from location_code WHERE location ='" . $place . "'";
        $result_code = $trigger->execute_query($statement, null, null);
        foreach ($result_code as $c) {
            $code = $c['code'];
        }
        return json_encode($code);
    }
    public function getLocationNames()
    {
        $location = array();
        $trigger = new DBmodel;
        $statement = "SELECT location from location_code";
        $result_code = $trigger->execute_query($statement, null, null);
        foreach ($result_code as $l) {
            array_push($location, $l['location']);
        }
        return json_encode($location);
    }

    public function get_location_statement($temp)
    {
        $state = ' ';
        $city = ' ';
        $country = ' ';
        $loc = array();

        $location = explode("^", $temp)[1];
        // echo $location[0];

        $locationCodeObj = LocationCode::select('code')->where('location', $location)->get();
        $code = $locationCodeObj[0]["code"];

        // $trigger = new DBmodel;
        // $statement = "SELECT code from location_code WHERE location ='" . $location . "'";
        // $result_code = $trigger->execute_query($statement, null, null);
        // foreach ($result_code as $c) {
        //     $code = $c['code'];
        // }

        if ($code == 0) {
            $locationType = "city";
        } elseif ($code == 1) {
            $locationType = "state";
        } elseif ($code == 2) {
            $locationType = "country";
        }

        $locationObj = CityState::select('city', 'state', 'country')->where($locationType, $location)->get();
        $locationObj = $locationObj[0];

        $city_state_country_stm = '';
        if ($code == 0) {
            $city_state_country_stm = "country='^" . $locationObj["country"] . "' AND state='^" . $locationObj["state"] . "' AND city='^" . $locationObj["city"] . "'";
        } elseif ($code == 1) {
            $city_state_country_stm = "country='^" . $locationObj["country"] . "' AND state='^" . $locationObj["state"] . "'";
        } elseif ($code == 2) {
            $city_state_country_stm = "country='^" . $locationObj["country"] . "'";
        }
        // if (($city == ' ') && ($state == ' ') && ($country == ' ')) {
        // echo nothing
        // } else if (($city != ' ') && ($state != ' ') && ($country != ' ')) {
        //     $city_state_country_stm = "country='" . $country . "' AND state='" . $state . "' AND city='" . $city . "'";
        // } else if (($city == ' ') && ($state != ' ') && ($country != ' ')) {
        //     $city_state_country_stm = "country='" . $country . "' AND state='" . $state . "'";
        // } else if (($city == ' ') && ($state == ' ') && ($country != ' ')) {
        //     $city_state_country_stm = "country='" . $country . "'";
        // }

        return $city_state_country_stm;
    }

    public function showData(Request $request)
    {
        $location = $request->input('location');
        return json_encode($this->get_location_statement($location));
    }

    public function generate_tweet_network(Request $request)
    {
        $pname = null;
        if ($request->input('pname')) {
            $pname = $request->input('pname');
        }

        // $date_list = ["2020-10-31", "2020-11-01", "2020-11-02"];
        $date_list = ["2020-12-02", "2020-12-03", "2020-12-04","2020-12-21","2020-12-22"];

        $node_no = 1;
        $hop_count = 1;

        $current_hop_node_count = 1;
        $total_nodes = 0;

        $tweet_id = $request->input('tweet_id');
        $SourceTweetID = new \SplQueue();
        $SourceTweetID->enqueue($tweet_id);

        function r($SourceTweetID, $node_no,$current_hop_node_count,$total_nodes,$hop_count,$date_list,$pname)
        {
            

            $SourceTweetID->rewind();
            $ST_id = $SourceTweetID->current();
            $SourceTweetID->dequeue();
            
            $all_type_data = process_source($ST_id, $date_list);

            foreach($all_type_data["Reply"] as $q){
                $SourceTweetID->enqueue($q);
            }
            foreach($all_type_data["QuotedTweet"] as $q){
                $SourceTweetID->enqueue($q);
            }

            $total_nodes= $total_nodes + sizeof($all_type_data["QuotedTweet"])+sizeof($all_type_data["Reply"]);
            
            prepare_the_graph($ST_id,$all_type_data,$pname);

            if($node_no==$current_hop_node_count){
                if ($hop_count<=3) {
                    $current_hop_node_count = $total_nodes;
                    $node_no = 1;
                    $total_nodes = 0;
                    $hop_count = $hop_count+1;
                    r($SourceTweetID, $node_no,$current_hop_node_count,$total_nodes,$hop_count,$date_list,$pname);
                
                }
                
            }
            else{
                if ($hop_count<=10) {
                    
                    $node_no = $node_no + 1;
                    r($SourceTweetID, $node_no,$current_hop_node_count,$total_nodes,$hop_count,$date_list,$pname);
                }
                else{
                    return;
                }
            }
           
        }

        function process_source($ST_id, $date_list)
        {
            $tweet_id_type = ["retweet", "QuotedTweet", "Reply"];
            $trigger = new TweetTracking;
            $all_type_data = array();
            foreach ($tweet_id_type as $type) {
                $temp_data = [];
                foreach ($date_list as $date) {
                    $result = $trigger->get_tweet_idlist_for_sourceid($to = $date, $from = null, $source_tweet_id = $ST_id, $tweet_id_list_type = $type);
                    array_push($temp_data, $result["data"]);
                }
                $temp_data = call_user_func_array('array_merge', $temp_data);
                $all_type_data[$type] = $temp_data;
            }
            return $all_type_data;
        }

        function prepare_the_graph($ST_id,$total_nodes,$pname){
            $commonObj = new CommonController;
            $temp_ST = json_decode($commonObj->get_tweets_info(array($ST_id), true,null),true);

            foreach ($total_nodes as $key => $value) {
                $temp_data = json_decode($commonObj->get_tweets_info($value, true,null),true);
                
                
                for ($i=0; $i < sizeof($temp_data) ; $i++) { 
                        
                    $file = fopen("storage/1/temp.csv","a+");
                    // $line = $ST_id.",".$value[$i];

                    
                    fputcsv($file,array($ST_id."__".$temp_ST[0]["author"],$temp_data[$i]["tid"]."__".$temp_data[$i]["author"],$key));
                    
                    
                    fclose($file);
                }
                
            }
            // $list = array (
            //     array("Peter", "Griffin" ,"Oslo", "Norway"),
            //     array("Glenn", "Quagmire", "Oslo", "Norway")
            //   );
              
            //   $file = fopen("/vishleshakee/storage/1/temp.csv","a+");
              
            //   foreach ($list as $line) {
            //     fputcsv($file, $line);
            //   }
              
            //   fclose($file);
        };


        r($SourceTweetID, $node_no,$current_hop_node_count,$total_nodes,$hop_count,$date_list,$pname);





        // $trigger = new TweetTracking;
        // $trigger->get_tweet_idlist_for_sourceid($to=null, $from=null, $source_tweet_id=null, $tweet_id_list_type=null);
        // return $trigger->get_tweet_idlist_for_sourceid($to="2020-10-31", $from=null, $source_tweet_id="1322562906014306311", $tweet_id_list_type="retweet");
    }

    public function generate_tweet_network_(Request $request)
    {
        $pname = null;
        if ($request->input('pname')) {
        $pname = $request->input('pname');
        }

        $date_list = $request->input('dateArr');
        $dir_name = $request->input('userID');
        $hop_count = 0;

        $tweet_id = $request->input('id');
        $SourceTweetID = new \SplQueue();
        $SourceTweetID->enqueue($tweet_id);
        $SourceTweetID->enqueue("H");

        $file = fopen("storage/".$dir_name."/".$tweet_id.".csv","w");
        fclose($file);

        // nested function
        function r_($SourceTweetID,$hop_count,$date_list,$tweet_id,$dir_name)
        {

            print_r($SourceTweetID);
            $SourceTweetID->rewind();
            $ST_id = $SourceTweetID->current();
            if ($hop_count!=10) {
                
            
                if ($ST_id=="H") {
                    $SourceTweetID->dequeue();
                    $SourceTweetID->rewind();
                    $temp_check = $SourceTweetID->current();
                    if ($temp_check) {
                        print_r($temp_check);
                        $hop_count = $hop_count + 1;
                        $SourceTweetID->enqueue("H");
                        echo "Hope Count";
                        echo($hop_count);
                        r_($SourceTweetID,$hop_count,$date_list,$tweet_id,$dir_name);
                    }
                    else {
                        echo "Hope Exist till   :";
                        echo($hop_count);
                        return array($tweet_id);
                    }
                    
                }
                else {
                    $SourceTweetID->rewind();
                    $ST_id = $SourceTweetID->current();
                    $SourceTweetID->dequeue();
                    
                    $all_type_data = process_source_($ST_id, $date_list);
        
                    foreach($all_type_data["Reply"] as $q){
                        $SourceTweetID->enqueue($q);
                    }
                    foreach($all_type_data["QuotedTweet"] as $q){
                        $SourceTweetID->enqueue($q);
                    }
                    
                    prepare_the_graph_($ST_id,$all_type_data,$tweet_id,$dir_name);
                    r_($SourceTweetID,$hop_count,$date_list,$tweet_id,$dir_name);

                }
            }
            else {
                return;
            }
        }

        // nested function
        function process_source_($ST_id, $date_list)
            {
                $tweet_id_type = ["retweet", "QuotedTweet", "Reply"];
                $trigger = new TweetTracking;
                $all_type_data = array();
                foreach ($tweet_id_type as $type) {
                    $temp_data = [];
                    foreach ($date_list as $date) {
                        $result = $trigger->get_tweet_idlist_for_sourceid($to = $date, $from = null, $source_tweet_id = $ST_id, $tweet_id_list_type = $type);
                        array_push($temp_data, $result["data"]);
                    }
                    $temp_data = call_user_func_array('array_merge', $temp_data);
                    $all_type_data[$type] = $temp_data;
                }
                echo json_encode($all_type_data);
                return $all_type_data;
            }

            // nested function
            function prepare_the_graph_($ST_id,$total_nodes,$tweet_id,$dir_name){

                $commonObj = new CommonController;
                $temp_ST = json_decode($commonObj->get_tweets_info(array($ST_id), true,null),true);
                foreach ($total_nodes as $key => $value) {
                    $temp_data = json_decode($commonObj->get_tweets_info($value, true,null),true);
                    
                    
                    for ($i=0; $i < sizeof($temp_data) ; $i++) { 
                            
                        $file = fopen("storage/".$dir_name."/".$tweet_id.".csv","a+");
                        fputcsv($file,array('QW'.$ST_id.'*$#*##||____||##*#$*'.$temp_ST[0]['author'],'QW'.$temp_data[$i]['tid'].'*$#*##||____||##*#$*'.$temp_data[$i]['author'],"$key"));
                        fclose($file);
                    }
                    
                }   
            }
        r_($SourceTweetID,$hop_count,$date_list,$tweet_id,$dir_name);
        return json_encode("success");
    }

    public function tweetid_userInfo(Request $request)
    {
        $tweet_id = $request->input('id_array');
    }
}
