@extends('parent.app')
@section('content')
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
                                    <button class="btn btn-primary smat-rounded mx-1  " id="addQueryButton"
                                        onclick="return false"><i class="fa fa-plus" aria-hidden="true"></i></button>
                                </div>
                             
                                <div class="form-check mx-3 pt-2">
                                    <input class="form-check-input" type="radio" id="gridRadios1"
                                        value="option1" checked>
                                    <label class="form-check-label" for="gridRadios1">
                                        Hashtags
                                    </label>
                                </div>
                                <div class="form-check mx-3 pt-2">
                                    <input class="form-check-input" type="radio" id="gridRadios1"
                                        value="option1" >
                                    <label class="form-check-label" for="gridRadios1">
                                        Keywords
                                    </label>
                                </div>
                                <div class="form-check mx-3 pt-2">
                                    <input class="form-check-input" type="radio" id="gridRadios1"
                                        value="option1" >
                                    <label class="form-check-label" for="gridRadios1">
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
                                    <tbody>

                                        <tr>
                                            <th scope="row">1</th>
                                            <td>#AWSservice</td>
                                            <td>Hashtag</td>
                                            <td>
                                                <div class="d-flex">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="radio" id="gridRadios1"
                                                            value="option1" checked>
                                                        <label class="form-check-label" for="gridRadios1">
                                                            Enable
                                                        </label>
                                                    </div>
                                                    <div class="form-check mx-3">
                                                        <input class="form-check-input" type="radio" id="gridRadios2"
                                                            value="option2">
                                                        <label class="form-check-label" for="gridRadios2">
                                                            Disable
                                                        </label>
                                                    </div>

                                                </div>
                                            </td>
                                            <td>

                                                <button class="btn btn-secondary smat-rounded  btn-sm ">Edit</button><button
                                                class="btn btn-neg smat-rounded  btn-sm mx-2 ">Delete</button>
                                            </td>
                                            </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                        <div class="tab-pane fade  " id="sysEnvContent" role="tabpanel" aria-labelledby="sysEnvContent">
                            <div class="row">
                                    <div class="col-sm-5">
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Email address</label>
                                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
                                            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                                          </div>
                                          <div class="form-group">
                                            <label for="exampleInputPassword1">Password</label>
                                            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
                                          </div>
                                          <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="exampleCheck1">
                                            <label class="form-check-label" for="exampleCheck1">Check me out</label>
                                          </div>
                                          <button type="submit" class="btn btn-primary">Submit</button>
                                        </form>
                                    </div>
                                   <div class="col-sm-7">
                                        
                                    </div>

                            </div>


                        </div>
                    </div>

                </div>
            </div>

        </div>

    </div>
<scipt src="public/tempJS/config/configureSmat.js" type="module"></script>
@endsection
