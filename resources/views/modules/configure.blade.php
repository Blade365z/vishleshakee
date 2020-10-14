@extends('parent.app')
@section('content')
@include('inc.configModals.addNodeModal')
@include('inc.configModals.editNode')
@include('inc.configModals.addKeySpace')
@include('inc.configModals.addTrackWordsModal')
@include('inc.configModals.editCrawlListModal')
    <div class="row">
        <div class="col-md-7 offset-md-3">
            <div class="smat-mainHeading ">
                Vishleshakee Config
            </div>
            <div class="card shadow">
                <div class="card-body">
                    <div>

                        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                            {{-- <li class="nav-item">
                                <a class="nav-link active smat-rounded" id="sysstatsTab" data-toggle="pill"
                                    href="#sysStatsConent" role="tab" aria-controls="sysStatsConent"
                                    aria-selected="true">System Status</a>
                            </li> --}}
                            <li class="nav-item">
                                <a class="nav-link active smat-rounded " id="crawlerConfTab" data-toggle="pill"
                                    href="#crawlerConfContent" role="tab" aria-controls="pills-profile"
                                    aria-selected="false">Crawler List</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link smat-rounded " id="sysEnvTab" data-toggle="pill" href="#sysEnvContent"
                                    role="tab" aria-controls="pills-contact" aria-selected="false">Configure Environment</a>
                            </li>

                        </ul>

                    </div>
                    <div class="tab-content" id="pills-tabContent">

                        <div class="tab-pane fade   " id="sysStatsConent" role="tabpanel" aria-labelledby="sysStatsConent">
                            sysStatsConent </div>
                        <div class="tab-pane fade   active show " id="crawlerConfContent" role="tabpanel"
                            aria-labelledby="crawlerConfContent">
                            <div class="d-flex">
                                <div>
                                    <button class="btn btn-primary smat-rounded mx-1  " id="addTrackWordBtn"
                                        onclick="return false"><i class="fa fa-plus" aria-hidden="true"></i></button>
                                </div>

                                <div class="form-check mx-3 pt-2">
                                    <input class="form-check-input crawlListRadio" type="radio" id="hashtagRadioCrawlList" value="track" source="hashtag" checked>
                                    <label class="form-check-label" for="hashtagRadioCrawlList">
                                        Hashtags
                                    </label>
                                </div>
                                <div class="form-check mx-3 pt-2">
                                    <input class="form-check-input crawlListRadio " type="radio" id="keywordRadioCrawlList" value="track" source="keyword"  >
                                    <label class="form-check-label" for="keywordRadioCrawlList">
                                        Keywords
                                    </label>
                                </div>
                                <div class="form-check mx-3 pt-2">
                                    <input class="form-check-input crawlListRadio" type="radio" id="userRadioCrawlList" value="user" source="user" >
                                    <label class="form-check-label" for="userRadioCrawlList">
                                        Users
                                    </label>
                                </div>
                            </div>
                            <div class="mt-2">
                                <table class="table border">
                                    <thead>
                                        <tr>
                                            <th scope="col">id</th>
                                            <th scope="col">Input</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Options</th>
                                            <th scope="col">More</th>
                                        </tr>
                                    </thead>
                                    <tbody id="crawlerList">

                                    </tbody>
                                </table>

                            </div>
                        </div>
                        <div class="tab-pane fade  " id="sysEnvContent" role="tabpanel" aria-labelledby="sysEnvContent">
                            <form id="envConfForm">
                            <div class="row">
                                
                                <div class="col-sm-5">

                                   
                                        <p class="mb-1 smat-dash-title text-muted">Application Info</p>
                                        <div class="form-group">
                                            <input type="text" class="form-control smat-rounded mt-2" id="appUrlInput"
                                                 placeholder="App URL">
                                        </div>
                                        <p class="mb-1 smat-dash-title text-muted mt-4">Database Credentials</p>
                                        <div class="form-group">

                                            <input type="text" class="form-control smat-rounded" id="dbUserInput"
                                                 placeholder="Enter Database User">
                                        </div>
                                        <div class="form-group">
                                            <input type="password" class="form-control smat-rounded "
                                                id="dbPassInput" placeholder="Password">
                                        </div>

                                        <div > 
                                            <p class="mb-1 smat-dash-title text-muted">Present Keyspaces</p>
                                            <button class="btn btn-primary btn-sm smat-rounded ml-auto" id="addKeySpaceBtn" onclick="return false">+ Add Keyspace</button>
                                        </div>
                                        <div class="mt-2" id="configKeyspaces">
                                          
    
                                        </div>  


                                          
                                 
                                    
                                </div>
                                <div class="col-sm-7">
                                        <div > 
                                            <p class="mb-1 smat-dash-title text-muted">Present nodes in the cluster</p>
                                            <button class="btn btn-primary btn-sm smat-rounded ml-auto" id="addNodeBtn" onclick="return false" >+ Add Node</button>
                                        </div>
                                        <div class="mt-2">
                                            <table class="table table-bordered">
                                                <thead>
                                                  <tr>
                                                    <th scope="col">Node</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Options</th>
                                                  </tr>
                                                </thead>
                                                <tbody id="dbNodesRecord">
                                              
                                
                                                </tbody>
                                              </table>


                                        </div>
                                          
                                        <div class="d-flex mt-5">
                                            <button class="btn btn-primary smat-rounded ml-auto" type="submit"  >Save Changes</button>
                                            <button  class="btn btn-danger smat-rounded mx-2" onclick="return false" >Reset</button>
                                                </div>
                                   
                                </div>
                            </div>

     </form>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    </div>
    <script type="module" src="public/tempJS/config/configureSmat.js" ></script>
    @endsection
