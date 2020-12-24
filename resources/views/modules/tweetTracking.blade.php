@extends('parent.app')
@section('content')
    <link href="public/tempCSS/tracking.css" rel="stylesheet" />

    <link rel="stylesheet" href="public/leaflet/markerCluster/MarkerCluster.css">
    <link rel="stylesheet" href="public/leaflet/markerCluster/MarkerCluster.Default.css">
    <link rel="stylesheet" href="public/leaflet/leaflet.css">
    <link rel="stylesheet" href="public/leaflet/leaflet_modal.css">
 
    <div class="smat-mainHeading ">
        Tweet Tracking
    </div>
    <div class="mt-3 ">
    <div class="text-dark">Analysis for the tweet posted by <span class=" font-weight-bold" id="queryAuthor"> </span> on <span class=" font-weight-bold" id="dateQuery"></span></div>
        
    <div class="shadow p-4" id="mainQuery" style="display: none">
        </div>
    </div>


    <div class="my-2" id="trackAnalysisMain" style="display: none">

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

@endsection
