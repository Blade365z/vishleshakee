@extends('parent.app')
@section('content')
    <link href="public/tempCSS/project.css" rel="stylesheet" />
    <link href="public/tempCSS/story.css" rel="stylesheet" />


    <div class="row">
        {{-- <div class="col-sm-5 ">
         

        </div> --}}
        <div class="col-sm-8">
            <div>
                <button class="btn btn-primary smat-rounded" id="openProjectFormBtn">+ Click here to create a new
                    project</button>
            </div>
            <div class="confirmPanelCollapse" id="projectCreationForm">
                <div class="smat-mainHeading ">
                    Create a new project
                </div>
                <div class="card card-body">

                    <div class=" d-flex" id="closeCreateProjectDiv" title="close"><span class="ml-auto"
                            style="cursor:pointer">close <i class="fas fa-times "></i></span> </div>

                    <form id="projCreateForm">
                        <div class="text-dark">
                            <h5>Name of the project</h5>
                        </div>
                        <div class="dFlexBut mb-3">
                            <div class="form-group  text-normal  border smat-rounded d-flex  mr-2 px-2 py-1 bg-white mb-0"
                                id="">
                                <input type="text" class="form-control projField " name="query" id="projectName"
                                    placeholder="Type a project name" style="border:0px;" value="sars_2020"
                                    autocomplete="OFF" required>
                            </div>


                        </div>
                        <div class="text-danger pull-text-top" id="ifProjectNameAlreadyExits">
                        </div>
                        <div class="text-dark">
                            <h5>Duration</h5>
                        </div>
                        <div class="dFlexBut mb-3" style="width:60%;">
                            <div
                                class="form-group  dateinputForm my-0  mr-2  border smat-rounded d-flex px-2 py-1  bg-white w-100">
                                <i class="far fa-calendar-alt mx-2 text-normal " style="margin-top:11px;"></i>
                                <input type="text" class="form-control datepicker-here  projField smat-from "
                                    id="fromDateProj" placeholder="From Date" onkeydown="return false;" style="border:0px;"
                                    autocomplete="OFF" data-language='en' value="2020-12-01" required>
                            </div>
                            <div
                                class="form-group dateinputForm my-0  mr-2 border smat-rounded d-flex px-2 py-1  bg-white w-100">
                                <i class="far fa-calendar-alt mx-2 text-normal" style="margin-top:11px;"></i>
                                <input type="text" class="form-control datepicker-here  projField  smat-to " id="toDateProj"
                                    placeholder="To Date" onkeydown="return false;" style="border:0px;" autocomplete="OFF"
                                    data-language='en' value="2020-12-31" required>
                            </div>


                        </div>
                        <div class="text-dark">
                            <h5 class="m-0">Add keywords in project <span class="projectName"></span> </h5>
                            <small class="text-mute">Please add atleast one hashtag/keyword</small>
                        </div>
                        <div class="dFlexBut mb-2">
                            <div class="form-group  text-normal  border smat-rounded d-flex  mr-2 px-2 py-1  bg-white mb-0"
                                id="">
                                <input type="text" class="form-control " name="" id="projectTagInput"
                                    placeholder="Type a hashtag/keyword" style="border:0px;" autocomplete="OFF"
                                    data-container="body" data-trigger="focus" data-html="true" data-toggle="popover"
                                    value="#covid19" data-placement="top"
                                    data-content="Query by :- <b>Hashtag</b> ( use'#',example: #COVID19 ) or <b> Keyword</b> ( use '*',example: *pakistan ) ">
                            </div>
                            <div>
                                <button class="btn btn-primary mx-2 mt-1 smat-rounded" id="addProjectKeyboard"
                                    onclick="return false">+ Add
                                    keyword</button>
                            </div>
                        </div>
                        <div class=" mb-2" style="border-radius:24px;display:flex;flex-wrap:wrap;" id="projectDivPool">

                        </div>
                        <div class="text-dark">
                            <h5>Description of the project <span class="projectName"></span></h5>
                        </div>
                        <div class="border mb-2 " style="border-radius:24px;padding:10px;">
                            <textarea id="projectFormTextarea_id" class="form-control projField"
                                placeholder="Description of the project" rows="3" style="border:0px;"
                                required>A test project created for coronavirus related information.</textarea>
                        </div>
                        <div class="d-flex">
                            <button class="btn btn-primary mx-2 mt-1 smat-rounded" id="createProjectBtn">+ Create
                                Project</button>
                            {{-- <button
                                class="btn btn-danger mx-2 mt-1 smat-rounded">Clear</button> --}}
                        </div>
                    </form>
                </div>
            </div>
            <div class="confirmPanelCollapse mt-3" id="projectConfirmDiv">
                <div class="border  card card-body p-3 projectDiv ">
                    <div>
                        <p class="text-danger">Are you sure you want to create this project?</p>
                    </div>
                    <h3 class="m-0 font-weight-bold text-primary" id="projNameConfirm"></h3>
                    <div class="text-dark">
                        <p class="m-0"> from: <span class="font-weight-bold" id="fromDateConfirm"></span>, to: <span
                                class="font-weight-bold" id="toDateConfirm"></span> </p>
                        <p class="pull-text-top" id="descConfirm"></p>
                    </div>
                    <div class=" mb-2" style="border-radius:24px;display:flex;flex-wrap:wrap;" id="suggestionsConfirm">

                    </div>
                    <div class="text-muted">
                        Please select atmost three topics from the suggestions list.
                    </div>
                    <div id="errorMsgForConfirm">


                    </div>
                    <div class="mt-2">
                        <button class="btn btn-primary mx-1 smat-rounded" id="confirmBtnProj">Confirm</button>
                        <button class="btn btn-danger mx-1 smat-rounded" id="cancelBtnProj">Cancel</button>
                    </div>

                </div>
            </div>
            <div id="creatingProject"></div>
            <div class="smat-mainHeading ">
                Manage Projects
            </div>
            <div>
                <h5 class="text-dark my-0"><span id="numberOfProjectsCreatedByYou"></span> Projects created by you</h5>
                <div id="listOfProjects"></div>
            </div>
            <div class="confirmPanelCollapse" id="openProjectDiv">

                <div class="card card-body">
                    <div class=" d-flex" id="closeModifyProjectDiv" title="close"><span class="ml-auto"
                            style="cursor:pointer">close <i class="fas fa-times "></i></span> </div>
                    <h2 class="m-0 font-weight-bold" id="modifyDivProjName"></h2>
                    <div>Created on: <span id="modifyDivProjCreatedOn"> </span> </div>
                    <div>Description: <span id="modifyDivProjDescription"> </span> </div>
                    <div class="d-flex mt-2">
                        <button class="btn btn-success smat-rounded mr-3" type="button" id="activeProject">Activate
                            project</button>
                        <button class="btn btn-primary smat-rounded mr-3" type="button">Create Story</button>
                        <button class="btn btn-danger smat-rounded mr-3" type="button">Delete project</button>

                    </div>
                    <div class="mt-2 pt-2 ">
                        <h5 class="text-dark my-0"><span id="numberOfStories">0</span> Stories created under the project
                        </h5>
                        <div id="listOfStoriesOFProjectDiv" class="mt-1"
                            style="border-radius:24px;display:flex;flex-wrap:wrap;"> </div>
                    </div>
                </div>
                {{-- <div class="mt-3 confirmPanelCollapse" id="storyContentDiv">
                        <div class="card card-body" id="storyInfo">
                            <div class=" pb-2 mb-2">
                                <h3 class="m-0 font-weight-bold" id="storyMetaDataName">
                               
                                </h3>
                                <div class="storyMetaData">
                                    <p class="m-0 text-dark">Created on: <span class="font-weight-bold" id="storyMetaDataCreatedOn"></span></p>
                                    <p class="m-0 text-dark">Description: <span class="font-weight-bold"  id="storyMetaDataDescription"></span></p>
                                </div>
                            </div>
                       
                            <div id="storyContent"></div>
                        </div>
                    </div> --}}
            </div>

        </div>
    </div>
    <div class="row mt-3">
        <div class="col-sm-3">
            <div class="leftPanelStoryBuilder bg-light ">
                <div class="accordion" id="">
                    <div>
                        <button class="btn btn-block btn-link border" type="button" data-toggle="collapse"
                            data-target="#textElementsDisv" aria-expanded="true" aria-controls="textElementsDiv">
                            Add Text Elements
                        </button>
                        <div id="textElementsDiv" class="collapse p-2 text-dark show" aria-labelledby="headingOne"
                           >
                            <div class="border textElementStory p-2 m-1" value="title">
                                <h2 class="text-left m-0">Title</h2>
                                <p class="m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.. </p>
                            </div>
                            <div class="border  textElementStory p-2  m-1" value="section">
                                <h4 class="text-left m-0">Section</h4>
                                <p class="m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.. </p>
                            </div>
                            <div class="border  textElementStory p-2  m-1" value="subsection">
                                <h4 class="text-left m-0">-> Sub-Section</h4>
                                <p class="m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.. </p>
                            </div>
                        </div>
                    </div>
                    <!-- <div>
                        <button class="btn btn-block btn-link border" type="button" data-toggle="collapse"
                            data-target="#plotsDivFromProject" aria-expanded="true" aria-controls="plotsDivFromProject">
                            Add Plots From Project
                        </button>
                        <div id="plotsDivFromProject" class="collapse p-2 text-dark show" aria-labelledby="headingOne">
                          

                        </div>
                    </div> -->
                </div>
            </div>
        </div>
        <div class="col-sm-9">
            <div class="d-flex   mb-2 p-2">
                <button  class="btn btn-primary ml-auto" id="saveStorybtnStory">Save Story</button>
            </div>
            <div class=" bg-white  p-2" id="storyMakerDiv">

            </div>
        </div>

    </div>
    <script  src="public/jqueryUI/jquery-ui.min.js"></script>

    <script type="module" src="public/tempJS/project/smatProject.js"></script>
@endsection
