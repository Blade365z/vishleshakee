//void main
import { roshan } from './visualizer.js';
import {
    render_graph, union, intersection, exportnetwork, selected_graph_ids, render_centrality_graph,
    sparkUpload, get_network, writedelete, difference, shortestpaths, community_detection, centrality, linkprediction,
    render_linkprediction_graph, render_shortestpath_graph, render_community_graph1, draw_graph, update_view_graph_for_link_prediction,
    render_graph_community, render_union_graph, render_graph_union, render_intersection_diff_graph, render_intersection_difference,
    networkGeneration, storeResultofSparkFromController,getDeletedNodes,node_highlighting,selected_graph_query,getUserDetailsNA,message_displayer
} from './helper.js';
import { makeSuggestionsReady } from '../utilitiesJS/smatExtras.js'
import { formulateUserSearch } from '../utilitiesJS/userSearch.js';



let totalQueries = 0;
let totalNetworkatInstance = 0;
let searchRecords = [];
var cardIDdictionary = {};
var queryDictionaryFilename = {};
var queryDictionaryNetworkName = {};
var currentNetworkEngine = 'networkx', currentlyShowing;
var community_algo_option = "Async Fluidic";

var SourceNode;
var DestinationNode;

var wellformedquery; 


var currentviewingnetwork;
var anyNetworkViewedYet = false;
var currentOperation;
var currentViewTAB="centralityTab";
//globals for sparkStatus 
var checkSpartStatusInterval_centrality;
var userID;
var k_value;
if (localStorage.getItem('smat.me')) {
    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    userID = userInfoTemp['id'];
} else {
    window.location.href = 'login';
}

