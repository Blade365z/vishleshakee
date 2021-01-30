<?php
namespace App\Library;

use App\Http\Controllers\LocationMap;
use App\Library\Utilities as Ut;
// date_default_timezone_set('UTC');  //enable to get datetime as UTC
date_default_timezone_set('Asia/Kolkata');  //enable to get datetime as local
class QueryBuilder{
    /**
    * Get statement and parameter to execute
    *
    * @return array containing prepared_statement and parameter
    */
    public function get_statement($to_datetime, $from_datetime=null, $token=null, $range_type=null, $feature_option=null, $co_occur_option=null, $async=true, $limit = null, $id_list=null){
        $ut_obj = new Ut;
        $final_res = null;        
        if(($feature_option == 'freq') or ($feature_option == 'sent') or ($feature_option == 'co_occur') or ($feature_option == 'tweet')){
            if(($range_type == '10sec') or ($range_type == 'hour') or ($range_type == 'day')){
                if($async){
                    if($feature_option == 'freq'){
                        $query_class = $this->get_query_class($token);                            
                        if($range_type == '10sec'){
                            $columns = 'created_date, created_time, category_class_list, count_list';
                            $table_name = 'token_count';
                            $input_args = $ut_obj->get_10sec_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name='" . $token ."'";
                        }
                        else if($range_type == 'hour'){
                            $columns = 'created_date, created_time, category_class_list, count_list';
                            $table_name = 'token_count_hour_wise';
                            $input_args = $ut_obj->get_hour_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name='" . $token ."'";
                        }else if($range_type == 'day'){
                            $columns = 'created_date, category_class_list, count_list';
                            $table_name = 'token_count_day_wise';
                            $input_args = $ut_obj->get_day_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND token_name='" . $token ."'";
                        }
                    }else if($feature_option == 'sent'){
                        $query_class = $this->get_query_class($token);                            
                        if($range_type == '10sec'){
                            $columns = 'created_date, created_time, category_class_list, count_list';
                            $table_name = 'token_count';
                            $input_args = $ut_obj->get_10sec_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name='" . $token ."'";
                        }else  if($range_type == 'hour'){
                            $columns = 'created_date, created_time, category_class_list, count_list';
                            $table_name = 'token_count_hour_wise';
                            $input_args = $ut_obj->get_hour_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name='" . $token ."'";
                        }else if($range_type == 'day'){
                            $columns = 'created_date, category_class_list, count_list';
                            $table_name = 'token_count_day_wise';
                            $input_args = $ut_obj->get_day_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND token_name='" . $token ."'";
                        }
                    }else if($feature_option == 'co_occur'){
                        $query_class = $this->get_query_class($token, 'co_occur', $co_occur_option);
                        if($range_type == '10sec'){
                            $columns = 'created_date, created_time, token_name2, count_list';
                            $table_name = 'token_co_occur';
                            // $table_name = $this->select_co_occur_table_for_token($token, $range_type);
                            $input_args = $ut_obj->get_10sec_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name1='" . $token ."'";
                        }else if($range_type == 'hour'){
                            $columns = 'created_date, created_time, token_name2, count_list';
                            $table_name = 'token_co_occur_hour_wise';
                            // $table_name = $this->select_co_occur_table_for_token($token, $range_type);
                            $input_args = $ut_obj->get_hour_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name1='" . $token ."'";
                        }else if($range_type == 'day'){
                            $columns = 'created_date, token_name2, count_list';
                            $table_name = 'token_co_occur_day_wise';
                            // $table_name = $this->select_co_occur_table_for_token($token, $range_type);
                            $input_args = $ut_obj->get_day_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND token_name1='" . $token ."'";
                        }
                    }else if($feature_option == 'tweet'){
                        $query_class = $this->get_query_class($token);
                        if($range_type == '10sec'){
                            $columns = 'category_class_list, tweetidlist';
                            $table_name = 'token_count';
                            $input_args = $ut_obj->get_10sec_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name='" . $token ."'";
                        }else if($range_type == 'hour'){
                            $columns = 'category_class_list, tweetidlist';
                            $table_name = 'token_count_hour_wise';
                            $input_args = $ut_obj->get_hour_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name='" . $token ."'";
                        }else  if($range_type == 'day'){
                            $columns = 'category_class_list, tweetidlist';
                            $table_name = 'token_count_day_wise';
                            $input_args = $ut_obj->get_day_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND token_name='" . $token ."'";
                        }
                    }
                    $prepared_statement = "SELECT ".$columns." FROM ".$table_name." WHERE ".$where_clause;  
                    $final_res[0] = $prepared_statement;
                    $final_res[1] = $input_args;
                }else{
                    //not async
                }
            }
        }


        
        // for top_hashtag, top_mention, top_user....................................................
        $feature_option_split = explode("_", $feature_option); //$feature_option = 'top_hashtag'/'top_mention' or 'top_latlng_hashtag'/'top_latlng_mention'
        if(($feature_option_split[0] == 'top') and ($feature_option_split[1] == 'latlng')){  
            // to get top data from location_token_co_occur.................
            // get location statement after where clause after getting country, state, city from mysql by calling function
            // $loc_str = "country='^india'";
            $location_obj = new LocationMap;
            $loc_str = $location_obj->get_location_statement($token);
            $query_class = $this->get_query_class($feature_option_split[2], $feature_option_split[0]);
            if(($range_type == '10sec') or ($range_type == 'hour') or ($range_type == 'day')){
                if($range_type == '10sec'){
                    $table_name = 'location_token_co_occur';
                    $input_args = $ut_obj->get_10sec_list_for_cassandra($to_datetime, $from_datetime);
                    $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ?";                   
                }else if($range_type == 'hour'){
                    $table_name = 'location_token_co_occur_hour_wise';
                    $input_args = $ut_obj->get_hour_list_for_cassandra($to_datetime, $from_datetime);
                    $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ?"; 
                }else if($range_type == 'day'){
                    $table_name = 'location_token_co_occur_day_wise';
                    $input_args = $ut_obj->get_day_list_for_cassandra($to_datetime, $from_datetime);
                    $where_clause = "created_date = ? AND class=" . $query_class; 
                }
            }
            $columns = 'category_class_list, count_list, token_name, tweet_cl_latitude, tweet_cl_longitude, country, city, state';
            $prepared_statement = "SELECT ".$columns." FROM ".$table_name." WHERE ".$where_clause. " AND ".$loc_str;  
            $final_res[0] = $prepared_statement;
            $final_res[1] = $input_args;
        }else if($feature_option_split[0] == 'top'){
            // to get top data from location_token_count....................
            $query_class = $this->get_query_class($feature_option_split[1], $feature_option_split[0]);
            if(($range_type == '10sec') or ($range_type == 'hour') or ($range_type == 'day')){
                if($range_type == '10sec'){
                    $table_name = 'token_count';
                    $input_args = $ut_obj->get_10sec_list_for_cassandra($to_datetime, $from_datetime);
                    $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ?";                   
                }else if($range_type == 'hour'){
                    $table_name = 'token_count_hour_wise';
                    $input_args = $ut_obj->get_hour_list_for_cassandra($to_datetime, $from_datetime);
                    $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ?"; 
                }else if($range_type == 'day'){
                    $table_name = 'token_count_day_wise';
                    $input_args = $ut_obj->get_day_list_for_cassandra($to_datetime, $from_datetime);
                    $where_clause = "created_date = ? AND class=" . $query_class; 
                }
            }
            $columns = 'category_class_list, count_list, token_name';
            $prepared_statement = "SELECT ".$columns." FROM ".$table_name." WHERE ".$where_clause;  
            $final_res[0] = $prepared_statement;
            $final_res[1] = $input_args;
        }      



        
        // for tweet info....................................................
        if($feature_option == 'tweet_info'){
            if($async){
                $final_res[0] = "SELECT t_location,datetime,tid,author,author_id,author_profile_image,author_screen_name,sentiment,quoted_source_id,tweet_text,retweet_source_id,media_list,type,category,tl_longitude,tl_latitude from tweet_info_by_id_test WHERE tid=?";
                $input_args = array();
                foreach ($id_list as $value) {
                    array_push($input_args, array($value));
                }
                $final_res[1] = $input_args;
            }else{
                $final_res[0] = "SELECT t_location,datetime,tid,author,author_id,author_profile_image,author_screen_name,sentiment,quoted_source_id,replyto_source_id,retweet_source_id,tweet_text,retweet_source_id,media_list,type,category,tl_longitude,tl_latitude from tweet_info_by_id_test WHERE tid=" . "'" .$token."'";
            }
        }




        // for user info....................................................
        if($feature_option == 'user_info'){
            if($async){
                $final_res[0] = "SELECT author_id, author, author_screen_name, profile_image_url_https from user_record WHERE author_id=?";
                $input_args = array();
                foreach ($id_list as $value) {
                    $value = str_replace('$','', $value);
                    array_push($input_args, array($value));
                }
                $final_res[1] = $input_args;
            }else{
                // $token = '$821712536215362' 
                $token = str_replace('$','', $token);
                $final_res[0] = "SELECT author_id, author, author_screen_name, profile_image_url_https,description,created_at,url,verified,location from user_record WHERE author_id=" . "'" .$token."'";
            }
        }



        //for tweet tracking....................................................
        // range_type = retweet, Reply, QuotedTweet, Tweet
        //$token = source_tweet_id
        if($feature_option == 'tweet_track'){
            if($range_type=='all'){
                $input_args = $ut_obj->get_day_list_for_cassandra($to_datetime, $from_datetime);
                $where_clause = "source_tweet_id='" . $token ."' AND datetime = ? " ;
                $prepared_statement = "SELECT * FROM tweet_track WHERE ".$where_clause;  
                $final_res[0] = $prepared_statement;
                $final_res[1] = $input_args;
            }else{
                if($from_datetime){
                    $input_args = $ut_obj->get_day_list_for_cassandra($to_datetime, $from_datetime);
                    $where_clause = "source_tweet_id='" . $token ."' AND datetime = ? AND tweet_type='" . $range_type ."'";
                    $prepared_statement = "SELECT * FROM tweet_track WHERE ".$where_clause;  
                    $final_res[0] = $prepared_statement;
                    $final_res[1] = $input_args;
                }else{
                    $where_clause = "source_tweet_id='" . $token ."' AND datetime ='" . $to_datetime ."' AND tweet_type='" . $range_type ."'";
                    $prepared_statement = "SELECT * FROM tweet_track WHERE ".$where_clause;  
                    $final_res[0] = $prepared_statement;
                }
            }
            
        }
        
        return $final_res;
    }





