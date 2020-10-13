<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ConfigureSmat extends Controller
{
    public function temp(){
        $dbString='10.0.0.1,10.0.0.2,10.0.0.3,10.0.0.4,10.0.0.5';
        $arrTemp = preg_split("/[,]+/",  $dbString);
        // print_r($arrTemp);
        // echo "After edit...";
        $newIp='10.0.1.34';
        $index=2;
        $arrTemp[$index]=$newIp;
        // print_r($arrTemp);
        for($i=0;$i<count($arrTemp);$i++){
            print($arrTemp[$i].',');
        }
    }
    
}