jQuery(function () {
    if(incoming){
        //TODO::Redirection 
        var networkType;        
        if(!(uniqueIDReceived == "null")){
            console.log(uniqueIDReceived);
            console.log("Maria CXH");
            
            if(incoming.charAt(0) == "$"){
                getUserDetailsNA(incoming).then(response => {
                incoming = response.author;
                totalQueries = totalQueries + 1;
                totalNetworkatInstance = totalNetworkatInstance + 1;
                generateCards(totalQueries, incoming, fromDateReceived, toDateReceived, 50, relationReceived, currentNetworkEngine, uniqueIDReceived, 'naCards',"normal");        
            });
            }else{
                totalQueries = totalQueries + 1;
                totalNetworkatInstance = totalNetworkatInstance + 1;
                generateCards(totalQueries, incoming, fromDateReceived, toDateReceived, 50, relationReceived, currentNetworkEngine, uniqueIDReceived, 'naCards',"normal");        
            }
        }else{
            if(incoming.charAt(0) == "$"){
                networkType = relationReceived;
            }else if((incoming.charAt(0) == "#")){
                networkType = relationReceived;
            }
            totalQueries = totalQueries + 1;
            totalNetworkatInstance = totalNetworkatInstance + 1;

            let filename = incoming + fromDateReceived + toDateReceived + 50 + networkType;
            networkGeneration('na/genNetwork', incoming, fromDateReceived+" 00:00:00", toDateReceived+" 00:00:00", 50 , relationReceived, filename).then(response => {
                generateCards(totalQueries, incoming, fromDateReceived, toDateReceived, 50, relationReceived, currentNetworkEngine, filename, 'naCards',"normal");    
                message_displayer("NETWORK GENERATED SUCCESSFULLY","success");
                return;
            })
        }
    }
    makeSuggestionsReady ('naQueryInputBox',50);


    let selected = $("#networkEngineNA").val();
    if (selected == "networkx") {
        currentNetworkEngine = selected;
        $("#resourceallocation").hide();
        $("#commonneighbor").hide();
    }
    $('#networkEngineNA').on('change', function () {
        let selected = $("#networkEngineNA").val();
        if (selected == "networkx") {
            currentNetworkEngine = selected;
            $("#resourceallocation").hide();
            $("#commonneighbor").hide();
            $("#async").show();
            $("#grivan").show();
            $("#btwncen").show();
            $("#evcen").show();
            $("#apsp").show();
        } else if (selected == "spark") {
            currentNetworkEngine = selected;
            $("#resourceallocation").show();
            $("#commonneighbor").show();
            $("#async").hide();
            $("#grivan").hide();
            $("#btwncen").hide();
            $("#evcen").hide();
            $("#apsp").hide();
        }
    });


    $("#binaryopsnetworkselector").hide();

    $('body').on('click', 'div .showBtn', function () {
        let args = $(this).attr('value');
        
        args = args.split(/[|]/).filter(Boolean);

        console.log("ARGS",args);

        $('.subject').text(queryDictionaryFilename[args[6]]);

        render_graph('na/graph_view_data_formator', args[6]).then(response => {
            draw_graph(response, "networkDivid");
        });
        if(args[4] == "ShortestPath"){

            $('.nav-pills a[href="#netContentNA"]').tab('show');
            $('.nav-pills a[href="#spContent"]').tab('show');

            currentViewTAB = "spTab";
            if(currentViewTAB != "spTab"){
                message_displayer("SELECT THE NETWORK AND SHIFT TO SHORTEST PATH TAB","error");
                return;
            }
            render_shortestpath_graph(args[6],args[7],args[8]);
            message_displayer("DISPLAYING RESULTS FOR SHORTEST PATHS","success");
        }else if(args[4] == "communities"){

            $('.nav-pills a[href="#netContentNA"]').tab('show');
            $('.nav-pills a[href="#communityContent"]').tab('show');

            currentViewTAB = "commTab";
            if(currentViewTAB != "commTab"){
                message_displayer("SELECT THE NETWORK AND SHIFT TO COMMUNITY DETECTION TAB","error");
                return;
            }
            render_community_graph1(args[6]).then(response => {
                render_graph_community(response,"networkDivid");
                message_displayer("DISPLAYING RESULTS FOR COMMUNITY DETECTION","success");
            });
        }else if(args[4] == "union"){
            if(currentViewTAB != "unionTabNA"){
                message_displayer("SELECT THE NETWORK AND SHIFT TO UNION TAB","error");
                return;
            }
            let files = args[6].split("__");
            render_union_graph(files).then(response => {
                render_graph_union(response);
                message_displayer("DISPLAYING RESULTS FOR UNION OPERATION","success");
            });
        }else if(args[4] == "intersection"){
            if(currentViewTAB != "interSecTabNA"){
                message_displayer("SELECT THE NETWORK AND SHIFT TO INTERSECTION TAB","error");
                return;
            }
            let files = args[6].split("__");
            render_intersection_diff_graph(files, "intersection").then(response => {
                render_intersection_difference(response, "intersection_displayer", "intersection");
                message_displayer("DISPLAYING RESULTS FOR INTERSECTION OPERATION","success");
            });
        }else if(args[4] == "difference"){
            if(currentViewTAB != "diffTabNA"){
                message_displayer("SELECT THE NETWORK AND SHIFT TO DIFFERENCE TAB","error");
                return;
            }
            let files = args[6].split("__");
            //let finalArray = files.reverse();
            render_intersection_diff_graph(files, "difference").then(response => {
                render_intersection_difference(response, "difference_displayer", "difference");
                message_displayer("DISPLAYING RESULTS FOR DIFFERENCE OPERATION","success");
            });
        }else if(args[4] == "linkprediction"){

            $('.nav-pills a[href="#netContentNA"]').tab('show');
            $('.nav-pills a[href="#lpContent"]').tab('show');

            currentViewTAB = "lpTabNA";
            if(currentViewTAB != "lpTabNA"){
                message_displayer("SELECT THE NETWORK AND SHIFT TO LINK PREDICTION TAB","error");
                return;
            }
            console.log(args);
            render_linkprediction_graph(args[6],args[7]).then(response => {
                update_view_graph_for_link_prediction(response,args[7],args[9]);
                message_displayer("DISPLAYING RESULTS FOR LINK PREDICTION","success");
            })
        }else{

            $('.nav-pills a[href="#netContentNA"]').tab('show');
            $('.nav-pills a[href="#centrality_algo_choice"]').tab('show');

            currentViewTAB = "centralityTab";
            if(currentViewTAB != "centralityTab"){
                message_displayer("SELECT THE NETWORK AND SHIFT TO CENTRALITY TAB","error");
                return;
            }
            render_centrality_graph(args[6], args[2], args[5],currentNetworkEngine).then(response => {
                $('.analysis_summary_div').html('');
                $('.analysis_summary_div').append('<table class="table">  <thead> <tr><th>Node</th><th>Score</th></tr>  </thead> <tbody id="tableBody"> </tbody></table>');
                for (var i = 0; i < response["nodes"].length; i++) {
                    $('#tableBody').append('<tr><td>' + response["nodes"][i]["label"] + '</td><td>' + response["nodes"][i]["size"] + '</td></tr>');
                }
                draw_graph(response, "networkDivid");
                message_displayer("DISPLAYING RESULTS FOR CENTRALITY","success");
            });
        }
    });


    /*
    TEMP AMITABH 
    */

    $('.nav-item ').removeClass('smat-nav-active');
    $('#nav-NA').addClass('smat-nav-active');
    $('#naInputInputs').on('submit', function (e) {
        e.preventDefault();
        let queryTemp = $('#queryNA').val().trim();

        if(queryTemp.includes('#')&&(($('#typeNA').val()=="Mention-Mention")||($('#typeNA').val()=="Mention-Hashtag")||($('#typeNA').val()=="Mention-Keyword")||(($('#typeNA').val()=="User-Hashtag")||(($('#typeNA').val()=="User-Mention"))||(($('#typeNA').val()=="Keyword-Hashtag"))||(($('#typeNA').val()=="Keyword-Mention"))))){
            message_displayer("INVALID NETWORK TYPE SELECTED","error");
            return;
        }else if(queryTemp.includes('@')&&(($('#typeNA').val()=="Hashtag-Mention")||($('#typeNA').val()=="Hashtag-Hashtag")||($('#typeNA').val()=="Hashtag-Keyword")||(($('#typeNA').val()=="User-Hashtag")||(($('#typeNA').val()=="User-Mention"))||(($('#typeNA').val()=="Keyword-Hashtag"))||(($('#typeNA').val()=="Keyword-Mention"))))){
            message_displayer("INVALID NETWORK TYPE SELECTED","error");
            return;
        }else if((!(queryTemp.includes('#')))&&(($('#typeNA').val()=="Hashtag-Mention")||($('#typeNA').val()=="Hashtag-Hashtag")||($('#typeNA').val()=="Hashtag-Keyword"))){
            message_displayer("INVALID NETWORK TYPE SELECTED","error");
            return;
        }else if((!(queryTemp.includes('@')))&&(($('#typeNA').val()=="Mention-Mention")||($('#typeNA').val()=="Mention-Hashtag")||($('#typeNA').val()=="Mention-Keyword"))){
            message_displayer("INVALID NETWORK TYPE SELECTED","error");
            return;
        }

        if(($('#typeNA').val() != "User-Hashtag")&&($('#typeNA').val() != "User-Mention")){
            totalQueries += 1;
            totalNetworkatInstance = totalNetworkatInstance + 1;

            let fromDateTemp = $('#fromDateNA').val();
            let fromDateStripped = fromDateTemp;
            fromDateTemp = fromDateTemp + " 00:00:00";
            let toDateTemp = $('#toDateNA').val();
            let toDateStripped = toDateTemp;
            toDateTemp = toDateTemp + " 00:00:00";
            let noOfNodesTemp = $('#nodesNA').val().trim();
            // noOfNodesTemp = noOfNodesTemp - 1;
            let naTypeTemp = $('#typeNA').val();
            if((naTypeTemp == "Keyword-Hashtag")||(naTypeTemp == "Keyword-Mention")){
                queryTemp = "*"+queryTemp;
            }
            let netCategory = $("#net_category").val();
            let naEngine = $('#networkEngineNA').val();
            let filename = queryTemp + fromDateStripped + toDateStripped + noOfNodesTemp + naTypeTemp;
            networkGeneration('na/genNetwork', queryTemp, fromDateTemp, toDateTemp, noOfNodesTemp, naTypeTemp, filename).then(response => {
               
                console.log("RES-GEN",response);
                if(response["res"]=="empty"){
                    totalQueries -= 1;
                    totalNetworkatInstance = totalNetworkatInstance - 1;
                    message_displayer("DATA UNAVAILABLE FOR THE QUERY IN THE PROVIDED TIME RANGE. CHECK, YOUR INPUTS AND TRY WITH OTHER TIME RANGE","error");
                    return; 
                }else if(response.message == "Request timed out"){
                    totalQueries -= 1;
                    totalNetworkatInstance = totalNetworkatInstance - 1;
                    message_displayer("REQUEST TIMED OUT, UNABLE TO PROCESS YOUR REQUEST AT THIS MOMENT. TRY WITH SMALLER RANGE AND LESSER NODE COUNT OR TRY AGAIN LATER.","error");
                    return; 
                }
                if(queryTemp.charAt(0) == "*"){
                    queryTemp = queryTemp.substring(1);
                }

                generateCards(totalQueries, queryTemp, fromDateStripped, toDateStripped, noOfNodesTemp, naTypeTemp, naEngine, filename, 'naCards',"normal");
                message_displayer("NETWORK GENERATED SUCCESSFULLY","success");
                return;
            })
        }else if(($('#typeNA').val()=="User-Hashtag")||($('#typeNA').val()=="User-Mention")){
            totalQueries += 1;
            totalNetworkatInstance = totalNetworkatInstance + 1;
            formulateUserSearch(queryTemp, 'userContainerList');
        }
    });

    $('body').on('click', 'div .networkCardDetails', function () {

        if((currentOperation == "union") || (currentOperation == "intersection") || (currentOperation == "difference")){
            $('.nav-pills a[href="#netContentNA"]').tab('show');
            $("#union_displayer").empty();
            $("#intersection_displayer").empty();
            $("#difference_displayer").empty();
            $("#unionContentNA").removeClass('active');
            $("#interSecContentNA").removeClass('active');
            $("#diffContentNA").removeClass('active');
        }

        let index = $(this).attr('value');
        currentviewingnetwork = index;
        // let cardData = searchRecords[index - 1];
        let id = searchRecords[index - 1].id;
        currentlyShowing = id;
        let filename = cardIDdictionary[id];
        //showing_results_for(cardData);
        render_graph('na/graph_view_data_formator', filename).then(response => {
            draw_graph(response, "networkDivid");
        });

        //updating network summary information
        $(".subject").empty();
        $(".subject").text(searchRecords[index - 1].query);
        $(".from_date").empty();
        $(".from_date").text(searchRecords[index - 1].from);
        $(".to_date").empty();
        $(".to_date").text(searchRecords[index - 1].to);
    })

    $(".analysis_summary_div").on('click', ".click_events", function() {
        var input = $(this).text();
        node_highlighting(input);
    });

})


