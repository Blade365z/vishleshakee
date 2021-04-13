<?php

namespace App\Http\Controllers;

use App\story;
use App\storyContent;
use Illuminate\Http\Request;
use DateTime;
class storyController extends Controller
{
    public function uploadStoryContent(Request $request)
    {
        try {
            // $storyID = $request->input('storyID');
            // $storyName = $request->input('storyName');
            // $analysisName = $request->input('analysisName');
            // $analysisDesc = $request->input('analysisDesc');
            $analysisID = uniqid();
            $userID = $request->input('userID');
            $projectID = $request->input('projectID');
            $dirArr = [$userID, $projectID, 'plots'];
            $dirString = 'storage';
            foreach ($dirArr as $dir) {
                $dirString = $dirString . '/' . $dir;
                if (!file_exists($dirString)) {
                    mkdir($dirString, 0777);
                }
            }

            // if (!file_exists("storage/$userID/plots/$projectID")) {
            //     mkdir("storage/$userID/plots/$projectID");
            // }
            $image = $request->input('image');
            $location = "storage/$userID/$projectID/plots/";
            $image_parts = explode(";base64,", $image);
            $image_base64 = base64_decode($image_parts[1]);
            $filename = $analysisID . '-plot.png';
            $file = $location . $filename;
            file_put_contents($file, $image_base64);
            // $statusObj = new storyContent([
            //     'storyID' => $storyID,
            //     'storyName' => $storyName,
            //     'analysisID' => $analysisID,
            //     'analysisName' => $analysisName,
            //     'analysisDescription' => $analysisDesc,
            // ]);
            // $statusObj->save();
            return response()->json(['data' => 'Uploaded successfully!'], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Some error occured'], 404);
        }
    }
    public function createNewStory(Request $request)
    {
        $request->validate([
            'projectID' => 'required',
            'storyName' => 'required',
            'storyDescription' => 'required',
            'createdOn' => 'required',
        ]);
        // checkIfStoryExists($request->input('projectID',$request->input('storyName'))
        $statusObj = new story([
            'storyID' => $request->input('storyName') . '-' . $request->input('projectID'),
            'projectID' => $request->input('projectID'),
            'storyName' => $request->input('storyName'),
            'storyDescription' => $request->input('storyDescription'),
            'createdOn' => $request->input('createdOn'),
        ]);
        $statusObj->save();
        return response()->json(['data' => 'Story created successfully!'], 200);
    }
    public function checkIfStoryExists($projectID, $storyName)
    {
        $statusObj = story::where([['projectID', '=', $projectID], ['storyName', '=', $storyName]])->first();
        if ($statusObj) {
            return 1;
        } else {
            return 0;
        }
    }
    public function getAllStoryUnderProject($projectID)
    {
        $statusObj = story::where('projectID', '=', $projectID)->get();
        return $statusObj;
    }
    public function getStoryInfo($storyID)
    {
        $statusObj = story::where('storyID', '=', $storyID)->get();
        return $statusObj;
    }
    public function getAllAnalysisUnderStory($storyID)
    {
        $statusObj = storyContent::where('storyID', '=', $storyID)->get();
        return $statusObj;
    }
    public function getBaseUrl()
    {
        echo url('');
    }
    public function updateStoryAnalysis(Request $request)
    {
        $request->validate([
            'id' => 'required',
        ]);
        try {
            $crawlerListObj = storyContent::where('analysisID', $request->input('id'))->update(array(
                'analysisName' => $request->input('name'),
                'analysisDescription' => $request->input('desc'),
            ));
            $statusObj = storyContent::where('analysisID', '=', $request->input('id'))->get();
            return response()->json(array('status' => 'Updated Successfully!', 'data' => $statusObj), 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Some error occured!'], 404);
        }
    }

    public function ReadPlotsFromDir(Request $request)
    {
        $userID = $request->input('userID');
        $projectID = $request->input('projectID');
        $dir = "storage/$userID/$projectID/plots/";
        $files = [];
        if (is_dir($dir)) {
            if ($dh = opendir($dir)) {
                while (($file = readdir($dh)) !== false) {
                    if ($file != "." & $file != "..") {
                        array_push($files, $file);
                    }
                }
                closedir($dh);
            }
        }
        return $files;
    }
    public function SaveStoryElementsJSON(Request $request)
    {
        // projectID, StoryName, StoryObj
        $request->validate([
            'projectID' => 'required',
            'StoryName' => 'required',
            'StoryObj' => 'required',
            'userID' => 'required',
        ]);
        $userID = $request->input('userID');
        $projectID = $request->input('projectID');
        $storyName = $request->input('StoryName');
        $elemntObj = $request->input('StoryObj');
        $storyDescription = $request->input('storyDescription');
        $json_data = json_encode($elemntObj);
        if($request->input('key')){
            $key = $request->input('key');

        }else{
            $key =   substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'),1,7).'smat'.$userID;
 
        }
        try {
            $this->saveStoryInfoToDB($projectID,$storyName,$storyDescription,$key);

            $filePath = "storage/$userID/$projectID/$key.json";
            file_put_contents($filePath, $json_data);
            return response()->json(array('status' => 'Updated Successfully!','key'=>$key), 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Some error occured!'], 404);
        }
    }
    public function readStories(Request $request)
    {
        $userID = $request->input('userID');
        $projectID = $request->input('projectID');
        $files = story::where('projectID', '=', $projectID)->get();
        return $files;
    }
    public function getStoryData(Request $request)
    {
        $request->validate([
            'projectID' => 'required',
            'filename' => 'required',
            'userID' => 'required',
        ]);
        $userID = $request->input('userID');
        $projectID = $request->input('projectID');
        $storyName = $request->input('filename');
        try {
            $filepath = "storage/$userID/$projectID/$storyName.json";
            $str = file_get_contents($filepath);
            $json = json_decode($str, true);
            return $json;
        } catch (Exception $e) {
            return response()->json(['error' => 'Some error occured!'], 404);
        }
    }
    public function readStoryStatsForShow(Request $request)
    {
        //lambda function
        $mapping = function ($str){
            $arr = str_getcsv($str);    
            if($arr[0] != 'token_name' and $arr[0]){
                $cat_list = json_decode($arr[1]);
                $cat_count_list = json_decode($arr[2]);
                $max_index=array_keys($cat_count_list, max($cat_count_list))[0];
                return array($arr[0], $arr[3], $this->get_category_tag($cat_list[$max_index]));
            }
        };
        $request->validate([
            'projectID' => 'required',
            'userID' => 'required',
        ]);
        try {
            $userID = $request->input('userID');
            $projectID = $request->input('projectID');
            $type = $request->input('type');
            if ($type === 'hashtag') {
                $filePath = "storage/$userID/$projectID/statistics/hashtag_count_500.csv";
            } else if ($type === 'mention') {
                $filePath = "storage/$userID/$projectID/statistics/mention_count_500.csv";
            } else if ($type === 'user') {
                $filePath = "storage/$userID/$projectID/statistics/user_count_500.csv";
            } else if ($type === 'location') {
                $filePath = "storage/$userID/$projectID/statistics/location_count_500.csv";
            }

            $str = file_get_contents($filePath);
            // $array = array_map("str_getcsv", explode("\n", $str));
            $array = array_map($mapping, explode("\n", $str));
            $array = array_slice($array, 1, sizeof($array)-2);
            $json = json_encode($array);
            return $json;
        } catch (Exception $e) {
            return response()->json(['error' => 'Some error occured!'], 404);
        }
    }

    public function get_category_tag($cat){
        $str_cat = strval($cat);
        $slen = strlen($str_cat);
        if($slen == 1)
            return 'normal';
        else if($slen == 2)
            return 'com';
        else if($slen == 3){
            if($str_cat[1] == 0)
                return 'sec';
            else
                return 'com_sec';
        }
    }

    public function readTokenCountProject(Request $request)
    {
        $request->validate([
            'projectID' => 'required',
            'userID' => 'required',
            'type' => 'required',
        ]);
        try {
            $userID = $request->input('userID');
            $projectID = $request->input('projectID');
            $type = $request->input('type');
            if ($type == 'token') {
                $filePath = "storage/$userID/$projectID/statistics/aggregate_count.json";
                $str = file_get_contents($filePath);
                $json = json_decode($str, true);
                return $json['data'];
            } else if ($type == 'tweet') {
                $filePath = "storage/$userID/$projectID/statistics/total_tweet_count_category_wise_statistics.json";
                $str = file_get_contents($filePath);
                $json = json_decode($str, true);
                return $json['data'];
            }
        } catch (Exception $e) {
            return response()->json(['error' => 'Some error occured!'], 404);
        }
    }

    public function saveStoryInfoToDB($projectID, $storyName, $storyDescription,$key)
    {
        $storyObj = new story;
        $statusObj = story::where([['storyName', '=', $storyName], ['projectID', '=', $projectID]])->first();
        if($statusObj){
            $statusObj = story::where('storyID','=',$key)->update(array(
                'storyName' => $storyName,'storyDescription'=>$storyDescription));
        }else{
            $datetime = new DateTime();
            $statusObj = new story([
                'storyID' => $key,
                'projectID' => $projectID,
                'storyName' => $storyName,
                'storyDescription' => $storyDescription,
                'createdOn' =>  $datetime->format('Y-m-d H:i:s')
            ]);
            $statusObj->save();
        }
    }

}
