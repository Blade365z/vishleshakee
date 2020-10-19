<?php

namespace App\Http\Controllers;

use App\Configure;
use App\CrawlerList;
use DateTime;
use Illuminate\Http\Request;

class ConfigureSmat extends Controller
{
    public function getConfigs()
    {
        // $configObj = new Config;
        $configData = $this->getConfig(1);
        return $configData;
    }

    public function insertConfig(Request $request)
    {
        try {
            $request->validate([
                'appUrl' => 'required',
                'dbUser' => 'required',
                'dbPass' => 'required',
                'dbNodes' => 'required',
                'dbKeyspace' => 'required',
                'dbPort' => 'required',
                'sparkEngine' => 'required',
            ]);
            if ($request->input('id')) {
                $id=$request->input('id');
                $configObj = Configure::where('id', $id)->update(array(
                    'appUrl' => $request->get('appUrl'),
                    'dbUser' => $request->get('dbUser'),
                    'dbPass' => $request->get('dbPass'),
                    'dbNodes' => $request->get('dbNodes'),
                    'dbKeyspace' => $request->get('dbKeyspace'),
                    'dbPort' => $request->get('dbPort'),
                    'sparkEngine' => $request->get('sparkEngine'),
                ));
                return response()->json(['data' => 'Updated Successfully!'], 200);
            } else {
                $configObj = new Configure([
                    'appUrl' => $request->get('appUrl'),
                    'dbUser' => $request->get('dbUser'),
                    'dbPass' => $request->get('dbPass'),
                    'dbNodes' => $request->get('dbNodes'),
                    'dbKeyspace' => $request->get('dbKeyspace'),
                    'dbPort' => $request->get('dbPort'),
                    'sparkEngine' => $request->get('sparkEngine'),
                ]);
                $configObj->save();
                return response()->json(['data' => 'Submitted Successfully!'], 200);
            }

        } catch (Exception $e) {
            return response()->json(['error' => 'Some Error Occured!'], 404);
        }
    }
    public function getConfig($id = null)
    {
        try {
            $configObj = Configure::where('id', '=', $id)->firstorFail();
            return $configObj;
        } catch (Exception $e) {
            return response()->json(['error' => 'Some Error Occured!'], 404);
        }
    }
    public function AddTrackToken(Request $request)
    {
        $request->validate([
            'trackToken' => 'required',
            'handle' => 'required',
            'type' => 'required',
            'status' => 'required',
        ]);
        $datetimeobj = new DateTime();
        $datetime = $datetimeobj->format('Y-m-d H:i:s');
        $date = date('Y-m-s', strtotime($datetime) - 0);

        $crawlerListObj = new CrawlerList([
            'track' => $request->get('trackToken'),
            'handle' => $request->get('handle'),
            'type' => $request->get('type'),
            'status' => $request->get('status'),
            'date' => $date,
        ]);
        $crawlerListObj->save();
        return response()->json(['data' => 'Submitted Successfully!'], 200);
    }
    public function GetAllTrackToken(Request $request)
    {
        $request->validate([
            'type' => 'required',
        ]);
        $type = $request->input('type');
        $crawlerListObj = CrawlerList::where('type', '=', $type)->get();
        return $crawlerListObj;
    }
    public function EditTrackToken()
    {

    }
    public function DeleteTrackToken(Request $request)
    {
        $request->validate([
            'id' => 'required',
        ]);
        $id = $request->input('id');
        $crawlerListObj = CrawlerList::where('id', $id)->delete();
        return response()->json(['data' => 'Status Deleted Updated!'], 200);
    }
    public function updateTrackWordStatus(Request $request)
    {
        if ($request->input('option') == 'status') {
            $request->validate([
                'id' => 'required',
                'status' => 'required',
            ]);
            $id = $request->input('id');
            $status = $request->input('status');
            $crawlerListObj = CrawlerList::where('id', $id)->update(array(
                'status' => $status,
            ));
            return response()->json(['data' => 'Status Successfully Updated!'], 200);
        } else if ($request->input('option') == 'trackWord') {
            $request->validate([
                'id' => 'required',
                'trackWord' => 'required',
            ]);
            $handle = $request->input('handle');
            $id = $request->input('id');
            $trackWord = $request->input('trackWord');
            $crawlerListObj = CrawlerList::where('id', $id)->update(array(
                'track' => $trackWord,
                'handle' => $handle,
            ));
            return response()->json(['data' => 'Status Successfully Updated!'], 200);
        }
    }

}
