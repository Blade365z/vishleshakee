@extends('parent.app')
@section('content')
    <link href="public/tempCSS/tracking.css" rel="stylesheet" />

    <div class="smat-mainHeading ">
        Tweet Tracking
    </div>



    <div id="trackAnalysisMain">

    </div>
    <script type="module" src="public/amcharts4/core.js"></script>
    <script type="module" src="public/amcharts4/charts.js"></script>
    <script type="module" src="public/amcharts4/themes/animated.js"></script>
    <script>
        var tweetIDCaptured = @json($tweetID ?? '');

    </script>

    <script type="module" src="public/tempJS/tweetTracking/tweetTracking.js"></script>

@endsection