// Tab Shifts 


$("body").on('click', ".authorName",function(){
    let name_text = $(this);
    name_text = name_text[0].innerText;
    let user_id = $(this).attr('value');

    let queryTemp = user_id;
    let fromDateTemp = $('#fromDateNA').val();
    let fromDateStripped = fromDateTemp;
    fromDateTemp = fromDateTemp + " 00:00:00";
    let toDateTemp = $('#toDateNA').val();
    let toDateStripped = toDateTemp;
    toDateTemp = toDateTemp + " 00:00:00";
    let noOfNodesTemp = $('#nodesNA').val().trim();
    // noOfNodesTemp = noOfNodesTemp - 1;
    let naTypeTemp = $('#typeNA').val();
    let netCategory = $("#net_category").val();
    let naEngine = $('#networkEngineNA').val();
    let filename = queryTemp + fromDateStripped + toDateStripped + noOfNodesTemp + naTypeTemp;
    networkGeneration('na/genNetwork', queryTemp, fromDateTemp, toDateTemp, noOfNodesTemp, naTypeTemp, filename).then(response => {
        generateCards(totalQueries, name_text, fromDateStripped, toDateStripped, noOfNodesTemp, naTypeTemp, naEngine, filename, 'naCards',"normal");
        message_displayer("NETWORK GENERATED SUCCESSFULLY","success");
        return;
    })
    $('#userContainerList-modal').modal('toggle');
});


$("#unionTabNA").on('click', function(){
    currentOperation = "union";
    $("#binaryopsnetworkselector").show();
    currentViewTAB = "unionTabNA";
});

$("#interSecTabNA").on('click',function(){
    currentOperation = "intersection";
    $("#binaryopsnetworkselector").show();
    currentViewTAB = "interSecTabNA";
});

$("#diffTabNA").on('click',function(){
    currentOperation = "difference";
    $("#binaryopsnetworkselector").show();
    currentViewTAB = "diffTabNA";
});

$("#netTabNA").on('click',function(){
    $("#binaryopsnetworkselector").hide();
});

$("#lpTabNA").on('click', function () {

    if(selected_graph_ids().length > 1){
        message_displayer("SELECT A SINGLE NETWORK AND PROCEED","error");
        return;   
    }

    var select_graph = selected_graph_ids();
    if(select_graph.length != 0){
        anyNetworkViewedYet = true;
    }
    let input = select_graph[0];
    $('.subject').text(queryDictionaryFilename[input]);
    render_graph('na/graph_view_data_formator', input).then(response => {
        draw_graph(response, "networkDivid");
    });
    currentViewTAB = "lpTabNA";
});

$("#centralityTab").on('click', function () {
    if(selected_graph_ids().length > 1){
        message_displayer("SELECT A SINGLE NETWORK AND PROCEED","error");
        return;   
    }
    var select_graph = selected_graph_ids();
    if(select_graph.length != 0){
        anyNetworkViewedYet = true;
    }
    let input = select_graph[0];
    $('.subject').text(queryDictionaryFilename[input]);
    render_graph('na/graph_view_data_formator', input).then(response => {
        draw_graph(response, "networkDivid");
    });
    currentViewTAB = "centralityTab";
});

$("#spTab").on('click', function () {
    if(selected_graph_ids().length > 1){
        message_displayer("SELECT A SINGLE NETWORK AND PROCEED","error");
        return;   
    }
    if(currentNetworkEngine=="spark"){
        $("#apsp").hide();
    }else{
        $("#apsp").show();
    }
    var select_graph = selected_graph_ids();
    if(select_graph.length != 0){
        anyNetworkViewedYet = true;
    }
    let input = select_graph[0];
    $('.subject').text(queryDictionaryFilename[input]);
    render_graph('na/graph_view_data_formator', input).then(response => {
        draw_graph(response, "networkDivid");
    });
    currentViewTAB = "spTab";
});

$("#commTab").on('click', function () {
    if(selected_graph_ids().length > 1){
        message_displayer("SELECT A SINGLE NETWORK AND PROCEED","error");
        return;   
    }
    var select_graph = selected_graph_ids();
    if(select_graph.length != 0){
        anyNetworkViewedYet = true;
    }
    let input = select_graph[0];
    console.log("K",queryDictionaryFilename[input]);
    $('.subject').text(queryDictionaryFilename[input]);
    render_graph('na/graph_view_data_formator', input).then(response => {
        draw_graph(response, "networkDivid");
    });
    currentViewTAB = "commTab";
});


$("#importNA").on('click', function () {
    $("#myModal_file_upload").modal('show');
});


$('#upload_form').on('submit', function (event) {
    event.preventDefault();
    var generator = new IDGenerator();
    var unique_id = generator.generate();
    var n = new FormData(this);
    n.append("name", unique_id);

    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let dir_name = userInfoTemp['id'];

    console.log("NN",n);
    if(!$("#cardnamefileupload").val()){
        message_displayer("NAME YOUR NETWORK IN THE INPUT BOX WHILE UPLOADING YOUR FILE","error");
        $('#myModal_file_upload').modal('toggle');
        return;  
    }

    n.append("dir_name",dir_name);
    $.ajax({
        url: 'na/fileupload',
        method: "POST",
        data: n,
        dataType: 'JSON',
        contentType: false,
        cache: false,
        processData: false,
        beforeSend: function() {
        },
        success: function(data) {
            totalQueries = totalQueries + 1;
            totalNetworkatInstance = totalNetworkatInstance + 1;
            generateCards(totalQueries, $("#cardnamefileupload").val(), "fromDateStripped", "toDateStripped", "noOfNodesTemp", "Default", "naEngine", unique_id, 'naCards',"fileupload");
            message_displayer("NETWORK IMPORTED SUCCESSFULLY. CLICK ON THE NETWORK CARD TO VIEW DETAILS","success");
            return; 
        }
    })
    .fail(function(res) {
        message_displayer("AN UNEXPECTED ERROR OCCUR WHILE UPLOADING YOUR NETWORK. CHECK YOUR INPUTS AND TRY AGAIN. THIS MAY HAPPEN BECAUSE OF WRONG FILE FORMAT","error");
        return;   
     })
    $('#myModal_file_upload').modal('toggle');
});


