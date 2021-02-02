<div class="modal" tabindex="-1" role="dialog" id="addToStoryModal">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4>Add story to <span id="ProjectNameStory"></span></h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="trackChartBody">
                <div  id="storyMsgDiv">

                </div>
                <div>
                    <h4 class="text-dark">Please select a story</h4>
                </div>
                <div id="listOfStories" class="mb-2" style="max-height:200px; overflow-y:auto;overflow-x:hidden;">

                </div>
                <div>
                    <button class="btn btn-primary smat-rounded" id="createStory">+ Create a new story</button>
                </div>
                <div class="mt-3" id="createStoryFormDIV" style="display:none;">
                    <form id="createStoryForm">
                        <div class="form-group">
                            <label for="storyNameInput">Enter story details</label>
                            <input type="text" class="form-control border smat-rounded" id="storyNameInput"
                                placeholder="Enter a story name">
                            <textarea class="form-control mt-2 border" placeholder="Add Description about your story"
                                style="border-radius:14px;" id="createStoryDescription">This is a test story.</textarea>
                        </div>
                        <button class="btn btn-primary smat-rounded">Create story</button>
                    </form>
                </div>
                <div class="border-top mt-3" id="storyAnalysisDiv">
                    <form id="storyUploadForm">
                        <div class="form-group">
                            <label for="analysisNameInput">Enter Analysis details</label>
                            <input type="text" class="form-control border smat-rounded" id="analysisNameInput"
                                placeholder="Enter a analysis name" required>
                            <div class="mt-3">
                                <div id="storyPlot" style="overflow-x:scroll;">

                                </div>
                                {{-- <button class="btn btn-success my-2 smat-rounded">Paste Plot</button> --}}
                            </div>
                            <textarea class="form-control mt-2 border"
                                placeholder="Add Description about your analysis/plot"
                                style="border-radius:14px;" id="analysisDescription" required></textarea>
                        </div>
                        <button class="btn btn-primary smat-rounded">Save in story</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
