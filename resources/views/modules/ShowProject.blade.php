@extends('parent.app')
@section('content')
    <div class="smat-mainHeading ">
        Projects
    </div>

    <div>
        <p> <span id="numberOfProjectsCreated">0</span> projects created.</p>
    </div>
    <div class="my-3 row" id="projecBlocks">


    </div>
    <div class="errorMsgs" id="errorMsgsShowProj" style="display:none;">

    </div>
    <div style="display:none" id="showingProj">
        <h4 > Showing saved analysis for project <span class="font-weight-bold" id="currentlySelectedProjtext"></span></h4>
    </div>
    <div class="my-3" id="searchTable" style="display:none;">


        <div class="row">
            <div class="col-sm-12">
                <div class="tab-content " id="pills-tabContent" style="overflow-y:scroll;max-height:450px;">
                    <div class="tab-pane fade  px-1 recentSearchTabContent active show" id="ProjectContent" role="tabpanel"
                        aria-labelledby="ProjectContent">
                        <div class="table-responsive ">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>

                                        <th class="py-1 px-3 text-dark " scope="col">Analysis Details</th>
                                        <th class="py-1 px-3 text-dark " scope="col">Saved on</th>

                                        {{-- <th class="py-1 px-3 text-dark " scope="col">Options</th> --}}
                                    </tr>
                                </thead>
                                <tbody id="ProjectTable">

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    </div>

    <script type="module" src="public/tempJS/project/ShowProject.js"></script>

@endsection
