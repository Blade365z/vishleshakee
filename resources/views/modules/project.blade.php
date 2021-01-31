@extends('parent.app')
@section('content')
    <link href="public/tempCSS/project.css" rel="stylesheet" />

    <div class="smat-mainHeading ">
        Create a new project
    </div>
    <div class="row">

        <div class="col-sm-5 ">

            <div class="card card-body">
                <form id="projCreateForm">
                    <div class="text-dark">
                        <h5>Name of the project</h5>
                    </div>
                    <div class="dFlexBut mb-3">
                        <div class="form-group  text-normal  border smat-rounded d-flex  mr-2 px-2 py-1 bg-white mb-0"
                            id="">
                            <input type="text" class="form-control " name="query" id="projectName"
                                placeholder="Type a project name" style="border:0px;" value="sars_2020" autocomplete="OFF"
                                required>
                        </div>


                    </div>
                    <div class="text-danger pull-text-top" id="ifProjectNameAlreadyExits">
                    </div>
                    <div class="text-dark">
                        <h5>Duration</h5>
                    </div>
                    <div class="dFlexBut mb-3">
                        <div
                            class="form-group  dateinputForm my-0  mr-2  border smat-rounded d-flex px-2 py-1  bg-white w-100">
                            <i class="far fa-calendar-alt mx-2 text-normal " style="margin-top:11px;"></i>
                            <input type="text" class="form-control datepicker-here  smat-from " id="fromDateProj"
                                placeholder="From Date" onkeydown="return false;" style="border:0px;" autocomplete="OFF"
                                data-language='en' value="2020-12-01" required>
                        </div>
                        <div
                            class="form-group dateinputForm my-0  mr-2 border smat-rounded d-flex px-2 py-1  bg-white w-100">
                            <i class="far fa-calendar-alt mx-2 text-normal" style="margin-top:11px;"></i>
                            <input type="text" class="form-control datepicker-here  smat-to " id="toDateProj"
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
                        <textarea id="projectFormTextarea_id" class="form-control" placeholder="Description of the project"
                            rows="3" style="border:0px;"
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
        <div class="col-sm-7">
            <div class="confirmPanelCollapse " id="projectConfirmDiv">
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
                <h5 class="text-dark my-0">Projects created by you</h5>
                <div id="listOfProjects"></div>
            </div>
            <div class="confirmPanelCollapse" id="openProjectDiv">
               
                <div class="card card-body" >
                    <div class=" d-flex" id="closeModifyProjectDiv"  title="close"><span class="ml-auto" style="cursor:pointer">close <i class="fas fa-times "></i></span> </div>
                    <h2 class="m-0 font-weight-bold" id="modifyDivProjName"></h2>
                    <div>Created on: <span id="modifyDivProjCreatedOn"> </span> </div>
                    <div>Description: <span id="modifyDivProjDescription"> </span> </div>
                    <div class="d-flex mt-2">
                        <button class="btn btn-success smat-rounded mr-3" type="button" id="activeProject">Activate project</button>
                        <button class="btn btn-danger smat-rounded mr-3" type="button">Delete project</button>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="module" src="public/tempJS/project/smatProject.js"></script>
@endsection
