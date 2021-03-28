@extends('parent.app')
@section('content')
    <link href="public/tempCSS/story.css" rel="stylesheet" />

    <script>
        var projectID = @json($projectID ?? '');
        var storyID = @json($storyID ?? '');
        console.log('PROJECT-->', projectID);
        console.log('STORY--->', storyID);

    </script>

    <div id="storyCreateErrorMsg">

    </div>
    <div class="confirmPanelCollapse storyDiv">
        <div>
           <h3> Project: <span id="projectName"> </span> </h3>
        </div>
        <div class="row mt-3   " id="">
            <div class="col-sm-10 ">
                <div class=" text-dark" id="storyTitle">
                    <h5>Create a new story</h5>
                </div>
                <div class="row ">
                    <div class="col-sm-7">
                        <div class="form-group">
                            <input class="form-control" type="text" id="storyName" placeholder="Type story name"
                                style="font-size:20px;" />
                        <div class="mt-2"> 
                            <textarea class=" form-control  w-100  text-left" value="Description" id="storyDescription" > Type story description</textarea>
                        </div>
                        </div>
                    </div>
                    <div class="col-sm-5">
                        <div class="d-flex mt-3" id="saveDownloadOptionStory">
                            <button class="btn btn-primary smat-rounded mr-2" id="download-pdf"><i
                                    class="fa fa-download mr-1" aria-hidden="true"></i> Export story as pdf</button>
                            <button class="btn btn-primary smat-rounded" id="saveStorybtnStory"><i
                                    class="fas fa-save mr-1"></i>
                                Save Story</button>
                        </div>
                    </div>
                </div>

                <div id="story-nav">
                    <nav class="navbar navbar-expand-lg   p-2  bg-white border" >
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <div class="nav-item mr-1">
                                <div class="dropdown">
                                    <button class="btn btn-primary dropdown-toggle" type="button" id="textInsertDropDown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-font mr-2"></i> Insert Text
                                    </button>
                                    <div class="dropdown-menu shadow" aria-labelledby="dropdownMenuButton">
                                        <div class=" textElementStory p-2 m-1" value="title">
                                            <h1 class="text-left m-0 font-weight-bold">Title</h1>
                                            <p class="m-0">Lorem ipsum dolor.. </p>
                                        </div>
                                        <div class="dropdown-divider text-center"></div>

                                        <div class="textElementStory p-2  m-1" value="section">
                                            <h4 class="text-left m-0 font-weight-bold">Section</h4>
                                            <p class="m-0">Lorem ipsum dolor.. </p>
                                        </div>  
                                        <div class="dropdown-divider text-center"></div>

                                        <div class="textElementStory p-2  m-1" value="description">
                                            <h6 class="text-left m-0 font-weight-bold">Description</h6>
                                            <p class="m-0">Lorem ipsum dolor..</p>
                                        </div>

                                    </div>
                                  </div>
                            </div>
                            <div class="nav-item mx-1">
                               
                                    <button class="btn btn-primary " type="button" id="insertImageBtn" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-images mr-2"></i> Insert Image
                                    </button>
                            </div>
                            <div class="nav-item mx-1">
                               
                                <button class="btn btn-primary " type="button" id="insertSpaceBtn" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-expand mr-2"></i>
                                    Add Space
                                </button>
                        </div>
                        <div class="nav-item ml-auto">
                            <button class="btn btn-success " type="button" id="seeResultBtn" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-external-link-alt mr-2"></i>
                                See Result
                            </button>
                    </div>
                        </div>
                    </nav>
                </div>
                <div class=" bg-white  p-5 border" id="storyMakerDiv">

                </div>
            </div>
    
        </div>
    </div>


    <script src="public/jqueryUI/jquery-ui.min.js"></script>
    <script src="public/html2canvas/jsPdf.js"></script>
    <script type="module" src="public/tempJS/project/smatStory.js"></script>

@endsection
