//void main

import {
    chartBuilder,render_graph, union, intersection, exportnetwork, selected_graph_ids, render_centrality_graph,
    sparkUpload, get_network, writedelete, difference, shortestpaths, community_detection, centrality, linkprediction,
    render_linkprediction_graph, render_shortestpath_graph, render_community_graph1, draw_graph, update_view_graph_for_link_prediction,
    render_graph_community, render_union_graph, render_graph_union, render_intersection_diff_graph, render_intersection_difference,
    networkGeneration, storeResultofSparkFromController,getDeletedNodes,node_highlighting,selected_graph_query,getUserDetailsNA,message_displayer,
    node_highlighting_community,query_track,populate_track,delete_queries_from_db,diameter
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
var community_algo_option = "async";

let network_del_db = "notallowed"
var SourceNode;
var DestinationNode;

var wellformedquery; 
var naTypeTempforEXP;


var currentviewingnetwork;
var currentviewingnetwork_name;
var anyNetworkViewedYet = false;
var currentOperation;
var currentViewTAB="centralityTab";
//globals for sparkStatus 
var checkSpartStatusInterval_centrality;
var userID;
var k_value;
var summary_flag = false;

var mynetworks=[];
var query_mynetworks_mapping = {};

let mynetworks_counter = 0;

if (localStorage.getItem('smat.me')) {
    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    userID = userInfoTemp['id'];
} else {
    window.location.href = 'login';
}

jQuery(function () {
    $('body #netview').tooltip({title: "Double click to activate View Mode", html: true, placement: "top"}); 
    $('body #netdel').tooltip({title: "Double click to activate Delete Mode", html: true, placement: "top"}); 
    $("#modemsg").html('<p class="d-flex text-muted mb-1 text-center" style="font-size:0.8rem">View Mode Active</p>');
    
    populate_track(userID).then(response => {
            $.each(response,function(key,value){
                mynetworks.push(value["queryID"]);
                mynetworks_counter = mynetworks_counter + 1;
                query_mynetworks_mapping[value["queryID"]] = "vis-"+mynetworks_counter;
                transferQueryToStatusTable_track(value["query"],value["queryID"], value["queryID"].split('_')[4],"algo_option", "sparkID");
            })
        });



    $("#queryNA").on("input",function(){
        let r = $("#queryNA").val();

        if (!(r.indexOf(""))) {
            console.log("MariaDB");
            $('#typeNA option[value="Hashtag-Hashtag"]').attr('disabled', true);
            $('#typeNA option[value="Hashtag-Mention"]').attr('disabled', true);
            $('#typeNA option[value="Hashtag-Keyword"]').attr('disabled', true);
            $('#typeNA option[value="Keyword-Mention"]').attr('disabled', false);
            $('#typeNA option[value="Keyword-Hashtag"]').attr('disabled', false);
            $('#typeNA option[value="User-Hashtag"]').attr('disabled', false);
            $('#typeNA option[value="User-Mention"]').attr('disabled', false);
            $('#typeNA option[value="Hashtag-Keyword"]').attr('disabled', true);
            $('#typeNA option[value="Mention-Mention"]').attr('disabled', true);
            $('#typeNA option[value="Mention-Hashtag"]').attr('disabled', true);
            $('#typeNA option[value="Mention-Keyword"]').attr('disabled', true);
            $('#typeNA option[value="Hashtag-User"]').attr('disabled', true);
        }

        if (!(r.indexOf("#"))) {
            console.log("#tag");
            $('#typeNA option[value="Mention-Mention"]').remove();
            $('#typeNA option[value="Mention-Hashtag"]').remove();
            $('#typeNA option[value="Keyword-Mention"]').remove();
            $('#typeNA option[value="Keyword-Hashtag"]').remove();
            $('#typeNA option[value="User-Mention"]').remove();
            $('#typeNA option[value="User-Hashtag"]').remove();
            $('#typeNA option[value="User-Mention"]').remove();
            $('#typeNA option[value="Mention-Keyword"]').remove();

            $('#typeNA option[value="Hashtag-Hashtag"]').attr('disabled', false);
            $('#typeNA option[value="Hashtag-Mention"]').attr('disabled', false);
            $('#typeNA option[value="Hashtag-Keyword"]').attr('disabled', false);
            $('#typeNA option[value="Hashtag-User"]').attr('disabled', false);
            $('#typeNA option[value="Mention-Mention"]').attr('disabled', true);
            $('#typeNA option[value="Mention-Hashtag"]').attr('disabled', true);
            $('#typeNA option[value="Mention-Keyword"]').attr('disabled', true);
            $('#typeNA option[value="User-Hashtag"]').attr('disabled', true);
            $('#typeNA option[value="User-Mention"]').attr('disabled', true);
            $('#typeNA option[value="Keyword-Hashtag"]').attr('disabled', true);
            $('#typeNA option[value="Keyword-Mention"]').attr('disabled', true);
        }

        if (!(r.indexOf("@"))) {
            console.log("#tag");

            $('#typeNA option[value="Hashtag-Keyword"]').remove();
            $('#typeNA option[value="Keyword-Hashtag"]').remove();
            $('#typeNA option[value="Keyword-Mention"]').remove();
            $('#typeNA option[value="Keyword-Hashtag"]').remove();
            $('#typeNA option[value="User-Mention"]').remove();
            $('#typeNA option[value="User-Hashtag"]').remove();
            $('#typeNA option[value="User-Mention"]').remove();
            $('#typeNA option[value="Hashtag-Keyword"]').remove();
            $('#typeNA option[value="Hashtag-Mention"]').remove();
            $('#typeNA option[value="Hashtag-User"]').remove();
            $('#typeNA option[value="Hashtag-Hashtag"]').remove();




            $('#typeNA option[value="Mention-Hashtag"]').attr('disabled', false);
            $('#typeNA option[value="Mention-Mention"]').attr('disabled', false);
            $('#typeNA option[value="Mention-Keyword"]').attr('disabled', false);
            $('#typeNA option[value="Hashtag-Hashtag"]').attr('disabled', true);
            $('#typeNA option[value="Hashtag-Mention"]').attr('disabled', true);
            $('#typeNA option[value="Hashtag-Keyword"]').attr('disabled', true);
            $('#typeNA option[value="User-Hashtag"]').attr('disabled', true);
            $('#typeNA option[value="User-Mention"]').attr('disabled', true);
            $('#typeNA option[value="Keyword-Hashtag"]').attr('disabled', true);
            $('#typeNA option[value="Keyword-Mention"]').attr('disabled', true);
            $('#typeNA option[value="Hashtag-User"]').attr('disabled', true);
        }

    })

    $('.analysis_summary_div').hide();
    $("#naSummary").css("height", "0px");

    $("body").on('mouseover', "li  .click_events", function() {
        var input = $(this).text();
        node_highlighting(input);
    });

    $("body").on('mouseover', ".click_events", function() {
        var input = $(this).text();
        node_highlighting(input);
    });

    $("body").on('mouseover', ".click_events_community", function() {
        var input = $(this).text();
        node_highlighting_community(input);
    });

    $("body").on("click", "#show_neighbors", function(){
        $('#analysis_summary_charts').hide();
       // $('.analysis_summary_div').hide();
        $(".NeighborsDiv").css('display', 'block');
        $("#show_analysis").removeClass("btn btn-primary");
        $("#show_analysis").addClass( "btn btn-info" );
        $("#show_neighbors").addClass("btn btn-primary");
        $('.analysis_summary_div').hide();
    })

    $("body").on("click", "#show_analysis", function(){
        $('#analysis_summary_charts').show();
        $('.analysis_summary_div').show();
        $(".NeighborsDiv").css('display', 'none');
        $("#show_neighbors").removeClass( "btn btn-primary" );
        $("#show_neighbors").addClass( "btn btn-info" );
        $("#show_analysis").addClass( "btn btn-primary" );
    })


    $("body").on("click",".network_button",function(){
        let button = $(this);
        let queryID = $(this).val();
        if(network_del_db=="allowed"){
            $("#delete_permission_db").modal('show');
            $("#permission_granted_dbdel").click(function() {
                delete_queries_from_db(queryID,userID).then(response=>console.log("LKLK"));
                mynetworks = mynetworks.filter(function(value) {
                    return queryID !== value
                })
                $(button).remove();
            });
        }else{
        var input = $(this).val();
        let sequence = input.split('_');
        let filename = input;
        let name_text = sequence[0];
        let fromDateStripped = sequence[1];
        let toDateStripped = sequence[2];
        let noOfNodesTemp = sequence[3];
        let naTypeTemp = sequence[4];
        let naEngine = "networkx";

        totalQueries += 1;
        totalNetworkatInstance = totalNetworkatInstance + 1;

        generateCards(totalQueries, name_text, fromDateStripped, toDateStripped, noOfNodesTemp, naTypeTemp, naEngine, filename, 'naCards',"normal");
        let movingmessage = "Moved network &nbsp <b>"+name_text +' '+ query_mynetworks_mapping[filename]+" </b> &nbsp to Active Networks. Click on the &nbsp <u>view network</u> &nbsp text on the card to view the network.";               

        message_displayer(movingmessage,"success");

        }
    });

    $('[data-toggle="popover"]').popover(); 
    if(incoming){
        $("#hint").hide();
        //TODO::Redirection 
        var networkType;        
        if(!(uniqueIDReceived == "null")){           
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
            $("#hint").hide();
            if(incoming.charAt(0) == "$"){
                networkType = relationReceived;
            }else if((incoming.charAt(0) == "#")){
                networkType = relationReceived;
            }
            totalQueries = totalQueries + 1;
            totalNetworkatInstance = totalNetworkatInstance + 1;

            let filename = incoming + fromDateReceived + toDateReceived + 50 + networkType;
            networkGeneration('na/genNetwork', incoming, fromDateReceived+" 00:00:00", toDateReceived+" 00:00:00", 50 , relationReceived, filename,"enabled").then(response => {
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
        //$("#resourceallocation").hide();
        //$("#commonneighbor").hide();
    }
    $('#networkEngineNA').on('change', function () {
        let selected = $("#networkEngineNA").val();
        if (selected == "networkx") {
            currentNetworkEngine = selected;
            //$("#resourceallocation").hide();
            // $("#commonneighbor").hide();
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
            //$("#btwncen").hide();
            $("#evcen").hide();
            $("#apsp").hide();
        }
    });


    $("#binaryopsnetworkselector").hide();

    $('body').on('click', 'div .showBtn', function () {
        let args = $(this).attr('value');
        
        args = args.split(/[|]/).filter(Boolean);

        $('.subject').text(queryDictionaryFilename[args[6]]);

        // Commented for the time being
       // render_graph('na/graph_view_data_formator', args[6]).then(response => {
         //   draw_graph(response, "networkDivid");
        //});

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
            render_linkprediction_graph(args[6],args[7]).then(response => {
                update_view_graph_for_link_prediction(response,args[7],args[9]);
                message_displayer("DISPLAYING RESULTS FOR LINK PREDICTION","success");
            });
        }else{

            $('.nav-pills a[href="#netContentNA"]').tab('show');
            $('.nav-pills a[href="#centrality_algo_choice"]').tab('show');

            currentViewTAB = "centralityTab";
            if(currentViewTAB != "centralityTab"){
                message_displayer("SELECT THE NETWORK AND SHIFT TO CENTRALITY TAB","error");
                return;
            }
            render_centrality_graph(args[6], args[2], args[5],currentNetworkEngine).then(response => {
                chartBuilder(response["chartData"]);
                
                $('.analysis_summary_div').html('');
                $('.analysis_summary_div').append('<table class="table">  <thead> <tr><th>Node Rankings (Decreasing Order) </th><th>Score</th></tr>  </thead> <tbody id="tableBody"> </tbody></table>');
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
        $("#hint").hide();
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
            // totalQueries += 1;
            // totalNetworkatInstance = totalNetworkatInstance + 1;

            let fromDateTemp = $('#fromDateNA').val();
            let fromDateStripped = fromDateTemp;
            fromDateTemp = fromDateTemp + " 00:00:00";
            let toDateTemp = $('#toDateNA').val();
            let toDateStripped = toDateTemp;
            toDateTemp = toDateTemp + " 00:00:00";
            let noOfNodesTemp = $('#nodesNA').val().trim();
            // noOfNodesTemp = noOfNodesTemp - 1;
            let naTypeTemp = $('#typeNA').val();
            naTypeTempforEXP = naTypeTemp;
            if((naTypeTemp == "Keyword-Hashtag")||(naTypeTemp == "Keyword-Mention")){
                queryTemp = "*"+queryTemp;
            }
            let netCategory = $("#net_category").val();
            let naEngine = $('#networkEngineNA').val();
            let filename = queryTemp+"_"+fromDateStripped+"_"+toDateStripped+"_"+noOfNodesTemp+"_"+naTypeTemp;

            for(let i=0;i<mynetworks.length;i++){
                if(mynetworks[i] == filename){
                    message_displayer('Network already exists in My Networks with name &nbsp <b>'+ filename.split('_')[0] +"&nbsp"+ query_mynetworks_mapping[filename]+'</b>. Click on the network card in My Networks to bring it to active networks for analysis',"info");
                    return;
                }
            }

            networkGeneration('na/genNetwork', queryTemp, fromDateTemp, toDateTemp, noOfNodesTemp, naTypeTemp, filename,"enabled").then(response => {
               
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

                mynetworks_counter = mynetworks_counter + 1;
                query_mynetworks_mapping[filename] = "vis-"+mynetworks_counter;

                //generateCards(totalQueries, queryTemp, fromDateStripped, toDateStripped, noOfNodesTemp, naTypeTemp, naEngine, filename, 'naCards',"normal");
                message_displayer('Network successfully generated and added to My Networks with name &nbsp <b>'+ queryTemp+' '+ query_mynetworks_mapping[filename]+'</b> . Click on the card to move it to Active Networks',"success");

                let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
                let userID = userInfoTemp['id'];

                let data_query_track = {
                    "queryID" : filename,
                    "userID" : userID,
                    "query" : queryTemp,
                    "fromDate" : fromDateStripped,
                    "toDate" : toDateStripped,
                    "status" : "success",
                    "module_type" : "na"
                };
                    query_track("status",data_query_track).then(response => {
                    $('#mynetworks').empty();

                    mynetworks.push(filename);
                    populate_track(userID).then(response => {
                        $.each(response,function(key,value){
                            transferQueryToStatusTable_track(value["query"], value["queryID"], value["queryID"].split('_')[4], "algo_option", "sparkID");
                        })
                    })
                })
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
        currentviewingnetwork_name = filename;
        //showing_results_for(cardData);
        render_graph('na/graph_view_data_formator', filename).then(response => {
            // $("#networkDivid").append('<div class="loader justify-content-center"></div>');
           draw_graph(response, "networkDivid");
        });

        //updating network summary information
        $(".subject").empty();
        $(".subject").html(searchRecords[index - 1].query);
        $(".from_date").empty();
        $(".from_date").text(searchRecords[index - 1].from);
        $(".to_date").empty();
        $(".to_date").text(searchRecords[index - 1].to);

        $('html, body').animate({
            scrollTop: $("#messagebox").offset().top
          }, 900)

          let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
          let dir_name = userInfoTemp['id'];
          let data_for_net_stats = {
              input : filename,
              dir_name : dir_name
          }
        //   diameter('na/diameter', data_for_net_stats).then(response => {
        //     console.log(response);
        // });
    })
});
// jquery ended


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
    networkGeneration('na/genNetwork', queryTemp, fromDateTemp, toDateTemp, noOfNodesTemp, naTypeTemp, filename,"enabled").then(response => {
        generateCards(totalQueries, name_text, fromDateStripped, toDateStripped, noOfNodesTemp, naTypeTemp, naEngine, filename, 'naCards',"normal");
        message_displayer("Network generated successfully","success");
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
        message_displayer("Select a single network and proceed","error");
        return;   
    }

    var select_graph = selected_graph_ids();
    if(select_graph.length != 0){
        anyNetworkViewedYet = true;
    }
    let input = select_graph[0];
    $('.subject').html(queryDictionaryFilename[input]);
    render_graph('na/graph_view_data_formator', input).then(response => {
        draw_graph(response, "networkDivid");
    });
    currentViewTAB = "lpTabNA";
});

$("#centralityTab").on('click', function () {
    if(selected_graph_ids().length > 1){
        message_displayer("Select a single network and proceed","error");
        return;   
    }
    var select_graph = selected_graph_ids();
    if(select_graph.length != 0){
        anyNetworkViewedYet = true;
    }
    let input = select_graph[0];
    $('.subject').html(queryDictionaryFilename[input]);
    render_graph('na/graph_view_data_formator', input).then(response => {
        draw_graph(response, "networkDivid");
    });
    currentViewTAB = "centralityTab";
});



$("#spTab").on('click', function () {
    if(selected_graph_ids().length > 1){
        message_displayer("Select a single network and proceed","error");
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
    $('.subject').html(queryDictionaryFilename[input]);
    render_graph('na/graph_view_data_formator', input).then(response => {
        draw_graph(response, "networkDivid");
    });
    currentViewTAB = "spTab";
});

$("#commTab").on('click', function () {
    if(selected_graph_ids().length > 1){
        message_displayer("Select a single network and proceed","error");
        return;   
    }
    var select_graph = selected_graph_ids();
    if(select_graph.length != 0){
        anyNetworkViewedYet = true;
    }
    let input = select_graph[0];
    $('.subject').html(queryDictionaryFilename[input]);
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

    if(!$("#cardnamefileupload").val()){
        message_displayer("Name your network in the input box while uploading your file","error");
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
            message_displayer("Network imported successfully. click on the network card to view details","success");
            return; 
        }
    })
    .fail(function(res) {
        message_displayer("An unexpected error occur while uploading your network. check your inputs and try again. This may happen because of wrong file format","error");
        return;   
     })
    $('#myModal_file_upload').modal('toggle');
});


const generateCards = (id, query, fromDateTemp, toDateTemp, noOfNodesTemp, naTypeTemp, naEngine, filename, div, status) => {
    $("#hint_inside_na_cards").remove();
    let tempArr = [];
    tempArr = { 'id': id, 'query': query, 'from': fromDateTemp, 'to': toDateTemp, 'nodesNo': noOfNodesTemp, 'naType': naTypeTemp, 'filename': filename, 'naEngine': naEngine };
    searchRecords.push(tempArr);
    cardIDdictionary[id] = filename;
    queryDictionaryFilename[filename] = query;
    queryDictionaryNetworkName[filename] = naTypeTemp;

    if(status == "normal"){
        $('#' + div).append('<div class="col-sm-3" value="' + id + '"><div class="card shadow p-0"><div class="card-body p-0 border border-primary" style="border-radius: 24px;"><div class="d-flex px-3 pt-2"><span class="pull-left"><i id="deleteCard" class="fa fa-window-close text-neg" aria-hidden="true"></i></span><div class="naCardNum text-center ml-auto mr-auto">' + padNumber(id) + '</div><span class="pull-right ml-auto"><input class="form-check-input position-static" type="checkbox" style="margin-top: -1px;" id=' + filename + ' checked></span></div><div class="text-left networkCardDetails px-3 pb-3" style="border-radius:10px;" value="' + id + '" ><p class="font-weight-bold m-0 text-center" style="font-size:16px;" cardquery="' + query + '"> ' + query + '</p><p class="  smat-dash-title text-center" style="margin-top:-2px;margin-bottom:0px;">' + fromDateTemp + ' to '+toDateTemp+'</p><p class=" smat-dash-title text-center" style="margin-top:-2px;margin-bottom:0px;"> Nodes: ' + noOfNodesTemp + '</p><p class="  smat-dash-title text-center" style="margin-top:-2px;margin-bottom:0px;" > Type: ' + naTypeTemp + '</p><span class="d-flex justify-content-center smat-dash-title" style="margin-top:-2px;margin-bottom:0px;"><u>View Network</u></span></div></div></div></div>');
        currentOperation=null;
    }else if((status == "union")||(status == "intersection")||(status == "difference")){
        $('#' + div).append('<div class="col-sm-3" value="' + id + '"><div class="card shadow p-0"><div class="card-body p-0 border border-primary" style="border-radius: 24px;"><div class="d-flex px-3 pt-3"><span class="pull-left"><i id="deleteCard" class="fa fa-window-close text-neg" aria-hidden="true"></i></span><div class="naCardNum text-center ml-auto mr-auto">' + padNumber(id) + '</div><span class="pull-right ml-auto"><input class="form-check-input position-static" type="checkbox" style="margin-top: -1px;" id=' + filename + '></span></div><div class="text-left networkCardDetails px-3 pb-3" style="border-radius:10px;" value="' + id + '" ><p class="font-weight-bold m-0" style="font-size:16px;" cardquery="' + query + '"> ' + query + '</p><span class="d-flex justify-content-end smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"><u>View Network</u></span></div>');
        currentOperation=null;
    }else if(status == "afterdeletion"){
        $('#' + div).append('<div class="col-sm-3" value="' + id + '"><div class="card shadow p-0"><div class="card-body p-0 border border-primary" style="border-radius: 24px;"><div class="d-flex px-3 pt-3"><span class="pull-left"><i id="deleteCard" class="fa fa-window-close text-neg" aria-hidden="true"></i></span><div class="naCardNum text-center ml-auto mr-auto">' + padNumber(id) + '</div><span class="pull-right ml-auto"><input class="form-check-input position-static" type="checkbox" style="margin-top: -1px;" id=' + filename + '></span></div><div class="text-left networkCardDetails px-3 pb-3" style="border-radius:10px;" value="' + id + '" ><p class="font-weight-bold m-0" style="font-size:16px;" cardquery="' + query + '"> ' + query + '</p><span class="d-flex justify-content-end smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"><u>View Network</u></span></div>');
        currentOperation=null;
    }else if(status == "fileupload"){
        $('#' + div).append('<div class="col-sm-3" value="' + id + '"><div class="card shadow p-0"><div class="card-body p-0 border border-primary" style="border-radius: 24px;"><div class="d-flex px-3 pt-3"><span class="pull-left"><i id="deleteCard" class="fa fa-window-close text-neg" aria-hidden="true"></i></span><div class="naCardNum text-center ml-auto mr-auto">' + padNumber(id) + '</div><span class="pull-right ml-auto"><input class="form-check-input position-static" type="checkbox" style="margin-top: -1px;" id=' + filename + '></span></div><div class="text-left networkCardDetails px-3 pb-3" style="border-radius:10px;" value="' + id + '" ><p class="font-weight-bold m-0" style="font-size:16px;" cardquery="' + query + '"> ' + query + '</p><span class="d-flex justify-content-end smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"><u>View Network</u></span></div>');
        currentOperation=null;
    }

    if(totalNetworkatInstance > 0){
        $("#card-division").show();
        $("#net-smat-tabs").show();
        $("#net-analysis-summary").show();
        $("#queryDisplay").show();
        $("#naCards").css('overflow-x','auto');
        $("#naCards").css('height','200px');
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
        // $("#hint").show();
    }
});

$('body').on('click',"#deleteexpansionCard",function(){
    $(".custom-menu").hide();
});

$("#messagebox").on("click","#infopanel #deleteinfoCard", function () {
    $(this).parent().remove();
});


$("#show_summary_button_intersection").on("click",function(){

    if(summary_flag === true){
        $("#card_summary").hide();
        $("#card-division").removeClass("col-sm-8");
        $("#card-division").addClass("col-sm-12");
        $("#show_summary_button").text("Show Summary")
        summary_flag = false;
        }
    else{
        $("#card_summary").show();
        $("#card-division").removeClass("col-sm-12");
        $("#card-division").addClass("col-sm-8");
        $("#show_summary_button").text("Hide Summary");
        summary_flag = true;
    }
});


$("#show_summary_button_union").on("click",function(){

    if(summary_flag === true){
        $("#card_summary").hide();
        $("#card-division").removeClass("col-sm-8");
        $("#card-division").addClass("col-sm-12");
        $("#show_summary_button_union").text("Show Summary")
        summary_flag = false;
        }
    else{
        $("#card_summary").show();
        $("#card-division").removeClass("col-sm-12");
        $("#card-division").addClass("col-sm-8");
        $("#show_summary_button_union").text("Hide Summary");
        summary_flag = true;
    }
});


$("#show_summary_button_difference").on("click",function(){

    if(summary_flag === true){
        $("#card_summary").hide();
        $("#card-division").removeClass("col-sm-8");
        $("#card-division").addClass("col-sm-12");
        $("#show_summary_button_difference").text("Show Summary")
        summary_flag = false;
        }
    else{
        $("#card_summary").show();
        $("#card-division").removeClass("col-sm-12");
        $("#card-division").addClass("col-sm-8");
        $("#show_summary_button_difference").text("Hide Summary");
        summary_flag = true;
    }
});



$("#show_summary_button").on("click",function () {
    if(summary_flag === true){
        $("#card_summary").hide();
        $("#card-division").removeClass("col-sm-8");
        $("#card-division").addClass("col-sm-12");
        $("#show_summary_button").text("Show Summary")
        summary_flag = false;
        }
    else{
        $("#card_summary").show();
        $("#card-division").removeClass("col-sm-12");
        $("#card-division").addClass("col-sm-8");
        $("#show_summary_button").text("Hide Summary");
        summary_flag = true;
    }
});


function padNumber(d) {
    return (d < 10) ? d.toString() : d.toString();
    //return (d < 10) ? '0' + d.toString() : d.toString();
}

const showing_results_for = (cardData) => {
    let data = cardData;
    $('#naShowingResForTitle').text(data['query']);

}

export const getquerydictfilename = () =>{
    return queryDictionaryFilename;
}

export const naTypeTempforEXPs = () =>{
    return naTypeTempforEXP;
}

export const crr_viewing_network = () =>{
    return currentviewingnetwork_name;;
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
        $('.subject').html(queryDictionaryFilename[input]);
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
        $('#analysis_summary_charts').css("display", "block");
        $('.analysis_summary_div').empty();
        $(".analysis_summary_div").css("display", "none");
        if (currentNetworkEngine == "networkx") {
            render_centrality_graph(data["input"], "networkDivid", data["algo_option"],currentNetworkEngine).then(response => {
                chartBuilder(response["chartData"]);
                $('.analysis_summary_div').html('');
                $('.analysis_summary_div').append('<table class="table">  <thead> <tr><th>Node Rankings (Decreasing Order)</th><th>Score</th></tr>  </thead> <tbody id="tableBody"> </tbody></table>');
                for (var i = 0; i < response["nodes"].length; i++) {
                    $('#tableBody').append('<tr><td>'+'<a href="#target" class="click_events">'+ response["nodes"][i]["label"] +'</a>'+ '</td><td>' + parseFloat(response["nodes"][i]["size"]).toFixed(3) + '</td></tr>');
                }
                $('.analysis_summary_div').append('</table>');
                draw_graph(response, "networkDivid");
                message_displayer("centrality calculated successfully","success");
            });
        } else if (currentNetworkEngine == "spark") {
            let sparkID = response.id;
            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];

            if(!queryMetaData){
                message_displayer("click on the selected network card then proceed","error");
                return;
            }

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


$("#link_prediction_exec").on('click', function (NAType = $("#networkEngineNA").val(), algo_option) {
    var SOURCE = $("#link_source_node").val();

    if(SOURCE.charAt(0) != "#" && SOURCE.charAt(0) != "@"){
        SOURCE="*"+SOURCE;
    }

    if(selected_graph_ids().length != 1){
        message_displayer("select a single network","error");
        return;
    }

    var NAType = $("#networkEngineNA").val();
    algo_option = $("input[name='linkpredictionRadioOptions']:checked").val();
    var algo_option_global = algo_option;
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
        $('.subject').html(queryDictionaryFilename[input]);
        render_graph('na/graph_view_data_formator', input).then(response => {
            draw_graph(response, "networkDivid");
        });
    }

    if(!$("#link_source_node").val()){
        message_displayer("select a node","error");
        return;
    }else if(!$("#nos_links_to_be_predicted").val()){
        message_displayer("enter number of links to be predicted","error");
        return;
    }else if(!algo_option){
        message_displayer("select a link prediction algorithm choice","error");
        return;
    }else if((selected_graph_ids().length == 0)){
        message_displayer("select a network","error");
        return;
    }else if(selected_graph_ids().length > 1){
        message_displayer("select a single network","error");
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
                message_displayer("link prediction operation performed successfully","success");
                return;
            });
        } else if (currentNetworkEngine == "spark") {

            let sparkID = response.id;
            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];

            if(!queryMetaData){
                message_displayer("click on the selected network card then proceed","error");
                return;
            }

            transferQueryToStatusTable(queryMetaData, 'Link Prediction', algo_option_global, sparkID);
            function checkSparkStatus() {
                fetch('na/getsparkstatus/' + sparkID, {
                    method: 'get'
                }).then(response => response.json())
                    .then(response => {
                        if (response.state === 'success') {
                            let query_list = [algo_option, input];
                            storeResultofSparkFromController(sparkID, query_list, userID).then(response => {
                                makeShowBtnReadyAfterSuccess(sparkID, response.filename, 'linkprediction', algo_option_global,data["query_list"][1] );
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
        message_displayer("select a single network","error");
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
        $('.subject').html(queryDictionaryFilename[input]);
        render_graph('na/graph_view_data_formator', input).then(response => {
            draw_graph(response, "networkDivid");
        });
    }

    if(!src){
        message_displayer("select a source node","error");
        return;
    }else if(!dst){
        message_displayer("select a destination node","error");
        return;
    }else if(!algo_option){
        message_displayer("select a shortest path algorithm choice","error");
        return;
    }else if((selected_graph_ids().length == 0)){
        message_displayer("select a network","error");
        return;
    }else if(selected_graph_ids().length > 1){
        message_displayer("select a single network","error");
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
            message_displayer("shortest path operation performed successfully","success");
            return;
        } else if (currentNetworkEngine == "spark") {
            let sparkID = response.id;
            // Hardcoding the Shortest Path
            let algo_option = "ShortestPath"; 

            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];

            if(!queryMetaData){
                message_displayer("click on the selected network card then proceed","error");
                return;
            }

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
    community_algo_option = $(this).attr("algo");
});

$("#lpa").on("click", function () {
    community_algo_option = $(this).attr("algo");
    $("#noOfCommunities").hide();
});

$("#grivan").on("click", function () {
    community_algo_option = $(this).attr("algo");
    $("#noOfCommunities").hide();
});

$("#comm_exec").on('click', function (NAType = $("#NAEngine").val(), algo_option = "") {
    if(selected_graph_ids().length > 1){
        message_displayer("select a single network","error");
        return;
    }else if(selected_graph_ids().length == 0){
        message_displayer("select a single network","error");
        return;
    }
    NAType = $("#networkEngineNA").val();
    if (community_algo_option == "async") {
        algo_option = "async";
        if(!$("#noOfCommunities").val()){
            message_displayer("enter number of communities to be found","error");
            return;        
        }
    } else if (community_algo_option == "lpa") {
        algo_option = "lpa";
    } else if (community_algo_option == "grivan") {
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
        $('.subject').html(queryDictionaryFilename[input]);
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
            message_displayer("Community detection performed successfully","success");
        } else if (currentNetworkEngine == "spark") {

            let sparkID = response.id;
            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];

            if(!queryMetaData){
                message_displayer("click on the selected network card then proceed","error");
                return;
            }

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
        message_displayer("select at least 2 networks","error");
        return;
    }

    let selectedGraphs = selected_graph_ids();

    for(let i=0; i<selected_graph_ids().length; i++){
        if(i==0){
            wellformedquery = queryDictionaryFilename[selectedGraphs[i]];
        }else{
            wellformedquery = wellformedquery + "<strong> &nbsp &#8899 &nbsp </strong>"+ queryDictionaryFilename[selectedGraphs[i]];
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
                message_displayer("union operation performed successfully","success");
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
        message_displayer("select at least 2 networks","error");
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
            message_displayer("intersection operation performed successfully","success");
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
        message_displayer("select at least 2 networks","error");
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
        message_displayer("select your networks and input network ids comma separated. ex. 2,1","error");
        return;
    }

    let sequence = $("#difference_sequence").val().split(',');
    for (let i = 0; i < sequence.length; i++) {
        if(!(selected_graph_ids().includes(cardIDdictionary[sequence[i]]))){
            message_displayer("mismatch in input card id sequence and selected networks","error");
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
            message_displayer("Difference operation performed successfully","success");
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

const algoDict = { "degcen": 'Degree Centrality', "pgcen": "Page Rank Centrality", "adamicadar": "Adamic Adar", "jaccardcoeff": "Jaccard Coefficient", "resourceallocation": "Resource Allocation", "commonneighbor": "Common Neighbor", "lpa": "Label Propagation", "Shortest Path": "Single Shortest Path","btwncen":"Betweeness Centrality"};
const transferQueryToStatusTable = (data, operation, algo, sparkID = 123, renderDivID = 'networkDivid') => {
    $('#searchTable').css('display', 'block');
    let algoTitle = algoDict[algo];
    $('#naStatusTable').append('<tr><th scope="row">' + data.id + '</th><td>' + data.query + '</td><td>' + operation + ' (' + algoTitle + ')' + '</td><td>' + data.from + '</td><td>' + data.to + '</td><td  id="' + sparkID + 'Status">Running...</td><td><button class="btn btn-secondary smat-rounded mx-1 showBtn" value="' + data.id + '|' + sparkID + '|' + renderDivID + '"  id="' + sparkID + 'Btn" disabled > Show </button><button class="btn btn-neg mx-1  smat-rounded"> Delete </button></td></tr>');
    message_displayer("APACHE SPARK : Query submitted successfully","info");
}



const transferQueryToStatusTable_track = (query_name, queryID, natype, algo, sparkID = 123, renderDivID = 'networkDivid') => {
    $('#mynetworks').css('display', 'block');
    $("#mynetworks").prepend('<button class="btn alert alert-info mx-1 btn_mynetwork network_button" style="margin:5px" value="' + queryID + '"><b>'+query_name +"&nbsp"+ query_mynetworks_mapping[queryID]+'</b><br /></button>');
   if(network_del_db == "allowed"){
    $('body .btn_mynetwork').tooltip({title: "Click to delete network", html: true, placement: "bottom"}); 
   }else{
    $('body .btn_mynetwork').tooltip({title: "Click to use the network", html: true, placement: "bottom"}); 
   } 
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
    message_displayer("APACHE SPARK : Computation performed successfully. Click on show to get the results","success");
}

$('body #netdel').dblclick(function(event) {
    $("#netdel").css("opacity", "100%");
    network_del_db="allowed";
    $("#netview").css("opacity","30%");
    $("#modemsg").empty();
    $("#modemsg").html('<p class="d-flex text-muted  mb-1 text-center" style="font-size:0.8rem">Delete Mode Active</p>');
    $('body .btn_mynetwork').tooltip( "dispose" );
    $('body .btn_mynetwork').tooltip({title: "Click to delete the network", html: true, placement: "bottom"}); 
    $('body .btn_mynetwork').tooltip('enable'); 
});

$('body #netview').dblclick(function(event) {
    $("#netdel").css("opacity", "30%");
    network_del_db="notallowed";
    $("#netview").css("opacity","100%");
    $("#modemsg").empty();
    $("#modemsg").html('<p class="d-flex text-muted mb-1 text-center" style="font-size:0.8rem">View Mode Active</p>');
    $('body .btn_mynetwork').tooltip( "dispose" );
    $('body .btn_mynetwork').tooltip({title: "Click to use the network", html: true, placement: "bottom"}); 
    $('body .btn_mynetwork').tooltip('enable'); });
