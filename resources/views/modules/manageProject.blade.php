@extends('parent.app')
@section('content')

    <link rel="stylesheet" href="public/leaflet/markerCluster/MarkerCluster.css">
    <link rel="stylesheet" href="public/leaflet/markerCluster/MarkerCluster.Default.css">
    <link rel="stylesheet" href="public/leaflet/leaflet.css">
    <link rel="stylesheet" href="public/leaflet/leaflet_modal.css">

    <link href="public/tempCSS/project.css" rel="stylesheet" />

    <div id="project-main">
        <h2 class="font-weight-bold project-name" id="project-name"></h2>
        <div>
            <p class="m-0"><span id="project-description"></span></p>
            <p class="m-0">Created on: <span id="project-created-date"></span></p>
            <p><i class="far fa-calendar-alt mr-1 text-dark "></i> Data from <span class="font-weight-bold" id="fromDate">
                </span> to <span class="font-weight-bold" id="toDate"></span></p>
        </div>

    </div>
    <div class="row">
        <div class="col-sm-12 card card-body my-1">
            <ul class="nav ">
                <li class="active"><a class="btn btn-light active smat-rounded " data-toggle="tab"
                        href="#project-stat-hashtags-tab">Hashtags</a></li>
                <li><a class="btn  btn-light mx-2 smat-rounded " data-toggle="tab"
                        href="#project-stat-mentions-tab">Mentions</a>
                </li>
                <li><a class="btn  btn-light mx-2 smat-rounded " data-toggle="tab"
                        href="#project-tweets-tab">Tweets</a>
                </li>
                <li><a class="btn  btn-light mx-2 smat-rounded" data-toggle="tab" href="#project-stat-users-tab">Users</a>
                </li>
                <li><a class="btn  btn-light mx-2 smat-rounded" id="locationProjectTab" data-toggle="tab"
                        href="#project-stat-locations-tab">Locations</a>
                </li>
                <li><a class="btn  btn-light mx-2 smat-rounded" data-toggle="tab" href="#project-stat-tweetStats"
                        id="tweet-stats-tab-btn">Tweet
                        Statistics</a>
                </li>
                <li><a class="btn  btn-light mx-2 smat-rounded" data-toggle="tab" href="#project-stories"
                        id="project-stories-btn">Stories</a>
                </li>


            </ul>

            <div class="tab-content mt-2">
                <div id="project-stat-hashtags-tab" class="tab-pane  active">
                    <div class="row">
                        <div class="col-sm-10">
                            <h2 class="mb-0 mt-2">Hashtags in <span class="project-name font-weight-bold"></span></h2>
                            <h5>Showing Top 200 Hashtags</h5>
                        </div>
                        <div class="col-sm-2">
                            <div class="ml-auto">
                                <h1 class="m-0 hashtag-count" style="font-size:2.8em;" id="">0</h1>
                                <h5 class="text-dark m-0">Hashtags</h5>
                            </div>
                        </div>
                    </div>
                    <div id="project-stat-hashtags" style="height:400px;">
                    </div>
                </div>
                <div id="project-stat-mentions-tab" class="tab-pane ">
                    <div class="row">
                        <div class="col-sm-10">
                            <h2 class="mb-0 mt-2">Mentions in <span class="project-name font-weight-bold"></span></h2>
                            <h5>Showing Top 200 Mentions</h5>
                        </div>
                        <div class="col-sm-2">
                            <div class="ml-auto">
                                <h1 class="m-0 mention-count" style="font-size:2.8em;" id="">0</h1>
                                <h5 class="text-dark m-0">Mentions</h5>
                            </div>
                        </div>
                    </div>
                    <div id="project-stat-mentions" style="height:400px;">
                    </div>
                </div>
                <div id="project-tweets-tab" class="tab-pane ">
                    <div class="col-sm-6 border offset-md-3 my-3">
                        <div class="d-flex  my-2">
                            <div class="mt-3">
                                <h2 class="m-0">Tweet Information</h2>
                            </div>
                            <div class="d-flex ml-auto pt-3">
                                <div class="pt-1 ml-auto ">
                                    <h5> Order tweets by </h5>
                                </div>
                                <div class="mx-1">
                                    <select class="p-2" name="choice" id="tweets-project-select">
                                        <option value="retweet" selected>Re-Tweets</option>
                                        <option value="QuotedTweet">Quoted Tweets</option>
                                        <option value="Reply">Reply Tweets</option>
                                    </select>
                                </div>
                            </div>
                        </div>
            
                        <div class="card card-body">
                            <div>
                                <h3 class="m-0" id="tweet-count-project-title">0</h3>
                                <h5 id="tweet-type-project-title"></h5>
                            </div>
                            <div id="tweets-project" style="height:400px">
            
                            </div>
                        </div>
                    </div>
                </div>
                <div id="project-stat-users-tab" style="height:400px;" class="tab-pane ">
                    <div class="row">
                        <div class="col-sm-10">
                            <h2 class="mb-0 mt-2">Users in <span class="project-name font-weight-bold"></span></h2>
                            <h5>Showing Top 200 User</h5>
                        </div>
                        <div class="col-sm-2">
                            <div class="ml-auto">
                                <h1 class="m-0 user-count" style="font-size:2.8em;" id="">0</h1>
                                <h5 class="text-dark m-0">Users</h5>
                            </div>
                        </div>
                    </div>
                    <div id="project-stat-users" style="height:400px;">
                    </div>
                </div>
                <div id="project-stat-locations-tab" class="tab-pane ">
                    <div class="row">
                        <div class="col-sm-10">
                            <h2 class="mb-0 mt-2">Locations in <span class="project-name font-weight-bold"></span></h2>
                            <h5>Showing Top 200 Locations</h5>
                        </div>
                        <div class="col-sm-2">
                            <div class="ml-auto">
                                <h1 class="m-0 location-count" style="font-size:2.8em;" id="">0</h1>
                                <h5 class="text-dark m-0">Locations</h5>
                            </div>
                        </div>
                    </div>
                    <div id="project-stat-locations" style="height:500px;">
                        //Map Comes Here
                    </div>
                </div>
                <div id="project-stat-tweetStats" style="min-height:300px" class="tab-pane ">
                    <div class="row">
                        <div class="col-sm-9" style="">
                                <div id="tweetStatsChart" style="min-height:300px">

                                </div>
                              
                        </div>
                        <div class="col-sm-3">
                            <div class="m-2">
                                <h3 class="m-0  " style="font-size:2em;" id="totalTweets">0</h3>
                                <h6 class="text-dark m-0">Number Of Tweets</h6>
                            </div>
                            <div class="m-2">
                                <h3 class="m-0   hashtag-count" style="font-size:2em;" id="">0</h3>
                                <h6 class="text-dark m-0">Number Of Hashtags</h6>
                            </div>
                            <div class="m-2">
                                <h1 class="m-0 mention-count" style="font-size:2em;" id="">0</h1>
                                <h6 class="text-dark m-0">Number Of Mentions</h6>
                            </div>
                            <div class="m-2">
                                <h1 class="m-0   user-count" style="font-size:2em;" id="">0</h1>
                                <h6 class="text-dark m-0">Number Of Users</h6>
                            </div>
                            <div class="m-2">
                                <h1 class="m-0   location-count" style="font-size:2em;" id="">0</h1>
                                <h6 class="text-dark m-0">Number Of Locations</h6>
                            </div>

                        </div>
                       
                    </div>
                    <div class="row">
                        <div class="col-sm-3">
                            <div>
                                <table class="table border ">
                                    <thead>
                                        <tr>
                                            <th  scope="col">Tweets</th>
                                            <th  scope="col">Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Positive</td>
                                            <td  id="pos">0</td>
                                        </tr>
                                        <tr>
                                            <td >Negative</td>
                                            <td  id="neg">0</td>
                                        </tr>
                                        <tr>
                                            <td >Neutral</td>
                                            <td  id="neu">0</td>
                                        </tr>
                                                      
                                    </tbody>
                                </table>

                            </div>

                        </div>
                        <div class="col-sm-3">
                            <div>
                                <table class="table border ">
                                    <thead>
                                        <tr>
                                            <th  scope="col">Communal Tweets</th>
                                            <th  scope="col">Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                            <td >Communal & Positive</td>
                                            <td id="com-pos">0</td>
                                        </tr>
                                        <tr>
                                            <td >Communal & Negative</td>
                                            <td  id="com-neg">0</td>
                                        </tr>
                                        <tr>
                                            <td>Communal & Neutral</td>
                                            <td id="com-neu">0</td>
                                        </tr>
                                   
                                    </tbody>
                                </table>

                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div>
                                <table class="table border ">
                                    <thead>
                                        <tr>
                                            <th  scope="col">Security Tweets</th>
                                            <th  scope="col">Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                                                                           
                                        <tr>
                                            <td>Security & Positive</td>
                                            <td  id="sec-pos">0</td>
                                        </tr>
                                        <tr>
                                            <td >Security & Negative</td>
                                            <td  id="sec-neg">0</td>
                                        </tr>
                                        <tr>
                                            <td >Security & Neutral</td>
                                            <td  id="sec-neu">0</td>
                                        </tr>
                                    

                                    </tbody>
                                </table>

                            </div>


                        </div>
                        <div class="col-sm-3">

                            <div>
                                <table class="table border ">
                                    <thead>
                                        <tr>
                                            <th  scope="col">Communal & Security Tweets</th>
                                            <th  scope="col">Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                  <tr>
                                            <td >Communal & Security & Positive</td>
                                            <td  id="comSecCount-pos">0</td>
                                        </tr>
                                        <tr>
                                            <td>Communal & Security & Negative</td>
                                            <td  id="comSecCount-neg">0</td>
                                        </tr>
                                        <tr>
                                            <td >Communal & Security & Neutral</td>
                                            <td  id="comSecCount-neu">0</td>
                                        </tr>

                                    </tbody>
                                </table>

                            </div>
                        </div>
                </div>
                    <div class="row mt-2">
                        <div class="col-sm-12">
                            <div>
                                <ul class="nav ">
                                    <li class="active"><a class="btn btn-light active smat-rounded " data-toggle="tab"
                                            href="#project-stat-tweet-frequency-tab">Tweet Frequency Distributon</a></li>
                                    <li><a class="btn  btn-light mx-2 smat-rounded " data-toggle="tab"
                                            href="#project-stat-tweet-sentiment-tab"
                                            id="tweet-stats-sentiment-tab-btn">Tweet Sentiment Distribution</a>
                                    </li>
                                </ul>

                                <div class="tab-content mt-2">
                                    <div class="tab-pane  active" id="project-stat-tweet-frequency-tab">
                                        <div class="d-flex">
                                            <div id="project-stat-tweet-frequency-chart"
                                                style="min-height:500px;width:100%;"></div>
                                            <div class="border"
                                               style="display:none;">
                                                <div class="ml-auto closeTweets" title="close">close <i class="fas fa-times"></i> </div>

                                                    <div  id="project-stat-tweet-frequency-chart-tweets"  style="min-height:500px">

                                                    </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div id="project-stat-tweet-sentiment-tab" class="tab-pane" style="min-height:500px;">
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div id="project-stories" style="min-height:300px" class="tab-pane ">
                    <div class="mt-3">
                        <h2 class="m-0">Stories</h2>
                        <div class="row">
                            {{-- <div class="col-sm-5 my-1 p-0">
                                <div class="input-group mt-1 mx-3">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text"><i class="fa fa-search " aria-hidden="true"></i></div>
                                    </div>
                                    <input type="text" class="form-control border" id="searchStoryInput" placeholder="Search Story">
                                </div>
                            </div> --}}
                            <div class="col-sm-3 ">
                                <div class="mx-0 ">
                                    <button class="btn ml-auto btn-primary my-2 createStoryBtn">+ Create Story</button>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-2 py-2 px-3" id="storyCards">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {{-- <div class="row mt-2">
        <div class="col-sm-3">
            <div class="card card-body">
                <div>
                    <h1 class="m-0 " style="font-size:3.5em;" id="totalTweets">0</h1>
                </div>
                <div>
                    <h5>Tweets</h5>
                </div>
                <div>
                    <table class="table table-borderless">
                        <thead>
                            <tr>
                                <th class="p-0" scope="col">Category/Sentiment</th>
                                <th class="p-0" scope="col">Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="p-0">Positive</td>
                                <td class="p-0" id="pos">0</td>
                            </tr>
                            <tr>
                                <td class="p-0">Negative</td>
                                <td class="p-0" id="neg">0</td>
                            </tr>
                            <tr>
                                <td class="p-0">Neutral</td>
                                <td class="p-0" id="neu">0</td>
                            </tr>
                            <tr>
                                <td class="p-0">Communal & Positive</td>
                                <td class="p-0" id="com-pos">0</td>
                            </tr>
                            <tr>
                                <td class="p-0">Communal & Negative</td>
                                <td class="p-0" id="com-neg">0</td>
                            </tr>
                            <tr>
                                <td class="p-0">Communal & Neutral</td>
                                <td class="p-0" id="com-neu">0</td>
                            </tr>
                            <tr>
                                <td class="p-0">Security & Positive</td>
                                <td class="p-0" id="sec-pos">0</td>
                            </tr>
                            <tr>
                                <td class="p-0">Security & Negative</td>
                                <td class="p-0" id="sec-neg">0</td>
                            </tr>
                            <tr>
                                <td class="p-0">Security & Neutral</td>
                                <td class="p-0" id="sec-neu">0</td>
                            </tr>
                            <tr>
                                <td class="p-0" >Communal & Security & Positive</td>
                                <td  class="p-0" id="comSecCount-pos">0</td>
                            </tr>
                            <tr>
                                <td class="p-0" >Communal & Security & Negative</td>
                                <td  class="p-0" id="comSecCount-neg">0</td>
                            </tr>
                            <tr>
                                <td class="p-0" >Communal & Security & Neutral</td>
                                <td  class="p-0" id="comSecCount-neu">0</td>
                            </tr>

                        </tbody>
                    </table>

                </div>

            </div>
        </div>
        <div class="col-sm-2">
            <div class="card card-body">
                <div>
                    <h1 class="m-0 " style="font-size:2.8em;" id="hashtag-count">0</h1>
                    <h5 class="text-dark m-0">Hashtags</h5>
                </div>
                
            </div>
            <div class="card card-body mt-4">
                <div>
                    <h1 class="m-0 " style="font-size:2.2em;" id="user-count">0</h1>
                    <h5 class="text-muted">Users</h5>
                </div>
            </div>
            <div class="card card-body mt-4">
                <div>
                    <h1 class="m-0 " style="font-size:2.2em;" id="mention-count">0</h1>
                    <h5 class="text-muted">Mentions</h5>
                </div>
            </div>
        </div>
        <div class="col-sm-2">
            <div class="card card-body">
                <div>
                    <h1 class="m-0 " style="font-size:2.2em;" id="keyword-count">0</h1>
                    <h5 class="text-muted">Keywords</h5>
                </div>

            </div>
            <div class="card card-body mt-4">
                <div>
                    <h1 class="m-0 " style="font-size:2.2em;" id="location-count">0</h1>
                    <h5 class="text-muted">Locations</h5>
                </div>
            </div>
        </div>
      
        <div class="col-sm-5">
            <div class="card card-body">

                <div class="d-flex">
                    <div>
                        <h1 class="m-0" style="font-size:2.8em;">Stories</h1>
                        <h6 class="text-muted">Stories created under <span class="project-name font-weight-bold"></span></h6>
                    </div>
                    <div class="ml-auto">
                        <button class="btn ml-auto btn-primary my-2 smat-rounded createStoryBtn">+ Create Story</button>
                    </div>
                </div>

                <div class="mb-3" id="storiesList " style="height:300px;overflow-y:auto;">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Story Name</th>
                                <th scope="col">Options</th>
                            </tr>
                        </thead>
                        <tbody id="storyTableBody">
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

    </div> --}}
    <div class="row">
        
      
        <div class="col-sm-6">
        
        </div>
    </div>
    <script>
        var projectID = @json($projectID ?? '');

    </script>
    <script type="module" src="public/amcharts4/core.js"></script>
    <script type="module" src="public/amcharts4/charts.js"></script>
    <script type="module" src="public/amcharts4/themes/animated.js"></script>
    <script type="module" src="public/amcharts4/plugins/wordCloud.js"></script>

    <script type="module" src="public/tempJS/project/manageProject.js"></script>

    <script src="public/leaflet/leaflet.js"></script>
    <script src="public/leaflet/TileLayer.Grayscale.js"></script>
    <script src="public/leaflet/markerCluster/leaflet.markercluster-src.js"></script>
    <script src="public/leaflet/subgroup/leaflet.featuregroup.subgroup.js"></script>


@endsection
