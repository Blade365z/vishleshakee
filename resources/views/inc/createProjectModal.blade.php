{{-- <div class="modal" tabindex="-1" role="dialog" id="createProjectModal">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Create New Project</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="createProjectForm">
                <div class="modal-body">

                    <div class="form-group">
                        <label for="projectName">Set a name for your project</label>
                        <input type="text" class="form-control" id="projectName" placeholder="Project Name..">
                        <small id="projectHelp" class="form-text text-muted">Please enter a name for your new
                            project.</small>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">Create</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </form>
        </div>
    </div>
</div> --}}

<div class="modal" tabindex="-1" role="dialog" id="createProjectModal">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title font-weight-bold">Manage Projects</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            
                <div class="modal-body">
                  <div id="projectMessgaes">

                  </div>
                  <div id="currentlySelectedProj">

                  </div>
                    <div>
                        <h6 class="text-dark">Select previously created project </h6>
                    </div>
                    <div id="selectProjectModalBody" style="max-height:300px;overflow-x:hidden;overflow-y:auto;">

                    </div>
                    <form id="createNewProjectForm">
                    <div class="mt-3">
                        <h6 class="text-dark"> Or create a new project</h6>
                        <div class="clickable my-2" id="addProject">
                            <input class="form-control smat-rounded" type="text" id="addNewProjectInput" required>
                        </div>
                        <div>
                            <button class="btn btn-primary smat-rounded" type="submit">+ Add new project</button>
                        </div>
                    </div>
                  </form>
                    {{-- <div class="form-group">
                        <label for="projectName">Set a name for your project</label>
                        <input type="text" class="form-control" id="projectName" placeholder="Project Name..">
                        <small id="projectHelp" class="form-text text-muted">Please enter a name for your new
                            project.</small>
                    </div> --}}
                </div>
                {{-- <div class="modal-footer">
                    <button type="submit" class="btn btn-primary smat-rounded" id="projApplyBtn">Apply</button>
                    <button type="button" class="btn btn-secondary smat-rounded" data-dismiss="modal">Close</button>
                </div> --}}
          
        </div>
    </div>
</div>