const generateCards = (id, query, fromDateTemp, toDateTemp, noOfNodesTemp, naTypeTemp, naEngine, filename, div, status) => {
    console.log(filename);
    let tempArr = [];
    tempArr = { 'id': id, 'query': query, 'from': fromDateTemp, 'to': toDateTemp, 'nodesNo': noOfNodesTemp, 'naType': naTypeTemp, 'filename': filename, 'naEngine': naEngine };
    searchRecords.push(tempArr);
    cardIDdictionary[id] = filename;
    queryDictionaryFilename[filename] = query;
    queryDictionaryNetworkName[filename] = naTypeTemp;

    console.log("Search Dict",searchRecords);
    console.log("cardDict",cardIDdictionary);

    if(status == "normal"){
        $('#' + div).append('<div class="col-md-2" value="' + id + '"><div class="card shadow p-0"><div class="card-body p-0"><div class="d-flex px-3 pt-3"><span class="pull-left"><i id="deleteCard" class="fa fa-window-close text-neg" aria-hidden="true"></i></span><div class="naCardNum text-center ml-auto mr-auto">' + padNumber(id) + '</div><span class="pull-right ml-auto"><input class="form-check-input position-static" type="checkbox" id=' + filename + '></span></div><div class="text-left networkCardDetails px-3 pb-3" style="border-radius:10px;" value="' + id + '" ><p class="font-weight-bold m-0" style="font-size:16px;" cardquery="' + query + '"> ' + query + '</p><p class="  smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"> From: ' + fromDateTemp + ' </p><p class="   smat-dash-title " style="margin-top:-2px;margin-bottom:0px;" > To:' + toDateTemp + ' </p><p class=" smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"> Nodes: ' + noOfNodesTemp + '</p><p class="  smat-dash-title " style="margin-top:-2px;margin-bottom:0px;" > Type: ' + naTypeTemp + '</p><p class=" smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"> Status: Ready</p></div></div></div></div>');
        currentOperation=null;
    }else if((status == "union")||(status == "intersection")||(status == "difference")){
        $('#' + div).append('<div class="col-md-2" value="' + id + '"><div class="card shadow p-0"><div class="card-body p-0"><div class="d-flex px-3 pt-3"><span class="pull-left"><i id="deleteCard" class="fa fa-window-close text-neg" aria-hidden="true"></i></span><div class="naCardNum text-center ml-auto mr-auto">' + padNumber(id) + '</div><span class="pull-right ml-auto"><input class="form-check-input position-static" type="checkbox" id=' + filename + '></span></div><div class="text-left networkCardDetails px-3 pb-3" style="border-radius:10px;" value="' + id + '" ><p class="font-weight-bold m-0" style="font-size:16px;" cardquery="' + query + '"> ' + query + '</p></div>');
        currentOperation=null;
    }else if(status == "afterdeletion"){
        $('#' + div).append('<div class="col-md-2" value="' + id + '"><div class="card shadow p-0"><div class="card-body p-0"><div class="d-flex px-3 pt-3"><span class="pull-left"><i id="deleteCard" class="fa fa-window-close text-neg" aria-hidden="true"></i></span><div class="naCardNum text-center ml-auto mr-auto">' + padNumber(id) + '</div><span class="pull-right ml-auto"><input class="form-check-input position-static" type="checkbox" id=' + filename + '></span></div><div class="text-left networkCardDetails px-3 pb-3" style="border-radius:10px;" value="' + id + '" ><p class="font-weight-bold m-0" style="font-size:16px;" cardquery="' + query + '"> ' + query + '</p></div>');
        currentOperation=null;
    }else if(status == "fileupload"){
        $('#' + div).append('<div class="col-md-2" value="' + id + '"><div class="card shadow p-0"><div class="card-body p-0"><div class="d-flex px-3 pt-3"><span class="pull-left"><i id="deleteCard" class="fa fa-window-close text-neg" aria-hidden="true"></i></span><div class="naCardNum text-center ml-auto mr-auto">' + padNumber(id) + '</div><span class="pull-right ml-auto"><input class="form-check-input position-static" type="checkbox" id=' + filename + '></span></div><div class="text-left networkCardDetails px-3 pb-3" style="border-radius:10px;" value="' + id + '" ><p class="font-weight-bold m-0" style="font-size:16px;" cardquery="' + query + '"> ' + query + '</p></div>');
        currentOperation=null;
    }

    if(totalNetworkatInstance > 0){
        $("#card-division").show();
        $("#net-smat-tabs").show();
        $("#net-analysis-summary").show();
        $("#queryDisplay").show();
    }
}

$("#naCards").on("click", "#deleteCard", function () {
    $(this).parent().parent().parent().parent().parent().remove();
    totalNetworkatInstance = totalNetworkatInstance - 1;
    if(totalNetworkatInstance <= 0){
        $("#networkDivid").empty();
        $("#messagebox").empty();
        $('.subject').empty();
        $('.nos_of_nodes').empty();
        $(".nos_of_edges").empty();
        $('.analysis_summary_div').empty();
        $("#card-division").css('display', 'none');
        $("#net-smat-tabs").css('display', 'none');
        $("#net-analysis-summary").css('display', 'none');
        $("#queryDisplay").css("display","none");
    }
});

$("#messagebox").on("click","#infopanel #deleteinfoCard", function () {
    $(this).parent().remove();
});

function padNumber(d) {
    return (d < 10) ? d.toString() : d.toString();
    //return (d < 10) ? '0' + d.toString() : d.toString();
}

const showing_results_for = (cardData) => {
    console.log(cardData);
    let data = cardData;
    $('#naShowingResForTitle').text(data['query']);

}

export const getquerydictfilename = () =>{
    return queryDictionaryFilename;
}

