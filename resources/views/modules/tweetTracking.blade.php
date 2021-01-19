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
            <div class="col-sm-6">
                <div class="text-dark font-weight-bold mb-1"> <span class="badge badge-danger  p-1">Source tweet information: </span></div>
                <div  id="sourceInfo" style="display: none;" >
                    
                </div>
            </div>
            <div class="col-sm-6">
                <div class="text-dark font-weight-bold mb-1"> <span class="badge badge-primary  p-1">Current query: </span></div>
                <div  id="mainQuery" style="display: none"></div>
            </div>
        </div>


        <div class="my-5 border" id="trackAnalysisMain" style="display: none">

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

    @endsection
