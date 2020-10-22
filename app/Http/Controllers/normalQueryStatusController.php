<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\NormalQueries;

class normalQueryStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'queryID' => 'required',
            'userID' => 'required',
            'query' => 'required',
            'fromDate' => 'required',
            'toDate' => 'required',
            'status' => 'required',
            'module_type' => 'required',
            'hashtagID'=>'required',
            'mentionID'=>'required',
        ]);
        $statusObj = new NormalQueries([
            'queryID' => $request->input('queryID'),
            'userID' => $request->input('userID'),
            'query' => $request->input('query'),
            'fromDate' => $request->input('fromDate'),
            'toDate' => $request->input('toDate'),
            'status'=>$request->input('status'),
            'type'=>$request->input('module_type'),
            'hashtagID'=>$request->input('hashtagID'),
            'mentionID'=>$request->input('mentionID'),
        ]);
         $this->performCleanup($request->input('userID'));
        $statusObj->save();
        return response()->json(['data' => 'Submitted Successfully!'], 200);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $statusObj =  NormalQueries::where('userID', '=', $id)->get();
        return $statusObj;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $statusObj =  NormalQueries::where('queryID', '=', $id)->delete();
    }
    public function performCleanup($userID){
        $statusObj =  NormalQueries::where('userID', '=', $userID)->get();
        $count = $statusObj->count();
        if($count>7){
            $minObj =  NormalQueries::where('userID', '=', $userID)->min('queryID');
            $this->destroy($minObj);
        }
    }

}
