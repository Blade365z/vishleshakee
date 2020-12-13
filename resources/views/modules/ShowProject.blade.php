@extends('parent.app')
@section('content')
<div class="smat-mainHeading ">
    Projects
</div>

<div class="my-3" id="searchTable">
    <div class="card">
        <div class="card-body">
            <div class="row">
                <div class="col-sm-12">
                    <div class="tab-content UATopContent" id="pills-tabContent"  >                   
                        <div class="tab-pane fade  px-1 recentSearchTabContent active show" id="ProjectContent" role="tabpanel"
                            aria-labelledby="ProjectContent">
                            <div class="table-responsive ">
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>                                      
                                            <th class="py-1 px-3 text-dark " scope="col">Project Name</th>
                                            <th class="py-1 px-3 text-dark " scope="col">Analysis Name</th>
                                            <th class="py-1 px-3 text-dark " scope="col">Time</th>
                                            <th class="py-1 px-3 text-dark " scope="col">Options</th>
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
    </div>
</div>

<script type="module" src="public/tempJS/project/ShowProject.js"></script>

@endsection