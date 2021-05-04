<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\User;

class ChangePassword extends Controller
{
    function updatePassword(Request $request){
        //get current user name 
        //check if old password given is valid 
        //check if new password ==confirm password
        //if all checks done  update password & send json response with success as key or send error as key!
        if (Auth::check()) {
            $user = Auth::user()->username;
            $oldPassword = $request->input('oldPassword');
            $newPassword =  $request->input('newPassword');
            $confirmPassword =$request->input('confirmPassword');
            if(Auth::attempt(['username'=>$user,'password'=>$oldPassword])){
                if($newPassword==$confirmPassword){
                    User::where('username','=',$user)->update(['password'=>Hash::make($newPassword)]);
                    return response()->json(['success'=>'Password successfully updated!'],200);
                }
                return response()->json(['error'=>'Passwords donot match!'],400);
            }
            else{
                return response()->json(['error'=>'Wrong password!'],400);
            }
            // $user_data = User::where('user')
        }else{
        return response()->json(['error'=>'Not Logged in!'],400);
        }
    }
}
