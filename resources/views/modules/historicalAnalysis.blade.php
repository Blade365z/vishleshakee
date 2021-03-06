@extends('parent.app')
@section('content')

    <link rel="stylesheet" href="public/leaflet/markerCluster/MarkerCluster.css">
    <link rel="stylesheet" href="public/leaflet/markerCluster/MarkerCluster.Default.css">
    <link rel="stylesheet" href="public/leaflet/leaflet.css">
    <link rel="stylesheet" href="public/leaflet/leaflet_modal.css">

    <div class="smat-mainHeading ">
        Historical Analysis
        <h5><span class="float-right" id="selected_project_name_id"></span></h5>
    </div>
    <div class="mb-3">
        <form id="haQueryInputs">
            <div id="queryinputDivParent">
                <div id="queryInputDiv">
                    <div class="form-group   border smat-rounded d-flex px-2 py-1  bg-white" id="haQueryInputBox">
                        <input type="text" class="form-control typeahead " id="queryToken" placeholder="Query"
                            style="border:0px;" autocomplete="OFF" placeholder="Search a Hashtag or Mention"
                            style="border:0px;" data-container="body" data-trigger="focus"
                            data-html="true" data-toggle="popover" data-placement="right"
                            data-content="Query by :- <b>Hashtag</b> ( use'#',example: #COVID19 ) or <b> Mention</b> ( use'@',example: @narendramodi ) or <b> Keyword</b> ( use'*',example: *suicide )  "
                            required>
                    </div>
                </div>

                <div class="d-flex">
                    <div>
                        <button class="btn btn-neg smat-rounded mx-1 mt-2 " id="removeField" onclick="return false"
                            style="display:none;"> <i class="fa fa-minus" aria-hidden="true"></i></button>
                    </div>
                    <div>
                        <button class="btn btn-primary smat-rounded mx-1 mt-2 " id="addQueryButton"
                            onclick="return false"><i class="fa fa-plus" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
            <div id="haDateInput">
                <div class="form-group  dateinputForm my-0  mr-2  border smat-rounded d-flex px-2 py-1  bg-white">
                    <i class="far fa-calendar-alt mx-2 text-normal " style="margin-top:11px;"></i>
                    <input type="text" class="form-control datepicker-here  smat-from " id="fromDateHA"
                        placeholder="From Date" onkeydown="return false;" style="border:0px;" autocomplete="OFF"
                        data-language='en' required>
                </div>
                <div class="form-group dateinputForm my-0  mr-2 border smat-rounded d-flex px-2 py-1  bg-white">
                    <i class="far fa-calendar-alt mx-2 text-normal" style="margin-top:11px;"></i>
                    <input type="text" class="form-control datepicker-here  smat-to " id="toDateHA" placeholder="To Date"
                        onkeydown="return false;" style="border:0px;" autocomplete="OFF" data-language='en' required>
                </div>
                <button class="btn  smat-btn smat-rounded   mx-1" id="submit-btn" type="submit"> <span> <i class="fa fa-search" aria-hidden="true"></i>
                     <b>Search</b> </span>
                </button>
             
          
            </div>
        </form>
        <div class="mt-3"> 
            <span class="clickable   text-primary smat-rounded  mx-1" id="showTableBtn" onclick="return false"> <span> Show Search History  </span> </span>
                <span class="clickable   text-primary smat-rounded  mx-2"  id="helpBtnHA" onclick="return false"> <span>
                    Need help?
                </span> </span>
       
        </div>
    </div>

    <div class="my-3" id="searchTable" >
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col">
                        <div>
                            <p class="m-0 smat-box-title" id="recent_searches_word_id"> Recent Searches</p>
                        </div>
                        <div>
                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li class="nav-item active recentSearchTab ">
                                    <a class="nav-link smat-rounded active  " id="normalQueryTab" data-toggle="pill"
                                        href="#normalQueryContent" role="tab" aria-controls="pills-profile"
                                        aria-selected="true"> Normal Queries</a>
                                </li>
                                <li class="nav-item recentSearchTab ">
                                    <a class="nav-link smat-rounded " id="advQueryTab" data-toggle="pill"
                                        href="#advQueryContent" role="tab" aria-controls="mentionsContentUA"
                                        aria-selected="false"> Advance Queries</a>
                                </li>
                            


                            </ul>
                        </div>
                        <div class="tab-content UATopContent" id="pills-tabContent">

                            <div class="tab-pane fade  px-1 recentSearchTabContent active show" id="normalQueryContent"
                                role="tabpanel" aria-labelledby="normalQueryContent">
                                <div class="table-responsive ">
                                    <table class="table  table-bordered">
                                        <thead>
                                            <tr>
                                                <th class="py-1 px-3 text-dark " scope="col">Query</th>
                                              
                                                <th class="py-1 px-3 text-dark " scope="col"> Status</th>
                                                <th class="py-1 px-3 text-dark" scope="col"> Options</th>
                                            </tr>
                                        </thead>
                                        <tbody id="haNormalStatusTable">

                                        </tbody>
                                    </table>
                                    <div id="tableInitialTitle">

                                    </div>
                                </div>


                            </div>
                            <div class="tab-pane fade recentSearchTabContent  px-1  " id="advQueryContent" role="tabpanel"
                                aria-labelledby="advQueryContent">
                                <div class="table-responsive ">
                                    <table class="table  table-bordered">
                                        <thead>
                                            <tr>

                                                <th class="py-1 px-3 text-dark " scope="col">Query</th>
                                                <th class="py-1 px-3 text-dark " scope="col">From </th>
                                                <th class="py-1 px-3 text-dark " scope="col">To </th>
                                                <th class="py-1 px-3 text-dark " scope="col"> Status</th>
                                                <th class="py-1 px-3 text-dark" scope="col"> Options</th>
                                            </tr>
                                        </thead>
                                        <tbody id="haAdvStatusTable">

                                        </tbody>
                                    </table>
                                    <div id="tableInitialTitleAdv">

                                    </div>
                                </div>
                            </div>

            

                        </div>
                    </div>
                    {{-- <div class="col projContent" style="display: none;">
                        <div>
                            <p class="m-0 smat-box-title">Saved in <b class="projName"></b></p>
                        </div>
                        <p class="m-0  text-dark"> Recent Searches saved in project <b class="projName"></b></p>
                        <div class="table-responsive ">
                            <table class="table  table-bordered">
                                <thead>
                                    <tr>
                                        <th class="py-1 px-3 text-dark " scope="col">Query</th>
                                       
                                        <th class="py-1 px-3 text-dark " scope="col"> Status</th>
                        
                                        <th class="py-1 px-3 text-dark" scope="col"> Options</th>
                                    </tr>
                                </thead>
                                <tbody id="ProjectStatusTable">

                                </tbody>
                            </table>
                            <div id="tableInitialTitleProject">

                            </div>
                        </div>
                    </div> --}}
                </div>

            </div>
        </div>
    </div>





    <div class="my-4" id="analysisPanelHA" style="display:none;">
        <div class="d-flex">
            <div>
                <p class="smat-box-title-large mt-3 mb-0">Showing Results for <span
                        class="smat-value font-weight-bold text-normal" id="currentlySearchedQuery"> </span>

                </p>

            </div>
         
        </div>
        <div class="card shadow">
            <div class="card-body">
                <div class="d-flex">

                <div>

                    <ul class="nav nav-pills mb-3  mt-2" id="pills-tab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active smat-rounded" id="frqTabHA" data-toggle="pill" href="#freqContentHA"
                                role="tab" aria-controls="freqContentHA" aria-selected="true">Frequency</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link smat-rounded " id="sentiTabHA" data-toggle="pill" href="#sentiContentHA"
                                role="tab" aria-controls="pills-profile" aria-selected="false">Sentiment</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link smat-rounded " id="mentionsTabHA" data-toggle="pill"
                                href="#mentionsContentHA" role="tab" aria-controls="pills-contact" aria-selected="false">Top
                                Mention</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link smat-rounded " id="usersTabHA" data-toggle="pill" href="#usersContentHA"
                                role="tab" aria-controls="pills-contact" aria-selected="false">Top Active-Users</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link smat-rounded " id="hashtagsTabHA" data-toggle="pill"
                                href="#hashtagsContentTab" role="tab" aria-controls="pills-contact"
                                aria-selected="false">Top Hashtags</a>
                        </li>
                        {{-- <li class="nav-item">
                            <a class="nav-link smat-rounded" id="sensitivityTabHA" data-toggle="pill"
                                href="#sensitivityContentHA" role="tab" aria-controls="pills-contact"
                                aria-selected="false">Sensitivity</a>
                        </li> --}}
                        <li class="nav-item">
                            <a class="nav-link smat-rounded" id="locationTabHA" data-toggle="pill" href="#locationContentHA"
                                role="tab" aria-controls="pills-contact" aria-selected="false">Locations</a>
                        </li>
                    </ul>

                </div>
                <div class="ml-auto">
                    <button class="btn mx-1 smat-rounded my-2 px-4" id="save_analysis_project_id"> </button>
                </div>
            </div>
                <div class="tab-content" id="pills-tabContent">
                    <div class="" id="summaryContent-1">

                    </div>
                    <div class="tab-pane fade show active " id="freqContentHA" role="tabpanel"
                        aria-labelledby="freqContentHA"> </div>
                    <div class="tab-pane fade  " id="sentiContentHA" role="tabpanel" aria-labelledby="sentiContentHA">
                    </div>
                    <div class="tab-pane fade  barGraphTab" id="mentionsContentHA" role="tabpanel"
                        aria-labelledby="mentionsContentHA"></div>
                    <div class="tab-pane fade  barGraphTab" id="usersContentHA" role="tabpanel"
                        aria-labelledby="usersContentHA"></div>
                    <div class="tab-pane fade  barGraphTab " id="hashtagsContentTab" role="tabpanel"
                        aria-labelledby="hashtagsContentTab"></div>
                    <div class="tab-pane fade  " id="tweetsContentHA" role="tabpanel" aria-labelledby="tweetsContentHA">
                        tweetsContentHA </div>
                    <div class="tab-pane fade  " id="sensitivityContentHA" role="tabpanel"
                        aria-labelledby="sensitivityContentHA">sensitivityContentHA </div>
                    <div class="tab-pane fade  " id="locationContentHA" role="tabpanel" aria-labelledby="locationContentHA">
                    </div>

                </div>


            </div>
        </div>



    </div>
    <script>
        var incoming = @json($query ?? '');
        var fromDateReceived = @json($from ?? '');
        var toDateReceived = @json($to ?? '');

    </script>
    
    <script type="module" src="public/amcharts4/core.js"></script>
    <script type="module" src="public/amcharts4/charts.js"></script>
    <script type="module" src="public/amcharts4/themes/animated.js"></script>
    <script type="module" src="public/tempJS/historicalAnalysis/HistoricalAnalysis.js"></script>

    <script src="public/leaflet/leaflet.js"></script>
    <script src="public/leaflet/TileLayer.Grayscale.js"></script>
    <script src="public/leaflet/markerCluster/leaflet.markercluster-src.js"></script>
    <script src="public/leaflet/subgroup/leaflet.featuregroup.subgroup.js"></script>

@endsection
