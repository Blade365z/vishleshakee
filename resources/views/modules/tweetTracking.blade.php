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
            <div class="col-sm-6 ttContent">
                <div class="text-dark font-weight-bold mb-1"> <span class="badge badge-danger  p-1">Source tweet
                        information: </span></div>
                <div id="sourceInfo" style="display: none;">

                </div>
            </div>
            <div class="col-sm-6">
                <div class="text-dark font-weight-bold mb-1"> <span class="badge badge-primary  p-1">Current query: </span>
                </div>
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
                <div class="px-3 mb-4">
                    <div class="row px-3 " style="display:none;" id="networkDiv">
                        <div class="col-md-8 p-0">
                            <div class="border" id="track_net" style="height:650px;">

                            </div>
                        </div>
                        <div class="col-md-4 p-0 border">
                            <div>
                                <div class="text-dark" id="hoveredOnDiv" style="display:none;">Hovered on <span class="font-weight-bold " id="hoveredOnType"></span>
                                    by
                                    <span class="font-weight-bold " id="hoveredOnAuthor"> </span>
                                </div>
                                <div class="" style="height:400px;overflow-y:auto;overflow-x:hidden;"
                                    id="networkTrackTweetDiv">
                                </div>
                            </div>
                            <div class="px-3">
                                <div class="text-dark">The network contains</div>
                                <div class="d-flex ">
                                    <div>
                                        <h4 class="m-0 font-weight-bold text-dark" id="ttNodesCountNetwork">0</h4>
                                        <p class="m-0">Nodes </p>
                                    </div>
                                    <div class="mx-2">
                                        <h4 class="m-0 font-weight-bold text-dark" id="ttEdgesCountNetwork">0</h4>
                                        <p class="m-0">Edges </p>
                                    </div>
                                </div>
                            </div>
                            <div class="px-3 py-1">
                                <div>
                                    <h4 class="text-dark font-weight-bold">Notations</h4>
                                </div>
                                <div>
                                    <i class="fa fa-circle mr-1 " aria-hidden="true" style="color:#CF6ED2"title="Normal"></i> <span>Source
                                        Tweet</span>
                                </div>
                                <div>
                                    <i class="fa fa-circle  mr-1" aria-hidden="true" title="Normal"
                                        style="color:#ff704d"></i>
                                    <span>Quoted Tweet</span>
                                </div>
                                <div>
                                    <i class="fa fa-circle mr-1" aria-hidden="true" title="Normal"
                                        style="color:#00e600"></i>
                                    <span>Reply Tweet</span>
                                </div>
                                <div>
                                    <i class="fa fa-circle  mr-1" aria-hidden="true" title="Normal"
                                        style="color:#0099cc"></i>
                                    <span>Re-Tweet</span>
                                </div>
                                <div>
                                    <i class="fa fa-circle  mr-1" aria-hidden="true" title="Normal"
                                        style="color:yellow"></i>
                                    <span>Query Tweet</span>
                                </div>
                            </div>
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
