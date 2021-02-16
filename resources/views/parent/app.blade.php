<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Vishleshakee-v2</title>
    <script src="public/js/app.js"></script>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="public/css/app.css" rel="stylesheet">
    <link href="public/datepicker/datepicker-min.css" rel="stylesheet">
    <link href="public/tempCSS/smat.css" rel="stylesheet">
    <link href="public/font-awesome/css/all.css" rel="stylesheet">
    <link href="public/jqueryUI/jquery-ui.min.css" rel="stylesheet">
    </style>
</head>

<body>


    <div class="container" id="main-wrapper">
        <div class="row " id="notificationNav">
          

        </div>

        @include("inc.navbar")
        @include("inc.projectNav")
        @include("inc.story")
        @include("inc.storyImage-modal")
        @include("inc.createProjectModal")
        @include("inc.selectProjectModal")
        @include('inc.publicTweets')
        @include('inc.helpHA')
        @include('inc.feedbackmodal')
        @include('inc.userSearchModal')
        @yield('content')
    </div>
    @include("inc.footer")
</body>


</html>

<script>
    
    var _MODE = null;
</script>
<script type="module" src="public/tempJS/MAIN.js"></script>
<script type="module" src="public/tempJS/project/commonFunctionsProject.js"></script>
<script  src="public/html2canvas/html2canvas-min.js"></script>
<script type="module" src="public/bootpag/bootpag-min.js"></script>
<script src="public/datepicker/datepicker-min.js"></script>
<script src="public/datepicker/datepicker-en.js"></script>
<script src="public/typeahead/typeahead.js"></script>
<script type="module" src="public/tagCloudJS/tagcloud.js"></script>
