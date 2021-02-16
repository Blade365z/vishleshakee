<?php

namespace App\Http\Controllers;

use App\story;
use App\storyContent;
use Illuminate\Http\Request;

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
            $dirArr = [$userID, $projectID ,'plots'];
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
        $dir="storage/$userID/$projectID/plots/";
        $files=[];
        if (is_dir($dir)){
            if ($dh = opendir($dir)){
              while (($file = readdir($dh)) !== false){
                if($file!="." & $file!=".."){
                    array_push($files,$file);
                }
              }
              closedir($dh);
            }
          }
          return $files;
    }
}
