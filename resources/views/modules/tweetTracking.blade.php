@extends('parent.app')
@section('content')
    <link href="public/tempCSS/tracking.css" rel="stylesheet" />

    <link rel="stylesheet" href="public/leaflet/markerCluster/MarkerCluster.css">
    <link rel="stylesheet" href="public/leaflet/markerCluster/MarkerCluster.Default.css">
    <link rel="stylesheet" href="public/leaflet/leaflet.css">
    <link rel="stylesheet" href="public/leaflet/leaflet_modal.css">
    <link rel="stylesheet" href="public/leaflet/fullscreen/Control.FullScreen.css" />

    <div class="smat-mainHeading ">
        Tweet Tracking
    </div>
    <div class="mt-3 ">
        <div class="text-dark">Analysis for the tweet posted by <span class=" font-weight-bold" id="queryAuthor"> </span> on
            <span class=" font-weight-bold" id="dateQuery"></span>
        </div>


        <div class="row mt-3">
            {{-- <div class="col-sm-6 ttContent">
                <div class="text-dark font-weight-bold mb-1"> <span class="badge badge-danger  p-1">Source tweet
                        information: </span></div>
                <div id="sourceInfo" style="display: none;">

                </div>
            </div> --}}
            <div class="col-sm-6">
                {{-- <div class="text-dark font-weight-bold mb-1"> <span class="badge badge-primary  p-1">Current query: </span>
                </div> --}}
                <div id="mainQuery" style="display: none"></div>
            </div>
        </div>


        <div class="my-5 border">
            <div id="trackAnalysisMain" style="display: none">
            </div>
            <div class="ttContent networkContent"  id="networkContent">
                <div>
                    <h4 class="mx-3 my-0">Network for tweet posted by</h4>
                </div>
                

              
                <div class="d-flex mx-3 mb-1">
                    <div class="sourceProfPic">
                    </div>
                    <div class="sourceAuthor">
                    </div>
                </div>
                <div>
                    <button class="btn btn-primary  btn-block  mb-2"  id="generateNetwork">Click here to generate network</button>
                </div>
                <div class="" id="trackNetworkMsg">

                </div>
                <div class="px-3 mb-4" id="networkDivMainMain" >
                    <div id="tracking_network_option_id" style="display: none">
                        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li class="nav-item active recentSearchTab">
                                <a class="nav-link smat-rounded active  " id="TweetTypeNetworkTab" data-toggle="pill" href="#networkDivMain" role="tab" aria-controls="pills-profile" aria-selected="true"> Tweet type Network </a>
                            </li>
                            <li class="nav-item recentSearchTab">
                                <a class="nav-link smat-rounded " id="SentimentTweetNetwork" data-toggle="pill" href="#networkDivMain" role="tab" aria-controls="mentionsContentUA" aria-selected="false"> Sentiment Tweet Network </a>
                            </li>
                        </ul>
                    </div>
                    <div class="px-3 mb-4" id="networkDivMain" >

                    </div>
                </div>
            </div>
        </div>
    </div>


    <script type="module" src="public/amcharts4/core.js"></script>
    <script type="module" src="public/amcharts4/charts.js"></script>
    <script type="module" src="public/amcharts4/themes/animated.js"></script>
    <script src="public/leaflet/leaflet.js"></script>
    <script src="public/leaflet/TileLayer.Grayscale.js"></script>
    <script src="public/leaflet/markerCluster/leaflet.markercluster-src.js"></script>
    <script src="public/leaflet/subgroup/leaflet.featuregroup.subgroup.js"></script>

    <script>
        var tweetIDCaptured = @json($tweetID ?? '');

    </script>

    <script type="module" src="public/tempJS/tweetTracking/tweetTracking.js"></script>


    <script src="public/leaflet/fullscreen/Control.FullScreen.js"></script>

    <link href="public/tempCSS/vis.css" rel="stylesheet" />
    <script type="text/javascript" src="public/tempJS/networkAnalysis/vis.js"></script>

    <!-- Network Clustering js files -->
    <script type="text/javascript" src="public/tempJS/networkAnalysis/cluster/utils.js"></script>
    <script type="text/javascript" src="public/tempJS/networkAnalysis/cluster/convexhull.js"></script>
    <script type="text/javascript" src="public/tempJS/networkAnalysis/cluster/districts.js"></script>
    <script type="text/javascript" src="public/tempJS/networkAnalysis/cluster/draw.js"></script>
    <!-- END -->

@endsection
