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


                <div class=" bg-white  py-3 px-5 border" id="storyMakerDiv">

                </div>
            </div>
            <div class="col-sm-2">
                <div class="element-box bg-white py-1 px-2" style="margin-top:110px;" id="storyElementsToolBox">
                    <div>
                        <h6 class="mt-2 mb-0">Add Elements to story</h6>
                    </div>
                    <div class="border textElementStory p-2 m-1" value="title">
                        <h2 class="text-left m-0">Title</h2>
                        <p class="m-0">Lorem ipsum dolor sit amet.. </p>
                    </div>
                    <div class="border  textElementStory p-2  m-1" value="section">
                        <h4 class="text-left m-0">Section</h4>
                        <p class="m-0">Lorem ipsum dolor sit amet.. </p>
                    </div>
                    <div class="border  textElementStory p-2  m-1" value="description">
                        <h4 class="text-left m-0">Description</h4>
                        <p class="m-0">Lorem ipsum dolor sit amet..</p>
                    </div>
                    <div class="pt-2 px-2">
                        <p class="text-left m-0">Available Images</p>
                    </div>
                    <div class="story-images">

                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="public/jqueryUI/jquery-ui.min.js"></script>
    <script src="public/html2canvas/jsPdf.js"></script>
    <script type="module" src="public/tempJS/project/smatStory.js"></script>

@endsection