    /**
    * Get class of token or co-occur of token('hashtag'/'mention'/'user'/'#COVID'/'@modi')
    *
    * @return integer
    */
    public function get_query_class($token=null, $option=null, $co_occur_option=null){
        if($option == 'co_occur'){
            if (strpos($token, '#') !== false) {               
                switch ($co_occur_option) {
                    case 'mention':
                        $class = 2;
                        break;
                    case 'hashtag':
                        $class = 0;
                        break;
                    case 'user':
                        $class = 8;
                        break;
                    case 'keyword':
                        $class = 4;
                        break;
                    default:
                        # code...
                        break;
                }
            } else  if (strpos($token, '*') !== false) {
                switch ($co_occur_option) {
                    case 'mention':
                        $class = 7;
                        break;
                    case 'hashtag':
                        $class = 5;
                        break;
                    case 'user':
                        $class = 12;
                        break;
                    case 'keyword':
                        $class = 22;
                        break;
                    default:
                        # code...
                        break;
                }
            } else  if (strpos($token, '$') !== false) {
                switch ($co_occur_option) {
                    case 'mention':
                        $class = 11;
                        break;
                    case 'hashtag':
                        $class = 9;
                        break;

                    default:
                        # code...
                        break;
                }
            }else  if (strpos($token, '@') !== false) {
                switch ($co_occur_option) {
                    case 'mention':
                        $class = 1;
                        break;
                    case 'hashtag':
                        $class = 3;
                        break;
                    case 'user':
                        $class = 10;
                        break;
                    case 'keyword':
                        $class = 6;
                        break;

                    default:
                        # code...
                        break;
                }
            }
        }else if($option == 'top'){
            switch($token){
                case 'mention':
                    $class = 1;
                    break;
                case 'hashtag':
                    $class = 0;
                    break;
                case 'user':
                    $class = 2;
                    break;
                default:
                    # code...
                    break;
            }
        }else{
            if (strpos($token, '#') !== false) {
                $class = 0;
            } else  if (strpos($token, '^') !== false) {
                $class = 4;
            } else  if (strpos($token, '*') !== false) {
                $class = 3;
            } else  if (strpos($token, '$') !== false) {
                $class = 2;
            }else  if (strpos($token, '@') !== false) {
                $class = 1;
            }
        }
        return $class;
    }




