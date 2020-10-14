<div class="modal fade mt-5" tabindex="-1" role="dialog" aria-hidden="true" id="addTrackWordsModal">
    <div class="modal-dialog ">
        <div class="modal-content">
            <div class="modal-body">
                <p class="mb-1 smat-dash-title text-muted">Add track words to Crawler list</p>
                <div class="d-flex">
                    <div class="form-check mx-3 pt-2">
                        <input class="form-check-input addToListCheck" type="radio" id="hashtagOption" value="track" checked >
                        <label class="form-check-label" for="hashtagOption">
                            Hashtags
                        </label>
                    </div>
                    <div class="form-check mx-3 pt-2">
                        <input class="form-check-input addToListCheck" type="radio" id="keywordOption" value="track"  >
                        <label class="form-check-label" for="keywordOption">
                            Keywords
                        </label>
                    </div>
                    <div class="form-check mx-3 pt-2">
                        <input class="form-check-input addToListCheck" type="radio" id="userOption" value="user" >
                        <label class="form-check-label" for="userOption">
                            Users
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <input type="text" class="form-control smat-rounded mt-2 configModalInput" id="trackWordID" placeholder="Enter Track Word" required>
                </div>
                <div class="form-group" id="trackWordHandle" style="display:none">
                    <p class="mb-1 smat-dash-title text-muted">Please add the handle name of the user</p>
                     <input type="text" class="form-control smat-rounded  configModalInput" id="trackWordHandleInput" placeholder="Enter Track Handle" >
                </div>
                <div class="d-flex mt-1">
                    <button class="btn btn-primary smat-rounded ml-auto" id="addTrackConfirm">+ Add</button>
                    <button class="btn btn-danger smat-rounded mx-2 cancelBtn">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</div>