$("#centrality_exec").on('click', function (NAType, algo_option = $('#centrality_algo_choice').val()) {

    if(selected_graph_ids().length > 1){
        message_displayer("PLEASE SELECT A SINGLE NETWORK","error");
        return;
    }else if(selected_graph_ids().length == 0){
        message_displayer("PLEASE SELECT A NETWORK","error");
        return;
    }

    if(anyNetworkViewedYet == false){
        var select_graph = selected_graph_ids();
        let input = select_graph[0];
        $('.subject').text(queryDictionaryFilename[input]);
        render_graph('na/graph_view_data_formator', input).then(response => {
            draw_graph(response, "networkDivid");
        });
    }

    algo_option = $("input[name='centralityInlineRadioOptions']:checked").val();
    var select_graph = selected_graph_ids();
    let input = select_graph[0];
    var url;
    var data = {};

    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let dir_name = userInfoTemp['id'];

    if (currentNetworkEngine == 'networkx') {
        url = 'na/centrality';
        data = {
            input: input,
            algo_option: algo_option,
            dir_name : dir_name
        };
    } else if (currentNetworkEngine == 'spark') {
        sparkUpload(selected_graph_ids());
        let input = select_graph[0];
        var query_list = [algo_option, input];
        var rname = (new Date().getTime()).toString() + '-spark';   // create unique_name   
        url = 'na/requestToSpark';
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        let dir_name = userInfoTemp['id'];
        data = {
            query_list, rname, dir_name
        }
        
    }
    centrality(url, data, currentNetworkEngine).then(response => {
        if (currentNetworkEngine == "networkx") {
            render_centrality_graph(data["input"], "networkDivid", data["algo_option"],currentNetworkEngine).then(response => {
                $('.analysis_summary_div').html('');
                $('.analysis_summary_div').append('<table class="table">  <thead> <tr><th>Node</th><th>Score</th></tr>  </thead> <tbody id="tableBody"> </tbody></table>');
                for (var i = 0; i < response["nodes"].length; i++) {
                    $('#tableBody').append('<tr><td>'+'<a href="#target" class="click_events">'+ response["nodes"][i]["label"] +'</a>'+ '</td><td>' + response["nodes"][i]["size"] + '</td></tr>');
                }
                $('.analysis_summary_div').append('</table>');
                draw_graph(response, "networkDivid");
                message_displayer("CENTRALITY CALCULATED SUCCESSFULLY","success");
            });
        } else if (currentNetworkEngine == "spark") {
            let sparkID = response.id;
            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];

            transferQueryToStatusTable(queryMetaData, 'Centrality', algo_option, sparkID);
            function checkSparkStatus() {
                fetch('na/getsparkstatus/' + sparkID, {
                    method: 'get'
                }).then(response => response.json())
                    .then(response => {
                        if (response.state === 'success') {
                            let query_list = [algo_option, input];
                            storeResultofSparkFromController(sparkID, query_list, userID).then(response => {
                                makeShowBtnReadyAfterSuccess(sparkID, response.filename, 'centrality', algo_option,data["query_list"][1] );
                                window.clearInterval(checkSpartStatusInterval_centrality);
                            })

                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            checkSpartStatusInterval_centrality = setInterval(checkSparkStatus, 5000);
        }
    });

});


$("#link_prediction_exec").on('click', function (NAType = $("#networkEngineNA").val(), algo_option = "") {
    var SOURCE = $("#link_source_node").val();

    if(SOURCE.charAt(0) != "#" && SOURCE.charAt(0) != "@"){
        SOURCE="*"+SOURCE;
    }

    if(selected_graph_ids().length != 1){
        message_displayer("SELECT A SINGLE NETWORK","error");
        return;
    }

    var NAType = $("#networkEngineNA").val();
    algo_option = $("input[name='linkpredictionRadioOptions']:checked").val();
    var select_graph = selected_graph_ids();
    let input = select_graph[0];

    var url;
    var data = {};
    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let dir_name = userInfoTemp['id'];

    k_value = $("#nos_links_to_be_predicted").val();

    if(anyNetworkViewedYet == false){
        var select_graph = selected_graph_ids();
        let input = select_graph[0];
        $('.subject').text(queryDictionaryFilename[input]);
        render_graph('na/graph_view_data_formator', input).then(response => {
            draw_graph(response, "networkDivid");
        });
    }

    if(!$("#link_source_node").val()){
        message_displayer("SELECT A NODE","error");
        return;
    }else if(!$("#nos_links_to_be_predicted").val()){
        message_displayer("ENTER NUMBER OF LINKS TO BE PREDICTED","error");
        return;
    }else if(!algo_option){
        message_displayer("SELECT A LINK PREDICTION ALGORITHM CHOICE","error");
        return;
    }else if((selected_graph_ids().length == 0)){
        message_displayer("SELECT A NETWORK","error");
        return;
    }else if(selected_graph_ids().length > 1){
        message_displayer("SELECT A SINGLE NETWORK","error");
        return;
    }


    if (currentNetworkEngine == 'networkx') {
        url = 'na/link_prediction';
        data = {
            input: input,
            src: SOURCE,
            k_value: $("#nos_links_to_be_predicted").val(),
            algo_option: algo_option,
            dir_name : dir_name
        };
    } else if (currentNetworkEngine == 'spark') {
        sparkUpload(selected_graph_ids());
        let src = SOURCE;
        SourceNode = src;
        var query_list = [algo_option, input, src];
        var rname = (new Date().getTime()).toString() + '-spark';   // create unique_name   
        url = 'na/requestToSpark';
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        let dir_name = userInfoTemp['id'];
        data = {
            query_list, rname,dir_name
        }
    } else {
    }
    linkprediction(url, data, NAType).then(response => {
        if (currentNetworkEngine == "networkx") {
            render_linkprediction_graph(data["input"], data["src"],$("#nos_links_to_be_predicted").val()).then(response => {
                $('.analysis_summary_div').empty();
                let j = 0;
                for (var i = 0; ((i < response.length) && (j < k_value)); i++) {
                    if (data["src"] == response[i].id) {
                        continue;
                    }

                    if(data["src"].charAt(0) == "*"){
                        data["src"] = data["src"].substring(1); 
                    }

                    if(response[i].id.charAt(0) == "*"){
                        response[i].id =  response[i].id.substring(1);
                    }

                    j++;
                    $('.analysis_summary_div').append('<tr><td>'+'<a href="#target" class="click_events">'+ data["src"] +'</a>'+'</td><td>' + response[i].id + '</td></tr>');
                }
                $('.analysis_summary_div').append('</table>');
                update_view_graph_for_link_prediction(response, data["src"],$("#nos_links_to_be_predicted").val());
                message_displayer("LINK PREDICTION OPERATION PERFORMED SUCCESSFULLY","success");
                return;
            });
        } else if (currentNetworkEngine == "spark") {

            let sparkID = response.id;
            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];

            transferQueryToStatusTable(queryMetaData, 'Link Prediction', algo_option, sparkID);
            function checkSparkStatus() {
                fetch('na/getsparkstatus/' + sparkID, {
                    method: 'get'
                }).then(response => response.json())
                    .then(response => {
                        if (response.state === 'success') {
                            let query_list = [algo_option, input];
                            storeResultofSparkFromController(sparkID, query_list, userID).then(response => {
                                makeShowBtnReadyAfterSuccess(sparkID, response.filename, 'linkprediction', algo_option,data["query_list"][1] );
                                window.clearInterval(checkSpartStatusInterval_centrality);
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            checkSpartStatusInterval_centrality = setInterval(checkSparkStatus, 5000);
            // message_displayer("LINK PREDICTION OPERATION PERFORMED SUCCESSFULLY","success");
            // return;
        }
    })
});

$("#sp_exec").on('click', function (NAType = "networkx", algo_option = "") {

    var src = $("#sourceSp").val();
    var dst = $("#destSp").val();


    if(selected_graph_ids().length != 1){
        message_displayer("SELECT A SINGLE NETWORK","error");
        return;
    }

    if(src.charAt(0) != "#" && src.charAt(0) != "@"){
        src="*"+src;
    }

    if(dst.charAt(0) != "#" && dst.charAt(0) != "@"){
        dst="*"+dst;
    }

    NAType = $("#networkEngineNA").val();
    var algo_option = $("#spoption").val();
    var select_graph = selected_graph_ids();
    var input = select_graph[0];

    var url;
    var data = {};

    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let dir_name = userInfoTemp['id'];


    if(anyNetworkViewedYet == false){
        var select_graph = selected_graph_ids();
        let input = select_graph[0];
        $('.subject').text(queryDictionaryFilename[input]);
        render_graph('na/graph_view_data_formator', input).then(response => {
            draw_graph(response, "networkDivid");
        });
    }

    if(!src){
        message_displayer("SELECT A SOURCE NODE","error");
        return;
    }else if(!dst){
        message_displayer("SELECT A DESTINATION NODE","error");
        return;
    }else if(!algo_option){
        message_displayer("SELECT A SHORTEST PATH ALGORITHM CHOICE","error");
        return;
    }else if((selected_graph_ids().length == 0)){
        message_displayer("SELECT A NETWORK","error");
        return;
    }else if(selected_graph_ids().length > 1){
        message_displayer("SELECT A SINGLE NETWORK","error");
        return;
    }


    if (currentNetworkEngine == 'networkx') {
        url = 'na/shortestpath';
        data = {
            input: input,
            src: src,
            dst: dst,
            algo_option: algo_option,
            dir_name : dir_name
        };

    } else if (currentNetworkEngine == 'spark') {
        sparkUpload(selected_graph_ids());
        var query_list = ['ShortestPath', input, src, dst];
        SourceNode = src;
        DestinationNode = dst;
        var rname = (new Date().getTime()).toString() + '-spark';   // create unique_name   
        url = 'na/requestToSpark';
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        let dir_name = userInfoTemp['id'];
        data = {
            query_list: query_list,
            rname: rname,
            dir_name : dir_name
        };
    } else {
    }
    shortestpaths(url, data, currentNetworkEngine).then(response => {
        if (currentNetworkEngine == "networkx") {
            render_shortestpath_graph(data["input"], data["src"], data["dst"]);
            message_displayer("SHORTEST PATH OPERATION PERFORMED SUCCESSFULLY","success");
            return;
        } else if (currentNetworkEngine == "spark") {
            let sparkID = response.id;
            // Hardcoding the Shortest Path
            let algo_option = "ShortestPath"; 

            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];

            transferQueryToStatusTable(queryMetaData, 'ShortestPath', algo_option, sparkID);
            function checkSparkStatus() {
                fetch('na/getsparkstatus/' + sparkID, {
                    method: 'get'
                }).then(response => response.json())
                    .then(response => {
                        if (response.state === 'success') {
                            let query_list = [algo_option, input];
                            storeResultofSparkFromController(sparkID, query_list, userID).then(response => {
                                makeShowBtnReadyAfterSuccess(sparkID, response.filename, 'ShortestPath', algo_option,data["query_list"][1] );
                                window.clearInterval(checkSpartStatusInterval_centrality);
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            checkSpartStatusInterval_centrality = setInterval(checkSparkStatus, 5000);
        }
    });
});

// Setting community detection algo option
$("#async").on("click", function () {
    $("#noOfCommunities").show();
    community_algo_option = $("#async").text();
});

$("#lpa").on("click", function () {
    community_algo_option = $("#lpa").text();
    $("#noOfCommunities").hide();
});

$("#grivan").on("click", function () {
    community_algo_option = $("#grivan").text();
    $("#noOfCommunities").hide();
});

$("#comm_exec").on('click', function (NAType = $("#NAEngine").val(), algo_option = "") {
    if(selected_graph_ids().length > 1){
        message_displayer("SELECT A SINGLE NETWORK","error");
        return;
    }else if(selected_graph_ids().length == 0){
        message_displayer("SELECT A SINGLE NETWORK","error");
        return;
    }
    NAType = $("#networkEngineNA").val();
    if (community_algo_option == "Async Fluidic") {
        algo_option = "async";
        if(!$("#noOfCommunities").val()){
            message_displayer("ENTER NUMBER OF COMMUNITIES TO BE FOUND","error");
            return;        
        }
    } else if (community_algo_option == "Label Propagation") {
        algo_option = "lpa";
    } else if (community_algo_option == "Grivan Newman") {
        algo_option = "grivan";
    }
    var select_graph = selected_graph_ids();
    var input = select_graph[0];
    k_value = $("#noOfCommunities").val();
    var url;
    var data = {};

    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let dir_name = userInfoTemp['id'];

    if(anyNetworkViewedYet == false){
        var select_graph = selected_graph_ids();
        let input = select_graph[0];
        $('.subject').text(queryDictionaryFilename[input]);
        render_graph('na/graph_view_data_formator', input).then(response => {
            draw_graph(response, "networkDivid");
        });
    }

    if (NAType == 'networkx') {
        url = 'na/communitydetection';
        data = {
            input: input,
            k: k_value,
            iterations: 1000,
            algo_option: algo_option,
            dir_name : dir_name
        };
    } else if (currentNetworkEngine == 'spark') {
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        let dir_name = userInfoTemp['id'];
        sparkUpload(selected_graph_ids());
        let input = select_graph[0];
        var query_list = [algo_option, input];
        var rname = (new Date().getTime()).toString() + '-spark'; 

        var query_list = ['lpa'];
        query_list.push(input);

        url = 'na/requestToSpark';
        data = {
            query_list: query_list,
            rname: rname,
            dir_name : dir_name
        };
    } else {
    }
    community_detection(url, data, NAType).then(response => {
        if (currentNetworkEngine == "networkx") {
            render_community_graph1(data["input"]).then(response => {
                render_graph_community(response, "networkDivid");
            });
            message_displayer("COMMUNITY DETECTION PERFORMED SUCCESSFULLY","success");
        } else if (currentNetworkEngine == "spark") {

            let sparkID = response.id;
            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];

            transferQueryToStatusTable(queryMetaData, 'communities', algo_option, sparkID);
            function checkSparkStatus() {
                fetch('na/getsparkstatus/' + sparkID, {
                    method: 'get'
                }).then(response => response.json())
                    .then(response => {
                        if (response.state === 'success') {
                            let query_list = [algo_option, input];
                            storeResultofSparkFromController(sparkID, query_list, userID).then(response => {
                                makeShowBtnReadyAfterSuccess(sparkID, response.filename, 'communities', algo_option,data["query_list"][1] );
                                window.clearInterval(checkSpartStatusInterval_centrality);
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            checkSpartStatusInterval_centrality = setInterval(checkSparkStatus, 5000);
        }
    })
});

$("#union_exec").on('click', function () {
    if((selected_graph_ids().length == 0) || (selected_graph_ids().length == 1)){
        message_displayer("SELECT AT LEAST 2 NETWORKS","error");
        return;
    }

    let selectedGraphs = selected_graph_ids();

    for(let i=0; i<selected_graph_ids().length; i++){
        if(i==0){
            wellformedquery = queryDictionaryFilename[selectedGraphs[i]];
        }else{
            wellformedquery = wellformedquery + " U " + queryDictionaryFilename[selectedGraphs[i]];
        }
    }

    $(".subject").empty();
    $(".subject").append(wellformedquery);


    var url;
    var data = {};
    var input_arr = selected_graph_ids();
    var input_arr_net_type = [];
    for(let c=0;c<input_arr.length;c++){
        input_arr_net_type.push(queryDictionaryNetworkName[input_arr[c]]);
    }



    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let dir_name = userInfoTemp['id'];
    currentNetworkEngine = "networkx";
    if (currentNetworkEngine == 'networkx') {
        url = 'na/union';
        data = {
            input: input_arr,
            dir_name : dir_name
        };
    } else if (currentNetworkEngine == 'spark') {
        var query_list = ['union'];

        for (var i = 0; i < input_arr.length; i++) {
            query_list.push(input_arr[i]);
        }

        sparkUpload(selected_graph_ids());
        var rname = (new Date().getTime()).toString() + '-spark';   // create unique_name   
        url = 'na/requestToSpark';
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        let dir_name = userInfoTemp['id'];
        data = {
            query_list, rname,dir_name
        }
    } else {
    }
    union(url, data, currentNetworkEngine).then(response => {
        if (currentNetworkEngine == "networkx") {
            render_union_graph(data["input"],input_arr_net_type).then(response => {
                render_graph_union(response);
                message_displayer("UNION OPERATION PERFORMED SUCCESSFULLY","success");
                return;
            });
        } else if (currentNetworkEngine == "spark") {

            let sparkID = response.id;
            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];

            let algo_option = "union";

            transferQueryToStatusTable(queryMetaData, 'union',algo_option, sparkID);
            function checkSparkStatus() {
                fetch('na/getsparkstatus/' + sparkID, {
                    method: 'get'
                }).then(response => response.json())
                    .then(response => {
                        if (response.state === 'success') {
                            let query_list = [algo_option];
                            let conc;
                            for(let i=0; i<input_arr.length; i++){
                                query_list.push(input_arr[i]);
                                if(i == 0){
                                    conc = input_arr[i];
                                }else{
                                    conc = conc+"__"+input_arr[i];
                                }
                            }
                            storeResultofSparkFromController(sparkID, query_list, userID).then(response => {
                                makeShowBtnReadyAfterSuccess(sparkID, response.filename, 'union', algo_option,conc);
                                window.clearInterval(checkSpartStatusInterval_centrality);
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            checkSpartStatusInterval_centrality = setInterval(checkSparkStatus, 5000);
        }
    });
});


$("#intersection_exec").on('click', function (NAType = "networkx") {

    if((selected_graph_ids().length == 0) || (selected_graph_ids().length == 1)){
        message_displayer("SELECT AT LEAST 2 NETWORKS","error");
        return;
    }

    
    let selectedGraphs = selected_graph_ids();

    for(let i=0; i<selected_graph_ids().length; i++){
        if(i==0){
            wellformedquery = queryDictionaryFilename[selectedGraphs[i]];
        }else{
            wellformedquery = wellformedquery + "<span>&#8745;</span>" + queryDictionaryFilename[selectedGraphs[i]];
        }
    }

    $(".subject").empty();
    $(".subject").append(wellformedquery);

    NAType = $("#networkEngineNA").val();
    var url;
    var data = {};
    var input_arr = selected_graph_ids();
    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let dir_name = userInfoTemp['id'];
    currentNetworkEngine = "networkx";
    if (currentNetworkEngine == 'networkx') {
        url = 'na/intersection';
        data = {
            input: input_arr,
            dir_name : dir_name
        };
    } else if (currentNetworkEngine == 'spark') {
        var query_list = ['intersection'];

        for (var i = 0; i < input_arr.length; i++) {
            query_list.push(input_arr[i]);
        }
        sparkUpload(selected_graph_ids());
        var rname = (new Date().getTime()).toString() + '-spark';   // create unique_name   
        url = 'na/requestToSpark';
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        let dir_name = userInfoTemp['id'];
        data = {
            query_list, rname, dir_name
        }
    } else {
    }
    intersection(url, data, NAType).then(response => {
        if (NAType == "networkx") {
            render_intersection_diff_graph(data["input"], "intersection").then(response => {
                render_intersection_difference(response, "intersection_displayer", "intersection");
            });
            message_displayer("INTERSECTION OPERATION PERFORMED SUCCESSFULLY","success");
            return;
        } else if (currentNetworkEngine == "spark") {

            let sparkID = response.id;
            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];
            let algo_option = "intersection";

            transferQueryToStatusTable(queryMetaData, 'intersection',algo_option, sparkID);
          
            function checkSparkStatus() {
                fetch('na/getsparkstatus/' + sparkID, {
                    method: 'get'
                }).then(response => response.json())
                    .then(response => {
                        if (response.state === 'success') {
                            let query_list = [algo_option];
                            let conc;
                            for(let i=0; i<input_arr.length; i++){
                                query_list.push(input_arr[i]);
                                if(i == 0){
                                    conc = input_arr[i];
                                }else{
                                    conc = conc+"__"+input_arr[i];
                                }
                            }
                            storeResultofSparkFromController(sparkID, query_list, userID).then(response => {
                                makeShowBtnReadyAfterSuccess(sparkID, response.filename, 'intersection', algo_option,conc);
                                window.clearInterval(checkSpartStatusInterval_centrality);
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            checkSpartStatusInterval_centrality = setInterval(checkSparkStatus, 5000);
        }
    });
});

$("#expansionTabNA").on('click', function (NAType = "networkx") {
    var select_graph = selected_graph_ids();
    let input = select_graph[0];
    render_graph(input, "expansion_displayer");
});

$("expansion_exec").on('click', function (NAType = "networkx") {
    var node_to_be_expanded = $("#node_to_be_expanded").val();
    var hops = $("#hops").val();
    expansion(node_to_be_expanded, hops);
});

$("#export").on('click', function (NAType = "networkx") {
    exportnetwork();
});

$("#difference_exec").on('click', function (NAType = "networkx") {

    if((selected_graph_ids().length == 0) || (selected_graph_ids().length == 1)){
        message_displayer("SELECT AT LEAST 2 NETWORKS","error");
        return;
    }

    let selectedGraphs = selected_graph_ids();

    for(let i=0; i<selected_graph_ids().length; i++){
        if(i==0){
            wellformedquery = queryDictionaryFilename[selectedGraphs[i]];
        }else{
            wellformedquery = wellformedquery + " - " + queryDictionaryFilename[selectedGraphs[i]];
        }
    }

    $(".subject").empty();
    $(".subject").append(wellformedquery);

    var NAType = $("#networkEngineNA").val();
    var url;
    var data = {};
    var input_arr = [];

    if(!$("#difference_sequence").val()){
        message_displayer("SELECT YOUR NETWORKS AND INPUT NETWORK IDs COMMA SEPARATED. EX. 2,1","error");
        return;
    }

    let sequence = $("#difference_sequence").val().split(',');
    for (let i = 0; i < sequence.length; i++) {
        if(!(selected_graph_ids().includes(cardIDdictionary[sequence[i]]))){
            message_displayer("MISMATCH IN INPUT CARD ID SEQUENCE AND SELECTED NETWORKS","error");
            return;
        }
        input_arr.push(cardIDdictionary[sequence[i]]);
    }

    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let dir_name = userInfoTemp['id'];
    currentNetworkEngine = "networkx";
    if (currentNetworkEngine == 'networkx') {
        url = 'na/difference';
        data = {
            input: input_arr, dir_name : dir_name
        };
    } else if (currentNetworkEngine == 'spark') {
        var query_list = ['difference'];

        for (let i = 0; i < input_arr.length; i++) {
            query_list.push(input_arr[i]);
        }

        sparkUpload(selected_graph_ids());
        var rname = (new Date().getTime()).toString() + '-spark';   // create unique_name   
        url = 'na/requestToSpark';
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        let dir_name = userInfoTemp['id'];
        data = {
            query_list, rname, dir_name
        }

    } else {
    }
    difference(url, data, currentNetworkEngine).then(response => {
        if (currentNetworkEngine == "networkx") {
            render_intersection_diff_graph(data["input"], "difference").then(response => {
                render_intersection_difference(response, "difference_displayer", "difference");
            });
            message_displayer("DIFFERENCE OPERATION PERFORMED SUCCESSFULLY","success");
            return;
        } else if (currentNetworkEngine == "spark") {


            let sparkID = response.id;
            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];
            let algo_option = "difference";

            transferQueryToStatusTable(queryMetaData, 'difference',algo_option, sparkID);
          
            function checkSparkStatus() {
                fetch('na/getsparkstatus/' + sparkID, {
                    method: 'get'
                }).then(response => response.json())
                    .then(response => {
                        if (response.state === 'success') {
                            let query_list = [algo_option];
                            let conc;
                            for(let i=0; i<input_arr.length; i++){
                                query_list.push(input_arr[i]);
                                if(i == 0){
                                    conc = input_arr[i];
                                }else{
                                    conc = conc+"__"+input_arr[i];
                                }
                            }
                            storeResultofSparkFromController(sparkID, query_list, userID).then(response => {
                                makeShowBtnReadyAfterSuccess(sparkID, response.filename, 'difference', algo_option,conc);
                                window.clearInterval(checkSpartStatusInterval_centrality);
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            checkSpartStatusInterval_centrality = setInterval(checkSparkStatus, 5000);
        }
    });
});

$("#usenetwork").on('click', function () {
    var generator = new IDGenerator();
    var unique_id = generator.generate();

    if(currentOperation == "union"){
        writedelete(unique_id);
        totalQueries = totalQueries + 1;
        totalNetworkatInstance = totalNetworkatInstance + 1;

        generateCards(totalQueries, wellformedquery, "", "", "", "", "", unique_id, 'naCards',"union");

    }else if(currentOperation == "intersection"){
        writedelete(unique_id);
        totalQueries = totalQueries + 1;
        totalNetworkatInstance = totalNetworkatInstance + 1;

        generateCards(totalQueries,wellformedquery, "", "", "", "", "", unique_id, 'naCards',"intersection");        
    }else if(currentOperation == "difference"){
        writedelete(unique_id);
        totalQueries = totalQueries + 1;
        totalNetworkatInstance = totalNetworkatInstance + 1;

        generateCards(totalQueries,wellformedquery, "", "", "", "", "", unique_id, 'naCards',"difference");    
    }else{
        currentOperation = "deletion";
        writedelete(unique_id);
        let sentence;
        getDeletedNodes().then(response => {
            sentence = response;
            totalQueries = totalQueries + 1;
            totalNetworkatInstance = totalNetworkatInstance + 1;

            generateCards(totalQueries, "Network "+currentviewingnetwork+" after deleting "+ sentence +"", "", "", "", "", "", unique_id, 'naCards',"afterdeletion");
        });
    }
});

function IDGenerator() {
    this.length = 8;
    this.timestamp = +new Date;
    var _getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    this.generate = function () {
        var ts = this.timestamp.toString();
        var parts = ts.split("").reverse();
        var id = "";
        for (var i = 0; i < this.length; ++i) {
            var index = _getRandomInt(0, parts.length - 1);
            id += parts[index];
        }
        return id;
    }
}

const algoDict = { "degcen": 'Degree Centrality', "pgcen": "Page Rank Centrality" };
const transferQueryToStatusTable = (data, operation, algo, sparkID = 123, renderDivID = 'networkDivid') => {
    $('#searchTable').css('display', 'block');
    let algoTitle = algoDict[algo];
    $('#naStatusTable').append('<tr><th scope="row">' + data.id + '</th><td>' + data.query + '</td><td>' + operation + ' (' + algoTitle + ')' + '</td><td>' + data.from + '</td><td>' + data.to + '</td><td  id="' + sparkID + 'Status">Running...</td><td><button class="btn btn-secondary smat-rounded mx-1 showBtn" value="' + data.id + '|' + sparkID + '|' + renderDivID + '"  id="' + sparkID + 'Btn" disabled > Show </button><button class="btn btn-neg mx-1  smat-rounded"> Delete </button></td></tr>');
    message_displayer("APACHE SPARK : QUERY SUBMITTED SUCCESSFULLY","info");
}

const makeShowBtnReadyAfterSuccess = (sparkID, filename, mode, algo = null, originalFile) => {
    $('#' + sparkID + 'Btn').prop("disabled", false);
    let btnValue = $('#' + sparkID + 'Btn').attr('value');
    $('#' + sparkID + 'Btn').removeClass('btn-secondary');
    $('#' + sparkID + 'Btn').addClass('btn-primary');
    algo = algo == null ? '' : algo;
    btnValue = btnValue + '|' + filename + '|' + mode + '|' + algo + '|' + originalFile + '|' + SourceNode + '|' + DestinationNode + '|' + k_value;
    $('#' + sparkID + 'Btn').attr('value', btnValue);
    $('#' + sparkID + 'Status').text('Success');
    message_displayer("APACHE SPARK : COMPUTATION PERFORMED SUCCESSFULLY. CLICK ON SHOW TO GET THE RESULTS","success");
}