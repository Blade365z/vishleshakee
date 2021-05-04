@extends('parent.app')
@section('content')
    <div class="col-sm-6 offset-md-3 mt-4">
        <h2>Change password</h2>
        <div class="card card-body">
            <div id="password-change-messages">

            </div>
            <form id="changePassForm">
                <div class="form-group">
                    <div>
                        <label for="old-password">Old-password</label>
                        <input class="form-control border" type="password" id="old-password" />
                    </div>
                    <div>
                        <label for="old-password">New-password</label>
                        <input class="form-control border" type="password" id="new-password" />
                    </div>
                    <div>
                        <label for="old-password">Confirm-password</label>
                        <input class="form-control border" type="password" id="confirm-password" />
                    </div>
                    <div class="mt-3">
                        <button class="btn-primary btn" type="submit">Change password</button>
                    </div>
                </div>
            </form>
        </div>
        <script type="module" src="public/tempJS/auth/changePass.js"></script>
    @endsection
