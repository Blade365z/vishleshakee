@extends('parent.app')
@section('content')

    <link rel="stylesheet" href="public/leaflet/markerCluster/MarkerCluster.css">
    <link rel="stylesheet" href="public/leaflet/leaflet.css">
    <link rel="stylesheet" href="public/leaflet/leaflet_modal.css">

 
    
   <div  class="text-center text-truncate mb-3" id="tweet-Heirarchy" >

   </div>

    <div id="errorMsgUA">

    </div>
    <div id="UAAnalysisDiv" style="">
    

        <div class="row mt-3">
            <div class="col-md-5">
                <div id="ua-leftDiv">
                    <div class="my-1 ">
                        <p class="smat-box-title-large m-0">Showing results for <span
                                class="smat-value font-weight-bold text-normal" id="showingResultsFor"> </span> </p>
                    </div>

                    
                    <div class="card shadow" id="userInfoDiv" style="margin-top: 80px;">
                        <div class="card-body">
                            @if (Auth::check() && Auth::user()->role == 1)
                                <div class="mt-1 d-flex w-100">
                                    
                                </div>
                            @endif
                            <div class="dFlexBut">
                                <div class="text-center">
                                    <img class="profilePicLarge" id="currentUAProfilePic" />
                                </div>
                                <div class="mt-2">
                                    <div>
                                        <span class="userNameLarge mx-2 mb-1 text-dark" id="currentUAUserName"> </span><span
                                            id="currentUAVerified"> </span>
                                    </div>
                                    <p class="userHandleLarge mx-2 mb-0 text-dark" id="currentUAUserHandle"></p>
                                </div>


                            </div>
                            <div class="mt-3 table-responsive-xl" id="uaTable">
                                <table class="table table-borderless" id="uaUserInfo">

                                    <tbody>
                                        <tr>
                                            <th class="py-0 px-3 text-dark" scope="row">User ID:</th>
                                            <td class="p-0 text-dark " id="userDetailsID"></td>

                                        </tr>
                                        <tr>
                                            <th class="py-0 px-3 text-dark " scope="row">Joined_On:</th>
                                            <td class="p-0 text-dark " id="userDetailsJOINEDON"> </td>

                                        </tr>
                                        <tr>
                                            <th class="py-0 px-3 text-dark" scope="row">Location:</th>
                                            <td class="p-0 text-dark " id="userDetailsLOCATION"></td>

                                        </tr>
                                        <tr>
                                            <th class="py-0 px-3 text-dark" scope="row">Bio:</th>
                                            <td class="p-0 text-dark " id="userDetailsBIO"></td>

                                        </tr>


                                        <tr>
                                            <th class="py-0 px-3 text-dark" scope="row">URL:</th>
                                            <td class="p-0 text-dark " id="userDetailsURL"> </td>

                                        </tr>
                                    </tbody>
                                </table>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class=" col-md-7" >
                <p class="smat-box-title-large m-0">Top Tweet of the User: </p>

                <div class="row"> 
                    
                    <div class="col-sm-4">
                        <div class="card card-body">
                            <h4 class="m-0">Re-Tweets: <span id= "retweetCount"> 0</span> </h4>
                        </div>   
                    </div>
                    <div class="col-sm-4">
                        <div class="card card-body">
                            <h4 class="m-0">Reply-Tweets: <span id= "replyCount"> 0</span> </h4>
                        </div>   
                    </div>
                    <div class="col-sm-4">
                        <div class="card card-body">
                            <h4 class="m-0">Quoted-Tweets: <span id= "quotedCount"> 0</span> </h4>
                        </div>   
                    </div>
                </div>
              
                <div  class="card card-body " id="topTweet" style="margin-top: 10px;height: 290px;width: 900px;"></div>

               
            </div>
        </div>


        <div class="row" style="
        
        margin: 10px;">
            <div class=" col-md-5" style="margin-left: -25px;">
                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li class="nav-item">
                      <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#hashtagWC" role="tab" aria-controls="pills-home" aria-selected="true">Hashtags</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" id="pills-profile-tab" data-toggle="pill" href="#mentionWC" role="tab" aria-controls="pills-profile" aria-selected="false">Mentions</a>
                    </li>
                  </ul>
                  <div class="tab-content" id="pills-tabContent">
                    <div class="card tab-pane fade show active" style="height: 460px" id="hashtagWC" role="tabpanel" aria-labelledby="pills-home-tab"></div>
                    <div class="card tab-pane fade"style="height: 460px" id="mentionWC" role="tabpanel" aria-labelledby="pills-profile-tab"></div>
                  </div>
            </div>
            <div class=" col-md-7" style="margin-left: 25px;">
                <div class="card card-body my-3" id="networkUserTweetDiv" style="height:500px; width:900px"></div>
             
            
            </div>
        </div>
    </div>
    <script>
        var incoming = @json($query ?? '');
        var tweetIdReceived = @json($tweet_id ?? '');
        var fromDateReceived = @json($from ?? '');
        var toDateReceived = @json($to ?? '');
        

    </script>

    <script type="module" src="public/amcharts4/core.js"></script>
    <script type="module" src="public/amcharts4/charts.js"></script>
    <script type="module" src="public/amcharts4/themes/animated.js"></script>
    <script type="module" src="public/tempJS/userAnalysis/networkUserAnalysis.js"></script>

    <script src="public/leaflet/leaflet.js"></script>
    <script src="public/leaflet/TileLayer.Grayscale.js"></script>
    <script src="public/leaflet/markerCluster/leaflet.markercluster-src.js"></script>
    <script src="public/leaflet/subgroup/leaflet.featuregroup.subgroup.js"></script>
@endsection
