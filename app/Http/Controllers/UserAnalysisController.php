<?php

namespace App\Http\Controllers;

use App\DBModel\DBmodel;
use App\Http\Controllers\CommonController as CC;
use Illuminate\Http\Request;
use App\CrawlerList;
use PhpParser\Node\Expr\Cast\Array_;

use function GuzzleHttp\json_decode;
use function GuzzleHttp\Promise\each;
use function PHPSTORM_META\type;

class UserAnalysisController extends Controller
{

    public function first_list(Request $request)
    {

        $user_name = $request->input('token');
        $user_name = strtolower($user_name);
        $verified = $request->input('verified');
        $clearFlag = $request->input('clearFlag');
        if ($clearFlag == 1) {
            $request->session()->forget('page_state_token');
        }
        $lucene = '{filter: [{type: "match", field: "verified", value: "' . $verified . '"}],  query: {type: "phrase", field: "author", value: "' . $user_name . '"}}';
        $statement = "select author_id,author_screen_name,author,profile_image_url_https,verified from user_record  WHERE expr(user_record_index1,'" . $lucene . "')";
        $trigger = new DBmodel;
        if ($request->session()->has('page_state_token')) {
            $options = array(
                'page_size' => 10,
                'paging_state_token' => $request->session()->get('page_state_token'),
            );
        } else {
            $options = array(
                'page_size' => 20,
            );
        }
        $result = $trigger->execute_query($statement, $options);
        $request->session()->put('page_state_token', $result->pagingStateToken());
        $data = array();
        foreach ($result as $record) {
            $arr['author_id'] = $record['author_id'];
            $arr['author'] = $record['author'];
            $arr['profile_image_url_https'] = $record['profile_image_url_https'];
            $arr['verified'] = $record['verified'];
            $arr['author_screen_name'] = $record['author_screen_name'];
            array_push($data, $arr);
        }
        echo json_encode($data);
    }



    public function get_page_state_token(Request $request)
    {
        $page_state = $request->session()->get('page_state_token');
        return $page_state;
    }



    public function getSuggestedUsers()
    {
        if (isset($_GET['userIDArray'])) {
            $userIDsArr = $_GET['userIDArray'];
        } else {
            return response()->json(['error' => 'No Data Captured'], 400);
        }
        $common_object = new CC;
        echo $common_object->get_user_info($userIDsArr, true);
    }



    public function getUserDetails(Request $request)
    {   
        $pname = null;
        if ($request->input('pname')){
            $pname = $request->input('pname');
            
        }
        if ($request->input('userID')) {
            $userID = $request->input('userID');
            $common_object = new CC;
        return $common_object->get_user_info($userID, false, $pname);
        }else if($request->input('userIDList')){
            $userIDList = $request->input('userIDList');
            $common_object = new CC;
            return $common_object->get_user_info($userIDList, true, $pname);
        }
         else {
            return response()->json(['error' => 'No Data Captured'], 400);
        }
        
    }




