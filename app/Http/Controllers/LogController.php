<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DateTime;
date_default_timezone_set('Asia/Kolkata');  //enable to get datetime as local

class LogController extends Controller
{
    //
    public function write_to_log_file(Request $request){
        $user_id = $request->input('user_id');
        $action_msg = $request->input('action_msg');
        $datetimeobj = new DateTime();
        $datetime = $datetimeobj->format('Y-m-d H:m:s');
        $log_msg = "User ID[".strval($user_id)."] at ".$datetime. " ACTION: ".$action_msg;
        $this->dolog($log_msg);
        echo json_encode(array("res"=>"logged"));
    }



    public function dolog($log_msg)
    {
        $log_filename = "storage/toollog";
        if (!file_exists($log_filename)) 
        {
            // create directory/folder uploads.
            mkdir($log_filename, 0777, true);
        }
        $datetimeobj = new DateTime();
        $date = $datetimeobj->format('Y-m-d');
        $log_file_data = $log_filename.'/log_' . $date . '.log';
        // if you don't add `FILE_APPEND`, the file will be erased each time you add a log
        file_put_contents($log_file_data, $log_msg . "\n", FILE_APPEND);
    }
}