    public function select_co_occur_table_for_token($token=null, $range){
        if ($token[0] == '*') {
            if (($token[1] == 'a') or ($token[1] == 'b') or ($token[1] == 'c') or ($token[1] == 'd') or ($token[1] == 'e')) {
                if($range == '10sec')
                    $table_name = 'token_co_occur_ae';
                else if($range == 'hour')
                    $table_name = 'token_co_occur_hour_wise_ae';
                else if($range == 'day')
                    $table_name = 'token_co_occur_day_wise_ae';
            } else if (($token[1] == 'f') or ($token[1] == 'g') or ($token[1] == 'h') or ($token[1] == 'i') or ($token[1] == 'j')) {
                if($range == '10sec')
                    $table_name = 'token_co_occur_fj';
                else if($range == 'hour')
                    $table_name = 'token_co_occur_hour_wise_fj';
                else if($range == 'day')
                    $table_name = 'token_co_occur_day_wise_fj';
            }else if (($token[1] == 'k') or ($token[1] == 'l') or ($token[1] == 'm') or ($token[1] == 'n') or ($token[1] == 'o')) {
                if($range == '10sec')
                    $table_name = 'token_co_occur_ko';
                else if($range == 'hour')
                    $table_name = 'token_co_occur_hour_wise_ko';
                else if($range == 'day')
                    $table_name = 'token_co_occur_day_wise_ko';
            }else if (($token[1] == 'p') or ($token[1] == 'q') or ($token[1] == 'r') or ($token[1] == 's') or ($token[1] == 't')) {
                if($range == '10sec')
                    $table_name = 'token_co_occur_pt';
                else if($range == 'hour')
                    $table_name = 'token_co_occur_hour_wise_pt';
                else if($range == 'day')
                    $table_name = 'token_co_occur_day_wise_pt';
            }else if (($token[1] == 'u') or ($token[1] == 'v') or ($token[1] == 'w') or ($token[1] == 'x') or ($token[1] == 'y') or ($token[1] == 'z')) {
                if($range == '10sec')
                    $table_name = 'token_co_occur_uz_09_sym';
                else if($range == 'hour')
                    $table_name = 'token_co_occur_hour_wise_uz_09_sym';
                else if($range == 'day')
                    $table_name = 'token_co_occur_day_wise_uz_09_sym';
            }
        }else{
            if($range == '10sec')
                $table_name = 'token_co_occur';
            else if($range == 'hour')
                $table_name = 'token_co_occur_hour_wise';
            else if($range == 'day')
                $table_name = 'token_co_occur_day_wise';
        }

        return $table_name;
    }
}