    public function getFrequencyDataForUser(Request $request)
    {
        if ($request->input('to') && $request->input('from') && $request->input('query') && $request->input('rangeType')) {
            $rangeType = $request->input('rangeType');
            $query = $request->input('query');
            $from = $request->input('from');
            $to = $request->input('to');
            $rangeType = $request->input('rangeType');
            if ($request->input('isDateTimeAlready') == 0) {
                $fromTime = date('Y-m-d H:i:s', strtotime($from) + 0);
                $toTime = date('Y-m-d H:i:s', strtotime($to) + 0);
            } else {
                $fromTime = $from;
                $toTime = $to;
            }

            $pname = null;
            if ($request->input('pname')){
                $pname = $request->input('pname');
            }

            //A little extra processing for 10seconds plot.
            if ($rangeType == '10sec') {
                $fromTime = date('Y-m-d H:i:s', strtotime($fromTime) - 3600);
                $toTime = date('Y-m-d H:i:s', strtotime($toTime) + 0);
            }

            $commonObj = new CommonController;
            $data = $commonObj->get_frequency_distribution_data($toTime, $fromTime, $query, $rangeType, true, true,  $pname);
            return $data;

        } else {
            return response()->json(['error' => 'Please check yout arguments'], 400);
        }
    }



    
    public function getTweetIDUA(Request $request)
    {
        if ($request->input('to') && $request->input('from') && $request->input('query')) {
            $rangeType = $request->input('rangeType');
            $query = $request->input('query');
            $from = $request->input('from');
            $to = $request->input('to');
            $pname = null;
            if ($request->input('pname')){
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
            return $data;
        } else {
            return response()->json(['error' => 'Please check yout arguments'], 400);
        }
    }


    public function getSentimentDataForUser(Request $request)
    {
        if ($request->input('to') && $request->input('from') && $request->input('query') && $request->input('rangeType')) {
            $rangeType = $request->input('rangeType');
            $query = $request->input('query');
            $from = $request->input('from');
            $to = $request->input('to');
            $rangeType = $request->input('rangeType');
            if ($request->input('isDateTimeAlready') == 0) {
                $fromTime = date('Y-m-d H:i:s', strtotime($from) + 0);
                $toTime = date('Y-m-d H:i:s', strtotime($to) + 0);
            } else {
                $fromTime = $from;
                $toTime = $to;
            }

            $pname = null;
            if ($request->input('pname')){
                $pname = $request->input('pname');
            }


            //A little extra processing for 10seconds plot.
            if ($rangeType == '10sec') {
                $fromTime = date('Y-m-d H:i:s', strtotime($fromTime) - 3600);
                $toTime = date('Y-m-d H:i:s', strtotime($toTime) + 0);
            }

            $commonObj = new CommonController;
            $data = $commonObj->get_sentiment_distribution_data($toTime, $fromTime, $query, $rangeType, $pname);
            return $data;

        } else {
            return response()->json(['error' => 'Please check yout arguments'], 400);
        }
    }


    public function getCooccurDataForUser(Request $request)
    {
        if ($request->input('uniqueID') && $request->input('userID') && $request->input('option')) {
            $uniqueID = $request->input('uniqueID');
            $userID = $request->input('userID');
            $option = $request->input('option');
            $file_path = $userID . '/' . $uniqueID . '.csv';
        } else {
            return response()->json(['error' => 'Unique ID / User ID not provided'], 400);
        }

        if ($request->input('mode') == 'write') {
            if ($request->input('to') && $request->input('from') && $request->input('query')) {
                $query = $request->input('query');
                $from = $request->input('from');
                $to = $request->input('to');
                $fromTime = date('Y-m-d H:i:s', strtotime($from) + 0);
                $toTime = date('Y-m-d H:i:s', strtotime($to) + 0);
                //To Debug using the line below :: To check if all the arguments in the body are being parsed or not.
                // return response()->json(['fromDate' => $fromTime,'toDate'=>$toTime,'query'=>$query,'option'=>$option,'uniqueID'=>$uniqueID,'userID'=>$userID ,'filePath'=> $path ], 200);
                $pname = null;
                if ($request->input('pname')){
                    $pname = $request->input('pname');
                }

                $commonObj = new CommonController;
                $data = $commonObj->get_co_occur_data($toTime, $fromTime, $query, null, $option, $file_path, true, false, $userID, $pname);
                return $data;
            } else {
                return response()->json(['error' => 'Please check yout arguments'], 400);
            }
        } else if ($request->input('mode') == 'read') {
            $commonObj = new CommonController;
            $limit = $request->input('limit');
            $data = $commonObj->data_formatter_for_co_occur(null, $option, $limit, $uniqueID, $file_path, $userID);
            return $data;
        }

    }



    public function getUAListFromCrawler()
    {
        $crawlerListObj = CrawlerList::where('type', '=', 'user')->get('track');
        return $crawlerListObj;
    }


    

    public function getNetworkTweetIDUA(Request $request)
    {
        if ($request->input('to') && $request->input('from') && $request->input('query')) {
            $rangeType = $request->input('rangeType');
            $query = $request->input('query');
            $from = $request->input('from');
            $to = $request->input('to');
            $hashtags = $request->input('hashtags');
            $mentions = $request->input('mentions');
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

            $pname = null;
            if ($request->input('pname')){
                $pname = $request->input('pname');
            }
            
            //A little extra processing for 10seconds plot.
            if ($rangeType == '10sec') {
                $fromTime = date('Y-m-d H:i:s', strtotime($fromTime) - 3600);
                $toTime = date('Y-m-d H:i:s', strtotime($toTime) + 0);
            }
            $arrTemp = ["range_type" => $rangeType, "fromTime" => $fromTime, "toTime" => $toTime, "query" => $query, "filter" => $filter];
            // return $arrTemp;
            $commonObj = new CommonController;
            $data = $commonObj->get_tweets($toTime, $fromTime, $query, $rangeType, $filter, $pname);

            $tweetinfo = json_decode($commonObj->get_tweets_info($data["data"], true, $pname),true);
            
            // echo json_encode($tweetinfo);
            $tweetIdRelated = Array();
            $tweetIdNonRelated = [];
            // $hashtags = ['#IPL2021Auction','#Shweta','#RIP','#Brother','#RollBackModiTax','#LPGPriceHike','#RollBac…RT'];
            foreach ($hashtags as $hash) {
                foreach ($tweetinfo as $t) {
                    if (strpos($t["tweet_text"], "#".$hash." ") !== false) {
                        // echo json_encode($t);
                        array_push($tweetIdRelated,$t["tid"]);
                    }
                    
                }   
            }
        
            // return $tweetIdRelated;

            $array = array();

            // Use strtotime function 
            $Variable1 = strtotime($from);
            $Variable2 = strtotime($to);

            // Use for loop to store dates into array 
            // 86400 sec = 24 hrs = 60*60*24 = 1 day 
            for ($currentDate = $Variable1; $currentDate <= $Variable2; 
                                            $currentDate += (86400)) { 
                                                
            $Store = date('Y-m-d', $currentDate); 
            $array[] = $Store; 
            }

            function process_source__($ST_id, $date_list){
                    $tweet_id_type = ["retweet", "QuotedTweet", "Reply"];
                    $trigger = new TweetTracking;
                    $all_type_data = array();
                    $all_type_data["total"] = 0;
                    foreach ($tweet_id_type as $type) {
                        $temp_data = [];
                        foreach ($date_list as $date) {
                            $result = $trigger->get_tweet_idlist_for_sourceid($to = $date, $from = null, $source_tweet_id = $ST_id, $tweet_id_list_type = $type);
                            array_push($temp_data, $result["data"]);
                        }
                        $temp_data = call_user_func_array('array_merge', $temp_data);
                        $all_type_data[$type] = sizeof($temp_data);
                        $all_type_data["total"] = $all_type_data["total"] + sizeof($temp_data);
                    }
                    // echo json_encode($all_type_data);
                    $all_type_data["tid"]=$ST_id;
                    return $all_type_data;
            }
            $Total =array();
            $TweetIdCountDetails = [];
            $TweetIdCountDetails["tweetId"] = $tweetIdRelated;
            foreach ($tweetIdRelated as $t){
                array_push($Total,process_source__($t,$array));
            }
            $TweetIdCountDetails["tweetCount"] = $Total;
            return json_encode($TweetIdCountDetails);
        } else {
            return response()->json(['error' => 'Please check yout arguments!'], 400);
        }

    }

}
