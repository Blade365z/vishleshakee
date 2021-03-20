//API CALLS
//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};

import { getquerydictfilename,naTypeTempforEXPs,crr_viewing_network } from './NetworkAnalysis.js';

// Render Graph  for view
var network_global;
var network_global_expansion;
var coming_from_binary_ops = false;
var queryTempexp;
var global_edges;
var deletedNodes = [];
var update_node_list = [];
let image_icon;

export const chartBuilder = async(data)=> {
    var node_list = "";
    update_node_list = data;
    for(let i=0; i<data.length;i++){
        let round = data[i].value;
        let nodeNAME= data[i].key;
        nodeNAME = nodeNAME.substring(1);
        node_list = node_list+`<li class="list-group-item d-flex justify-content-between align-items-center text-truncate" style="font-size: large;"> <span class="font-weight-bold"> Rank: `+(i+1)+` </span><a href="#target" class="click_events" id= `+nodeNAME+`>`+data[i].key+`</a>
        <span class="badge badge-primary badge-pill">`+parseFloat(round).toFixed(3)+`</span>
        </li>`;
    }
    $('#analysis_summary_charts').empty();
    $("#analysis_summary_charts").append(`<div class="shadow analysis_chart_div" id="chartDiv" style="overflow-x:auto;overflow-y:auto;">

            </div>
            <div class="card mt-0" style=" margin-top:10px !important">
                <div class="card-body" id="infoDiv" style="overflow-x:auto;overflow-y: scroll;height: 310px;">
                <div class="analysis_info_div shadow">
                            
                </div>
                </div>
            </div>`);
    $(".analysis_info_div").empty();
    $(".analysis_info_div").append(`<ul class="list-group">`+node_list+`</ul>`);
    /**
     * ---------------------------------------
     * This demo was created using amCharts 4.
     * 
     * For more information visit
     * https://www.amcharts.com/
     * 
     * Documentation is available at:
     * https://www.amcharts.com/docs/v4/
     * ---------------------------------------
     */

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("analysis_chart_div", am4charts.XYChart);

    // Add data
    console.log(data);
    chart.data = data;

    // Create axes

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "key";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
    if (target.dataItem && target.dataItem.index & 2 == 2) {
        return dy + 25;
    }
    return dy;
    });
    categoryAxis.renderer.labels.template.disabled = true;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "key";
    series.name = "value";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;
    series.columns.template.events.on("over", function (ev) {
       console.log(ev.target.tooltipDataItem.categories.categoryX);
       node_highlighting(ev.target.tooltipDataItem.categories.categoryX);
       let mymsg = ev.target.tooltipDataItem.categories.categoryX;
       mymsg = mymsg.toString()
       $(ev.target.tooltipDataItem.categories.categoryX).html("<b>"+mymsg+"</b>");
       for(let i=0; i<update_node_list.length;i++){
            if(update_node_list[i].key != mymsg){
                $(update_node_list[i].key).html(update_node_list[i].key);
                console.log("OK");
            }
        }
    });


 
    var columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
}

function barChartBuilder(div_name,chart_data,title_text){
    console.log("Printing chart data");
    console.log(chart_data);
        /**
     * ---------------------------------------
     * This demo was created using amCharts 4.
     * 
     * For more information visit
     * https://www.amcharts.com/
     * 
     * Documentation is available at:
     * https://www.amcharts.com/docs/v4/
     * ---------------------------------------
     */

    // Themes begin


    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create(div_name, am4charts.XYChart);


    // Add data
    chart.data = chart_data;
    let title = chart.titles.create();
    title.text = title_text;
    title.fontSize = 15;
    title.marginBottom = 20;

    // Create axes

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "key";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
    if (target.dataItem && target.dataItem.index & 2 == 2) {
        return dy + 25;
    }
    return dy;
    });
    categoryAxis.renderer.labels.template.disabled = true;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "key";
    series.name = "value";
    series.columns.template.propertyFields.fill = "color";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;
    series.columns.template.events.on("over", function (ev) {
       console.log(ev.target.tooltipDataItem.categories.categoryX);
       node_highlighting(ev.target.tooltipDataItem.categories.categoryX);
    });
 
    var columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
}

function getmystoragedir(){
    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let userID = userInfoTemp['id'];
    return userID;
}

export const render_graph = async (url,input) => {
    let dir_name = getmystoragedir();
    let data = {
        input : input,
        dir_name: dir_name 
    }
    let response = await fetch(url,{
        method : 'post',
        headers : HeadersForApi,
        body : JSON.stringify(data),
    });
    
    let output = await response.json();
    return output;
}

export const message_displayer = async (msg,category) => {
    $("#messagebox").empty();
    if(category == "info"){
        $("#messagebox").append('<div class="d-flex justify-content-center alert alert-info" role="alert"> <strong>Information : </strong>&nbsp'+ msg +'</div>');
    }else if(category == "error"){
        $("#messagebox").append('<div class="d-flex justify-content-center alert alert-danger" role="alert"><strong> Error : </strong>&nbsp'+ msg +'</div>');
    }else if(category == "success"){
        $("#messagebox").append('<div class="d-flex justify-content-center alert alert-success" role="alert"><strong> Success : </strong>&nbsp'+ msg +'</div>');
    }else if(category == "generation"){
        $("#messagebox").append('<div class="d-flex justify-content-center alert alert-info" role="alert"> <strong role="status" class=" spinner-border text-primary float-right" style="height:1rem;width:1rem"></strong>&nbsp&nbsp&nbsp&nbsp'+ msg +'</div>');
    }
}


export const networkGeneration = async (url,queryTemp,fromDateTemp,toDateTemp,noOfNodesTemp,naTypeTemp,filename,msgbox, pname=null) => {
    if(msgbox == "enabled"){
        message_displayer("Generating your requested network","generation");
    }else{

    }
    let dir_name = getmystoragedir();
    
    let data = {
        token : queryTemp,
        fd : fromDateTemp,
        td : toDateTemp,
        noOfNodes : noOfNodesTemp,
        nettype : naTypeTemp,
        filename : filename,
        dir_name : dir_name,
        pname: pname
    };

    let response = await fetch(url,{
        method : 'post',
        headers : HeadersForApi,
        body : JSON.stringify(data),
    });
    let output = await response.json();
    return output;
}


export const linkprediction = async (url,data,NAType) =>{
    let response = await fetch(url,{
        method : 'post',
        headers: HeadersForApi,
        body : JSON.stringify(data),
    });
    let output = await response.json();
    return output;
}


export const render_linkprediction_graph = async (input,src) => {
    let dir_name = getmystoragedir();
    let source = src;
    let data = {
        input: input,
        src: source,
        dir_name: dir_name
    };
    let response = await fetch('na/link_prediction_data_formator',{
        method : 'post',
        headers: HeadersForApi,
        body : JSON.stringify(data),
    });
    let output = await response.json();
    return output;
}

export const update_view_graph_for_link_prediction = (res,src,k_value) => {

    
    var query_index_label;

    if(src.charAt(0) != "#" && src.charAt(0) != "@" && src.charAt(0) != "*" && src.charAt(0) != "$"){
        src = "*"+src;
    }

    for (var i = 0; (i < res.length); i++) {
        if(res[i].id.charAt(0) != "#" && res[i].id.charAt(0) != "@" && res[i].id.charAt(0) != "*" && res[i].id.charAt(0) != "$" ){
            res[i].id = "*"+res[i].id;
        }
        if (res[i].id == src) {
            query_index_label = i;
            network_global.body.data.nodes._data[res[i].id].color = "brown";
            network_global.body.data.nodes._data[res[i].id].size = 40;
        } else {
            network_global.body.data.nodes._data[res[i].id].color = "#ffa500";
            network_global.body.data.nodes._data[res[i].id].size = 40;
        }
    }

    var new_array = [];
    $.each(network_global.body.data.nodes._data, function(index, value) {
        new_array.push(value);
    });

    var new_array_e = [];
    $.each(network_global.body.data.edges._data, function(index, value) {
        new_array_e.push(value);
    });

    var ed = [];
    var edges = [];


    let linkcutoff = 0;


    for (var i = 0;((i < res.length)); i++) {
        if( linkcutoff < k_value){
            if(res[i].id.charAt(0) == "$"){
                continue;
            }
            if (res[i].id != res[query_index_label].id) {
                ed.push({
                    from: res[query_index_label].id,
                    to: res[i].id,
                    width: 10,
                    dashes: true,
                    color: "red"
                });
                linkcutoff++;
            }
        }
    }


    $('#analysis_summary_charts').css("display", "none");
    $('#analysis_summary_charts').empty();
    $('.analysis_summary_div').empty();
    $(".analysis_summary_div").css("display", "block");

    $('.analysis_summary_div').append('<table> <tr><th style="width:20px">Rank</th><th style="width:30px">Source</th><th style="width:340px">Predicted Destination</th></tr>');
    // $('.analysis_summary_div').empty();
    let j = 0;
    for (var i = 0; ((i < res.length) && (j < k_value)); i++) {
        if (src == res[i].id) {
            continue;
        }

        if(src.charAt(0) == "*"){
            src = src.substring(1); 
        }

        if(res[i].id.charAt(0) == "*"){
            res[i].id =  res[i].id.substring(1);
        }

        j++;
        $('.analysis_summary_div').append('<tr><td style="width:20px">'+(i+1)+'</td><td style="width:30px">'+'<a href="#target" class="click_events">'+ src +'</a>'+'</td><td style="width:340px">' + res[i].id + '</td></tr>');
    }
    $('.analysis_summary_div').append('</table>');

    network_global.body.data.nodes.update(new_array);
    network_global.body.data.edges.update(ed);
}

export const centrality = async (url,data,NAType) =>{
    let response = await fetch(url,{
        method : 'post',
        headers: HeadersForApi,
        body : JSON.stringify(data),
    });

    let output = await response.json();
    return output;
}

export const diameter = async(url,data) =>{
    let response = await fetch(url,{
        method : "post",
        headers: HeadersForApi,
        body : JSON.stringify(data),
    })

    let output = await response.json();
    return output;
}

export const query_track = async (url,data) =>{
    let response = await fetch(url,{
        method : 'post',
        headers: HeadersForApi,
        body : JSON.stringify(data),
    });

    let output = await response.json();
    return output;
}


export const populate_track = async (id) =>{
    let response = await fetch('status/'+id,{
        method : 'post',
        headers: HeadersForApi,
        body : JSON.stringify({
            mode:'na'
        }),
    });


    let output = await response.json();
    return output;
}

export const delete_queries_from_db = async (input,userID) =>{
    let response = await fetch('destroynets',{
        method : 'post',
        headers: HeadersForApi,
        body : JSON.stringify({
            mode:'na',
            queryID:input,
            userID:userID
        }),
    });

    console.log(response);

    let output = await response.json();
    return output;
}

export const render_centrality_graph = async (input,id_value,algo_option,currentNetworkEngine) =>{
    let dir_name = getmystoragedir();
    let data = {input : input, algo_option : algo_option, dir_name: dir_name, engine: currentNetworkEngine};
    let response = await fetch('na/centrality_data_formator',{
        method : 'post',
        headers : HeadersForApi,
        body : JSON.stringify(data),
    });

    let res = await response.json();
    return res;
}

export const community_detection = async (url,data,NAType) =>{
    console.log("My Data",data);
    let response = await fetch(url,{
        method : 'post',
        headers: HeadersForApi,
        body : JSON.stringify(data),
    });

    let output = await response.json();
    return output;
}

export const render_community_graph1 = async (input) => {
    let dir_name = getmystoragedir();
    console.log("Printing community params");
    let data = {
        input : input,
        dir_name : dir_name
    };

    console.log(data);

    let response = await fetch('na/community_data_formator',{
        method : 'post',
        headers : HeadersForApi,
        body : JSON.stringify(data),
    });

    let output = await response.json();
    return output;
}

export const render_graph_community = (res,id_value) =>{
    $('#analysis_summary_charts').empty();
    $('.NeighborsDiv').hide();
    $('#analysis_summary_charts').css("display", "block");
    $("#analysis_summary_charts").append(`<div class="shadow analysis_chart_div" id="chartDiv" style="overflow-x:auto;overflow-y:auto;"></div>
        <div class="shadow analysis_chart_div" id="chartDiv1" style="overflow-x:auto;overflow-y:auto;"></div>`);

    console.log("Printing COM");
    console.log(res);
    console.log(res["groups"]);

    var nodes_arr = res["nodes"];
    var edges_arr = res["edges"];

    let temp_community_number = 0;
    var data_node = [];

    $.each(res["groups"], function(key, value){
        var temp = {};
        temp["key"] = "Community "+String(temp_community_number + 1);
        temp["value"] = value.length;
        if((temp_community_number +1) == 1){
            temp["color"] = "blue";
            console.log("COL1");
        }else if((temp_community_number +1) == 2){
            temp["color"] = "yellow";
            console.log("COL2");
        }else if((temp_community_number +1) == 3){
            temp["color"] = "red";
        }else if((temp_community_number +1) == 4){
            temp["color"] = "green";
        }else if((temp_community_number +1) == 5){
            temp["color"] = "pink";
        }else if((temp_community_number +1) == 6){
            temp["color"] = "purple";
        }else if((temp_community_number +1) == 7){
            temp["color"] = "orange";
        }else if((temp_community_number +1) == 8){
            temp["color"] = "brown";
        }else if((temp_community_number +1) == 9){
            temp["color"] = "black";
        }
        data_node.push(temp);
        temp_community_number = temp_community_number+1;
    });

    let temp_edge_community_number = 0;
    var data_edge = [];
    if(res["interCommunityEdges"].length >= 1){
        res["interCommunityEdges"].forEach(function(v){
            var temp = {};
            temp["key"] = "Community "+String(temp_edge_community_number + 1);
            temp["value"] = v;
            data_edge.push(temp);
            if((temp_edge_community_number +1) == 1){
                temp["color"] = "blue";
                console.log("COL1");
            }else if((temp_edge_community_number +1) == 2){
                temp["color"] = "yellow";
                console.log("COL2");
            }else if((temp_edge_community_number +1) == 3){
                temp["color"] = "red";
            }else if((temp_edge_community_number +1) == 4){
                temp["color"] = "green";
            }else if((temp_edge_community_number +1) == 5){
                temp["color"] = "pink";
            }else if((temp_edge_community_number +1) == 6){
                temp["color"] = "purple";
            }else if((temp_edge_community_number +1) == 7){
                temp["color"] = "orange";
            }else if((temp_edge_community_number +1) == 8){
                temp["color"] = "brow";
            }else if((temp_edge_community_number +1) == 9){
                temp["color"] = "black";
            }
            temp_edge_community_number = temp_edge_community_number+1;
        });
    }

    barChartBuilder("chartDiv",data_node,"Nodes in each Communities");
    barChartBuilder("chartDiv1",data_edge,"Intra Community Edges");

    

    $('.analysis_summary_div').empty();
    $(".analysis_summary_div").css("display", "none");
    $('#analysis_summary_charts').append('<div id="mydiv" style="height:250px;width:420px;overflow:scroll;">');
    $('#mydiv').append('<table class="table table-sm"><thead><tr><th scope="col">Community No.</th><th scope="col">Community Members</th></tr></thead>');
    $('#mydiv').append("<tbody>");
    for(var i=0; i<res["groups"].length;i++){
        $('#mydiv').append('<tr><th scope="row" > <a href="#target" class="click_events_community">'+(i+1)+'</th><td style="width:30px">'+res["groups"][i]+'</td></tr>');
    }
    $('#mydiv').append("</tbody>");
    $('#mydiv').append('</table>');
    
    const groupsN = res["groups"].length;
    
    const groups = []
    for (let i = 1; i <= groupsN; i++) {
        groups.push(i)
    }
    

    const visNodes = []
    $.each(nodes_arr, function(index, value) {        
        visNodes.push({
           "id": value.id,
           "label": value.label,
           "group": value.group+1,
           "size": 25,
           "font": { size: 25 }
        });
    });


    const visEdges = []
    $.each(edges_arr, function(index, value) {
        visEdges.push({
            "from": value.from,
            "to": value.to,
            "label": value.label
        });
    });
    
    var nodes = new vis.DataSet();
    var edges = new vis.DataSet();
    edges.add(visEdges);

    console.log(visNodes);
    // console.log(visEdges);
    console.log(groups);

    computeNodesPositionsDistricts(visNodes, groups);
    nodes.add(visNodes);

    // create a network
    var container = document.getElementById(id_value);
    var data = {
        nodes: nodes,
        edges: edges
    };

    var options = {
        nodes: {
            shape: 'dot',
            scaling: {
                min: 10,
                max: 30
            },
            font: {
                size: 30,
                face: 'courier'
            },
            borderWidth: 1,
            // shadow: true
        },
        physics:
        {
            enabled: false
        }
    }

    network_global = new vis.Network(container, data, options);
    network_global.on('afterDrawing', (ctx) => afterNetworkDrawing(network_global, ctx));

    // to add node dynamically
    // $.each(nodes_arr, function(index, value) {        
    //     nodes.add({
    //        "id": value.id,
    //        "label": value.label,
    //        "group": value.group,
    //        "size": 25,
    //        "font": { size: 25 }
    //     });
    // });
    

    // to add edges dynamically
    // setTimeout(function() {
    //     $.each(edges_arr, function(index, value) {
    //         setTimeout(function() {
    //             edges.add({
    //                 "from": value.from,
    //                 "to": value.to,
    //                 "label": value.label
    //             });
    //         }, 10);
    //     });
    // }, 10000);
    
var scaleOption = {scale:0.3};
network_global.moveTo(scaleOption);

}

setRGBAColorAlpha = (startingColor, targetAlpha) => {
    let c = startingColor
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(startingColor)) {
        c = startingColor.substring(1).split('')
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]]
        }
        c = `0x${c.join('')}`
        return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')}, ${targetAlpha})`
    } else return c
}
afterNetworkDrawing = (network, ctx) => {
    const groupsPoints = {}
    for (const node of network.body.data.nodes.get()) {
        const nodePosition = network.getPositions([node.id])
        if (nodePosition[node.id]) {
            if (!groupsPoints[node.group]) groupsPoints[node.group] = []
            groupsPoints[node.group].push({ x: nodePosition[node.id].x, y: nodePosition[node.id].y })
        }
    }

    ctx.lineWidth = 5

    for (const group in groupsPoints) {
        const convexPoints = convexHull(groupsPoints[group])
        const groupColor = network.groups.groups[group].color.background

        ctx.fillStyle = setRGBAColorAlpha(groupColor, 0.2)
        ctx.beginPath()
        ctx.moveTo(convexPoints[0].x, convexPoints[0].y)
        for (let i = 1; i < convexPoints.length; i++) {
            ctx.lineTo(convexPoints[i].x, convexPoints[i].y)
        }
        ctx.closePath()
        ctx.fill()

        ctx.strokeStyle = setRGBAColorAlpha(groupColor, 0.3)
        ctx.stroke()
    }
}

export const node_highlighting = async(input) =>{
    
    //network_global.body.data.nodes._data[input].size = 100;
    $.each(network_global.body.data.nodes._data, function(index, value) {
        if (value.id == input) {
            network_global.body.data.nodes._data[input].font.size = 150;
            network_global.body.data.nodes._data[input].font.color = "red";
        } else {
            network_global.body.data.nodes._data[value.id].font.size = 30;
            network_global.body.data.nodes._data[input].font.color = "black";
        }
    });

    let new_array = [];
    $.each(network_global.body.data.nodes._data, function(index, value) {
        new_array.push(value);
    });
    network_global.body.data.nodes.update(new_array);
}

export const node_highlighting_community = async(input) =>{
    console.log(network_global);
    console.log("The input value is");
    console.log(input);
    $.each(network_global.body.data.nodes._data, function(index, value) {
        console.log("Value");
        console.log(value);
        let new_value = value.id;
        console.log("Printing new_value");
        console.log(new_value);
        console.log("Printing value of input");
        console.log(input);
        console.log("network_global_community.body.data.nodes._data[new_value].group ");
        console.log(network_global.body.data.nodes._data[new_value].group);

        if (network_global.body.data.nodes._data[new_value].group == input) {
            network_global.body.data.nodes._data[new_value].size = 100;
            network_global.body.data.nodes._data[new_value].font.size = 150;
        } else {
            network_global.body.data.nodes._data[new_value].size = 25;
            network_global.body.data.nodes._data[new_value].font.size = 25;
        }
    });

    let new_array = [];
    $.each(network_global.body.data.nodes._data, function(index, value, input) {
        new_array.push(value);
    });
    network_global.body.data.nodes.update(new_array);
}

export const shortestpaths = async (url,data,NAType) =>{
    message_displayer("Calculating shortest paths","info");
    let response = await fetch(url,{
        method : 'post',
        headers: HeadersForApi,
        body : JSON.stringify(data),
    });

    let output = await response.json();
    return output;
}

export const render_shortestpath_graph = (input, src_id, dst_id) => {
// Render Shortest Path Graph 
    let dir_name = getmystoragedir();
    $.ajax({
            url: 'na/shortest_path_data_formator',
            type: 'GET',
            dataType: 'JSON',
            data: {
                input: input,
                src: src_id,
                dst: dst_id,
                dir_name:dir_name
            }
        })
        .done(function(res) {
            update_sp_graph(res);
        })
        .fail(function(res) {
            console.log(res);
            message_displayer("An unexpected error occured while processing your request. Refresh the page and try again.","error");
            return;
        })
    }

    export const update_sp_graph = (res) =>  {

        $('#analysis_summary_charts').css("display", "none");
        $('.analysis_summary_div').empty();
        $(".analysis_summary_div").css("display", "block");

        // $('.analysis_summary_div').empty();
        $('.analysis_summary_div').append('<table> <tr><th style="width:20px">Sl No.</th><th style="width:350px">Path</th><th style="width:30px">Path Length</th></tr>');
        if(res["paths"].length > 1){
            for(var per=0;per<res["paths"].length;per++){
                console.log("I am haha",res["paths"][per]);
                    $('.analysis_summary_div').append('<tr><td style="width:20px">'+(per+1)+'</td><td style="width:340px">'+res["paths"][per]+'</td><td style="width:40px">'+(res["paths"][per].length - 1)+'</td></tr>');
            }
            $('.analysis_summary_div').append('</table>');
        }else{
            for(var i=0; i<res["paths"].length;i++){
                console.log("I am haha",res["paths"]);
                $('.analysis_summary_div').append('<tr><td style="width:20px">'+(i+1)+'</td><td style="width:340px">'+res["paths"]+'</td><td style="width:40px">'+(res["paths"][0].length - 1)+'</td></tr>');
            }
            $('.analysis_summary_div').append('</table>');
        }

        // Bug exists in shortest path NEED to BE CHECKED 

         res["result"] = res["result"].filter(function (el) {
            return el != null;
          });

        for (var i = 1; i <= res["result"].length - 2; i++) {
            if ((res["result"][i] != res["result"][0]) && (res["result"][i] != res["result"][res["result"].length - 1]) && (res["result"][i] != null)) {
                network_global.body.data.nodes._data[res["result"][i]].color = "#ffa500";
                network_global.body.data.nodes._data[res["result"][i]].size = 100;
            } else {
                network_global.body.data.nodes._data[res["result"][i]].color = "#307CE9";
                network_global.body.data.nodes._data[res["result"][i]].size = 25;
            }
        }

        $.each(network_global.body.data.nodes._data, function(index, value) {
            if (!res["result"].includes(value.id)) {
                value.color = "#307CE9";
                value.size = 25;
            }
        });

        network_global.body.data.nodes._data[res["result"][res["result"].length - 1]].color = "brown";
        network_global.body.data.nodes._data[res["result"][res["result"].length - 1]].size = 100;

        network_global.body.data.nodes._data[res["result"][0]].color = "brown";
        network_global.body.data.nodes._data[res["result"][0]].size = 100;

        var new_array = [];
        $.each(network_global.body.data.nodes._data, function(index, value) {
            new_array.push(value);
        });

        var new_array_e = [];
        $.each(network_global.body.data.edges._data, function(index, value) {
            new_array_e.push(value);
        });

        // Set all edges witdhs to a normal
        for (var i = 0; i < new_array_e.length; i++) {
            var identity = new_array_e[i].id;
            for (var j = 0; j < res["result"].length; j++) {
                network_global.body.data.edges._data[identity].width = 0.5;
            }
        }

        // Update the width of path 
        for (var i = 0; i < new_array_e.length; i++) {
            var identity = new_array_e[i].id;
            for (j = 0; j < res["result"].length; j++) {
                if (((new_array_e[i].from == res["result"][j]) && (new_array_e[i].to == res["result"][j + 1])) || ((new_array_e[i].from == res["result"][j + 1]) && (new_array_e[i].to == res["result"][j]))) {
                    network_global.body.data.edges._data[identity].width = 35;
                }
            }

        }

        var new_array_e1 = [];
        $.each(network_global.body.data.edges._data, function(index, value) {
            new_array_e1.push(value);
        });

        network_global.body.data.nodes.update(new_array);
        network_global.body.data.edges.update(new_array_e1);

    var scaleOption = {scale:0.3};
    network_global.moveTo(scaleOption);

    }

export const expansion = (node,hops) => {
    $.ajax({
        // url: 'network_analysis/expansion',
        url: 'network_analysis/expansion_on_demand',
        type: 'POST',
        // dataType: 'JSON',
        dataType: 'JSON',
        data: {
            input: JSON.stringify(global_edges),
            uniqueid: unique_id,
            clicked_node: node_to_be_expanded[0],
            input: query,
            fromdate: fd,
            todate: td,
            network_choice: global_network_type_selected,
            hop_limit: hop_limit,
            hop_count: hop_count,
            limit: limit_value,
            select_framework_val: select_framework_val

        },
        beforeSend: function() {
        },
        success: function(data) {

       }
    })
    .fail(function(res) {
    })
}

export const draw_graph = (res,id_value) => {
    coming_from_binary_ops = false;
    var nodes_arr = res["nodes"];
    var edges_arr = res["edges"];



    // update in network information division
    $(".nos_of_nodes").empty();
    $(".nos_of_nodes").text(nodes_arr.length);
    $(".nos_of_edges").empty();
    $(".nos_of_edges").text(edges_arr.length);

    $('.analysis_summary_div').html('');

    var nodes = new vis.DataSet();
    var edges = new vis.DataSet();

    // create a network
    //var container = document.getElementsByClassName(id_value);
    var container = document.getElementById(id_value);

    var data = {
        nodes: nodes,
        edges: edges
    };

    network_global = new vis.Network(container, data, global_options);
    

    network_global.focus(1, {
        scale: 1
    });

    // number of nodes

    // to add node dynamically
    // $(".loader").remove();
    $.each(nodes_arr, function(index, value) {
        nodes.add({
            "id": value.id,
            "label": value.label,
            "shape": value.shape,
            "image": value.image,
            "size": value.size,
            "borderWidth": value.borderwidth,
            "border": value.border,
            "color":{
                background: '#FFFFFF'
            },
            "font": {
                "size": 30
            }
        });
    });


    // to add edges dynamically
    $.each(edges_arr, function(index, value) {
        setTimeout(function() {
            edges.add({
                "from": value.from,
                "to": value.to,
                "label": value.label
            });

        }, 10);
    });

    network_global.on('doubleClick', function(properties) {
        if(properties.nodes[0] == null){
        
        }else{
            $("#delete_permission").modal('show');
            $("#permission_granted").click(function() {
               global_edges = delete_node(properties,data);
               if(!deletedNodes.includes(properties.nodes[0])){
                deletedNodes.push(properties.nodes[0]);
               }
            });
        }
    });

    network_global.on('oncontext',function(properties){
        event.preventDefault();
    
        //Show contextmenu
        $(".custom-menu").finish().toggle(100).
        
        // In the right position (the mouse)
        css({
            top: event.pageY + "px",
            left: event.pageX + "px"
        });
        document.addEventListener('contextmenu', event => event.preventDefault());
        queryTempexp = network_global.getNodeAt(properties.pointer.DOM);
        network_global_expansion = network_global;
        $("#expansionnodename").empty();
        $("#expansionnodename").append(queryTempexp);
    });


    network_global.on('selectNode', function(properties) {
        var len1 = properties.nodes.length;
        if (len1 >= 2) {
            $("#sourceSp").val(network_global.body.data.nodes._data[properties.nodes[len1 - 2]].label);
            $("#destSp").val(network_global.body.data.nodes._data[properties.nodes[len1 - 1]].label);
            $("#sourceSp").attr("placeholder",properties.nodes[len1 - 2]);
            $("#destSp").attr("placeholder",properties.nodes[len1 - 1]);
        } else {
            $("#link_source_node").val(network_global.body.data.nodes._data[properties.nodes[len1 - 1]].label);
            $("#link_source_node").attr("placeholder",properties.nodes[len1 - 1]);
        }
    });

    network_global.on('hoverNode', function(properties) {
            on_hover_change_color_of_neighbournodes(properties, nodes);
    });

    network_global.on('blurNode', function() {
            on_hover_out_set_back(nodes);
    });

    var scaleOption = {scale:0.18};
    network_global.moveTo(scaleOption);
}

$('body').on("click","#expand_from_list",function(){
    document.addEventListener('contextmenu', event => event.preventDefault());
    queryTempexp = $('#expand_from_list').val().trim();;
    network_global_expansion = network_global;
    $("#expansionnodename").empty();
    $("#expansionnodename").append(queryTempexp);

    $(".custom-menu").hide();
    let fromDateTemp = $('#fromDateNA').val();
    let fromDateStripped = fromDateTemp;
    fromDateTemp = fromDateTemp + " 00:00:00";
    let toDateTemp = $('#toDateNA').val();
    let toDateStripped = toDateTemp;
    toDateTemp = toDateTemp + " 00:00:00";
    let noOfNodesTemp = $('#expandupto').val().trim();
    let naTypeTemp;
    if(crr_viewing_network() == null){
        naTypeTemp = selected_graph_ids()[0].split('_')[4];
    }else{
        naTypeTemp = crr_viewing_network().split('_')[4];
    }
    console.log(selected_graph_ids());
    console.log("I am printing net global",network_global_expansion);
    networkGeneration('na/expansion',queryTempexp, fromDateTemp, toDateTemp, noOfNodesTemp, naTypeTemp,"disabled").then(response => {
    console.log("Hello Expander",response);

    let newly_incoming_nodes = Array();
    let newly_incoming_edges = Array();
    let previous_nodes = Array();
    let nodes_to_be_pushed = Array();
    let previous_edges = Array();
    
    $.each(network_global_expansion.body.data.nodes._data, function(index, value) {
        previous_nodes.push(value.id);
    });  

    $.each(network_global_expansion.body.data.edges._data, function(index, value) {
        previous_edges.push({'from':value.from,'to':value.to,'label':value.label});
    });

    $.each(response,function(index,value){
        newly_incoming_nodes.push(value[0]);
        newly_incoming_nodes.push(value[1]);
        let one_edge = {"from":value[0],"to":value[1],"label":value[2]};
        newly_incoming_edges.push(one_edge);
    });

    
    let newly_incoming_nodes_unique = [];
    $.each(newly_incoming_nodes, function(i, e) {
        if ($.inArray(e, newly_incoming_nodes_unique) == -1) newly_incoming_nodes_unique.push(e);
    });
        
    
    $.each(newly_incoming_nodes_unique, function(index, value) {
        if (($.inArray(value, previous_nodes)) == -1) {
            if(coming_from_binary_ops==true){
                var new_value = {
                    "id": value,
                    "label": value,
                    "color": "#FF8C00",
                    "shape" : 'dot',
                    "size": 30,
                    "font": {
                        "size": 25
                    },
                    "x":Math.floor(Math.random() * 5000),
                    "y":Math.floor(Math.random() * 2000)
                };            
            }else{
                if(naTypeTemp == "Hashtag-Hashtag"){
                     image_icon = "public/icons/hashtag.svg"
                }else if(naTypeTemp == "Mention-Mention"){
                     image_icon = "public/icons/roshanmention.jpg"
                }
                var new_value = {
                    "id": value,
                    "label": value,
                    "color": "red",
                    "image":image_icon,
                    "shape" : 'circularImage',
                    "size": 80,
                    "font": {
                        "size": 25
                    },
                };
            }

            nodes_to_be_pushed.push(new_value);
        }
    });
    network_global_expansion.body.data.nodes.add(nodes_to_be_pushed); 
    network_global_expansion.body.data.edges.add(newly_incoming_edges);

    console.log("global EDG before",global_edges);
    global_edges = $.merge(previous_edges,newly_incoming_edges);
    console.log(global_edges);  
    $('#analysis_summary_charts').css("display", "none");
    $('.NeighborsDiv').empty();   
    $('.analysis_summary_div').css("display", "block");   

    $('.NeighborsDiv').append('<table> <tr><th style="width:20px">New incoming members after expanding - <b>'+queryTempexp+' &nbsp </b></th></tr>');

    if(nodes_to_be_pushed.length==0){
        $('.NeighborsDiv').append('<br /> No neighbors found within the expansion limit');
    }

    for(let i = 0; i < nodes_to_be_pushed.length; i++){
        $('.NeighborsDiv').append('<tr><td style="width:500px"> <a href="#target" class="click_events">'+nodes_to_be_pushed[i].id+'</a> &nbsp <label class="float-right">Expand by <input type="number"  name=" nodes" class="border smat-rounded center" value="5" id="expandupto" placeholder="Number of Nodes" style="border:8px; widows: 10px;width: 50px;padding: 1px;" autocomplete="OFF" required>  nodes <button style="padding: 5px;width: 60px;margin-bottom:13px" type="button" value='+nodes_to_be_pushed[i].id+' id="expand_from_list" data-dismiss="modal" class="btn btn-primary">GO</button></label></td></tr></table>');
    } 
  });

});

$('body').on("click","#expand_now",function(network_global){
    $(".custom-menu").hide();
    let fromDateTemp = $('#fromDateNA').val();
    let fromDateStripped = fromDateTemp;
    fromDateTemp = fromDateTemp + " 00:00:00";
    let toDateTemp = $('#toDateNA').val();
    let toDateStripped = toDateTemp;
    toDateTemp = toDateTemp + " 00:00:00";
    let noOfNodesTemp = $('#expandupto').val().trim();
    if(crr_viewing_network() == null){
         naTypeTemp = selected_graph_ids()[0].split('_')[4];
    }else{
         naTypeTemp = crr_viewing_network().split('_')[4];
    }
    networkGeneration('na/expansion',queryTempexp, fromDateTemp, toDateTemp, noOfNodesTemp, naTypeTemp=naTypeTemp,"disabled").then(response => {

    let newly_incoming_nodes = Array();
    let newly_incoming_edges = Array();
    let previous_nodes = Array();
    let nodes_to_be_pushed = Array();
    let previous_edges = Array();

    
    $.each(network_global_expansion.body.data.nodes._data, function(index, value) {
        previous_nodes.push(value.id);
    });  

    $.each(network_global_expansion.body.data.edges._data, function(index, value) {
        previous_edges.push({'from':value.from,'to':value.to,'label':value.label});
    });

    $.each(response,function(index,value){
        newly_incoming_nodes.push(value[0]);
        newly_incoming_nodes.push(value[1]);
        let one_edge = {"from":value[0],"to":value[1],"label":value[2]};
        newly_incoming_edges.push(one_edge);
    });

    
    let newly_incoming_nodes_unique = [];
    $.each(newly_incoming_nodes, function(i, e) {
        if ($.inArray(e, newly_incoming_nodes_unique) == -1) newly_incoming_nodes_unique.push(e);
    });
        
    
    
    $.each(newly_incoming_nodes_unique, function(index, value) {
        if (($.inArray(value, previous_nodes)) == -1) {
            if(coming_from_binary_ops==true){
                var new_value = {
                    "id": value,
                    "label": value,
                    "color": "#FF8C00",
                    "shape" : 'dot',
                    "size": 35,
                    "font": {
                        "size": 50
                    },
                    "x":Math.floor(Math.random() * 5000),
                    "y":Math.floor(Math.random() * 2000)
                };            
            }else{
                if(naTypeTemp == "Hashtag-Hashtag"){
                     image_icon = "public/icons/hashtag.svg"
                }else if(naTypeTemp == "Mention-Mention"){
                     image_icon = "public/icons/roshanmention.jpg"
                }
                var new_value = {
                    "id": value,
                    "label": value,
                    "color": "red",
                    "image":image_icon,
                    "shape" : 'circularImage',
                    "size": 80,
                    "font": {
                        "size": 25
                    },
                };
            }

            nodes_to_be_pushed.push(new_value);
        }
    });

    network_global_expansion.body.data.nodes.add(nodes_to_be_pushed); 
    network_global_expansion.body.data.edges.add(newly_incoming_edges);
    global_edges = $.merge(previous_edges,newly_incoming_edges);  
    $('#analysis_summary_charts').css("display", "none");
    $('.NeighborsDiv').empty();   
    $('.analysis_summary_div').css("display", "block");   

    $('.NeighborsDiv').append('<table> <tr><th style="width:20px">New incoming members after expanding - <b>'+queryTempexp+' &nbsp </b></th></tr>');

    for(let i = 0; i < nodes_to_be_pushed.length; i++){
        $('.NeighborsDiv').append('<tr><td style="width:500px"> <a href="#target" class="click_events">'+nodes_to_be_pushed[i].id+'</a> <label class="float-right"> Expand by &nbsp <input type="number"  name=" nodes" class="border smat-rounded center" value="5" id="expandupto" placeholder="Number of Nodes" style="border:8px; widows: 10px;width: 50px;padding: 1px;" autocomplete="OFF" required>  nodes <button style="padding: 5px;width: 60px;margin-bottom:13px" type="button" value='+nodes_to_be_pushed[i].id+' id="expand_from_list" data-dismiss="modal" class="btn btn-primary float-right">GO</button></td></tr></table>');
    } 
  });
});

export const delete_node = (properties, data) => {

    let selected_node = properties.nodes[0];
    data.nodes.remove([selected_node]);

    var nodesArray = [];
    var edgesArray = [];
    var updated_edges = [];

    $.each(data.nodes._data, function(key, val) {
        nodesArray.push(val["id"]);
    });

    $.each(network_global.body.data.edges._data, function(key, val) {
        edgesArray.push(val);
    });

    for (var i = 0; i < nodesArray.length; i++) {
        if (edgesArray[i].from != selected_node && edgesArray.to != selected_node) {
            updated_edges.push(edgesArray[i]);
        }
    }
    return updated_edges;
}

export const selected_graph_ids = () => {
    var ids_arr = [];
    ids_arr = $( $('#naCards .col-sm-3 .form-check-input:checked')).map(function(){
        return this.id;
    }).get()
    return ids_arr;
}

export const selected_graph_query = () => {
    var ids_arr = [];
    ids_arr = $( $('#naCards .col-sm-3 .form-check-input:checked')).map(function(){
        return this.query;
    }).get()
    return ids_arr;
}

export const union = async (url,data,NAType) => {
    let response = await fetch(url,{
        method : 'post',
        headers : HeadersForApi,
        body : JSON.stringify(data),
    });

    let output = await response.json();
    return output;
}

export const render_union_graph = async (input,input_arr_net_type) => {
    let dir_name = getmystoragedir();
    let data = {
        input: input,
        option: "union",
        inputnetid: input,
        dir_name : dir_name,
        input_arr_net_type : input_arr_net_type
    }
    let response = await fetch('na/union_data_formator',{
        method : 'post',
        headers : HeadersForApi,
        body: JSON.stringify(data),
    });

    let output = await response.json();
    return output;
}

export const getDeletedNodes = async () => {
    let sentence;
    for(let i=0; i<deletedNodes.length; i++){
        if(i==0){
            sentence = deletedNodes[i];
        }else{
            sentence = sentence +","+ deletedNodes[i];
        }
    }
    return sentence;
}

export const render_graph_union = (res) => {
    var nodes_arr = res["nodes"];
    var edges_arr = res["edges"];
    var querynodeinfo = res["querynode"];
    var major_array = res["major"];
    var opr_type = res["operation"];
    var networkTypes = res["networktype"];
    coming_from_binary_ops = true;

    $(".nos_of_nodes").empty();
    $(".nos_of_nodes").text(nodes_arr.length);
    $(".nos_of_edges").empty();
    $(".nos_of_edges").text(edges_arr.length);


    let wellformedquery; 
    let selectedGraphs = selected_graph_ids();
    let querydictfilename = getquerydictfilename();

    // $('.shadow analysis_chart_div').empty();
    // $('#infoDiv').remove();
    $('#analysis_summary_charts').css("display", "none");
    $('.analysis_summary_div').empty();
    $(".analysis_summary_div").css("display", "block");

    $('.analysis_summary_div').append('<table> <tr><th style="width:100px">Network Name</th><th style="width:40px">Network Size</th><th style="width:200px">Network Type</th><th style="width:80px">Color Code</th></tr>');
    for(var i=0; i<querynodeinfo.length;i++){
        let color_code = querynodeinfo[i]["color"];
        let count = i + 1;
        let size_of_each_network = major_array[i].length - 2;
        $('.analysis_summary_div').append('<tr><td style="width:100px">'+ querydictfilename[selectedGraphs[i]] +'</td><td style="width:40px">'+size_of_each_network+'</td><td style="width:210px">'+networkTypes[i]+'</td><td style="background-color:white;width:80px"><span class="badge badge-pill" style="background-color:'+querynodeinfo[i]["color"]+'">&nbsp;</span></td></tr>');
    }

    $('.analysis_summary_div').append('<table> <tr><th style="width:250px">Intersecting Node Color Code</th><th style="width:50px"><span class="badge badge-pill" style="background-color:'+"red"+'">&nbsp;</span></th></tr></table>');

    $('.analysis_summary_div').append('</table>');


    $('.analysis_summary_div').append('<table> <tr><th style="width:330px">Node Name</th><th style="width:80px">Color Code</th></tr>');
    for(var i=0; i<nodes_arr.length;i++){
        let color_code = nodes_arr[i]["color"];
        let count = i + 1;
        $('.analysis_summary_div').append('<tr><td style="width:350px">'+'<a href="#target" class="click_events">'+nodes_arr[i]["id"]+'</a> &nbsp <label class="float-right">Expand by <input type="number"  name=" nodes" class="border smat-rounded center" value="5" id="expandupto" placeholder="Number of Nodes" style="border:8px; widows: 10px;width: 50px;padding: 1px;" autocomplete="OFF" required>  nodes <button style="padding: 5px;width: 60px;margin-bottom:13px" type="button" value='+nodes_arr[i]["id"]+' id="expand_from_list" data-dismiss="modal" class="btn btn-primary">GO</button></label>'+'</td><td style="background-color:white;width:80px"><span class="badge badge-pill" style="background-color:'+color_code+'">&nbsp;</span></td></tr>');
    }
    $('.analysis_summary_div').append('</table>');


    //SRS-003
    const groupsN = networkTypes.length;
    
    const groups = []
    for (let i = 1; i <= groupsN+1; i++) {
        groups.push(i)
    }
    

    const visNodes = [];
    let group;
    $.each(nodes_arr, function(index, value) {    
        if(value.color=="#629632"){
            group = 1;
        }else if(value.color=="#79CDCD"){
            group = 2;            
        }else if(value.color=="#1abc9c"){
            group = 4;            
        }else if(value.color=="#5b2c6f"){
            group = 5;            
        }else if(value.color=="#ED5565"){
            group = 6;            
        }else if(value.color == "#5f6a6a"){
            group = 7;
        } else if(value.color =="#000000"){
            group = 8;
        }else if(value.color =="#FF0000"){
            group = 3;
        }    
        visNodes.push({
           "id": value.id,
           "label": value.label,
           "group": group,
           "size": 25,
           "font": { size: 25 }
        });
    });


    const visEdges = []
    $.each(edges_arr, function(index, value) {
        visEdges.push({
            "from": value.from,
            "to": value.to,
            "label": value.label
        });
    });
    
    var nodes = new vis.DataSet();
    var edges = new vis.DataSet();
    edges.add(visEdges);



    
    
    computeNodesPositionsDistricts(visNodes, groups);
    nodes.add(visNodes);

    // create a network
    var container = document.getElementById("union_displayer");
    var data = {
        nodes: nodes,
        edges: edges
    };

    var options = {
        nodes: {
            shape: 'dot',
            scaling: {
                min: 10,
                max: 30
            },
            font: {
                size: 30,
                face: 'courier'
            },
            borderWidth: 1,
            // shadow: true
        },
    interaction: {
        hideEdgesOnDrag: true,
        hover: true,
        tooltipDelay: 100,
        multiselect: true,
        navigationButtons: true,
        keyboard: true
        },
        physics:
        {
            enabled: false
        }
    }

    network_global = new vis.Network(container, data, global_options2);
    // network_global.on('afterDrawing', (ctx) => afterNetworkDrawing(network_global, ctx));

    global_edges = edges_arr;
    
    var scaleOption = {scale:0.2};
    network_global.moveTo(scaleOption);

    network_global.on('oncontext',function(properties){
        event.preventDefault();
    
        //Show contextmenu
        $(".custom-menu").finish().toggle(100).
        
        // In the right position (the mouse)
        css({
            top: event.pageY + "px",
            left: event.pageX + "px"
        });
        document.addEventListener('contextmenu', event => event.preventDefault());
        queryTempexp = network_global.getNodeAt(properties.pointer.DOM);
        network_global_expansion = network_global;
        $("#expansionnodename").empty();
        $("#expansionnodename").append(queryTempexp);
        coming_from_binary_ops = true;
    });
    
    //Adding control buttons

    network_global.on('hoverNode', function(properties) {
            on_hover_neighbors_binary_ops(properties, nodes);
    });
}

export const intersection = async (url,data,NAType) => {
    let response = await fetch(url,{
        method : 'post',
        headers : HeadersForApi,
        body : JSON.stringify(data),
    });
    let output = await response.json();
    return output;
}

export const getUserDetailsNA = async (id) => {
    let response = await fetch('UA/getUserDetailsTemp', {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({
            userID: id
        })
    });
    let data = await response.json()
    return data;
}

export const difference = async (url,data,NAType) => {
    let response = await fetch(url,{
        method : 'post',
        headers : HeadersForApi,
        body : JSON.stringify(data),
    });
    let output = await response.json();
    return output;
}

export const render_intersection_diff_graph = async (input,option) => {
    let dir_name = getmystoragedir();
    let data = {
        input : input,
        option : option,
        dir_name : dir_name
    }

    let response = await fetch('na/formator_inter_diff',{
        method : 'post',
        headers : HeadersForApi,
        body: JSON.stringify(data),
    });

    let output = await response.json();
    return output;
}

export const getEdges = () => {
    var edgesArray = []
    $.each(network_global.body.data.edges._data, function(key, val) {
        edgesArray.push(val);
    });
    return edgesArray;
}

export const exportnetwork = () => {
        global_edges = getEdges();
        let csvContent = "data:text/csv;charset=utf-8,";
        var csv_file = 'from,to,count\n';
        var universalBOM = "\uFEFF";
        if (!global_edges) {
            return;
        }
    
        global_edges.forEach(function(rowArray) {
            var fruits = [];
            fruits.push(rowArray.from);
            fruits.push(rowArray.to);
            fruits.push(rowArray.label);
            let row = fruits.join(",");
            csv_file += row + "\r\n";
        });
    
        var encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(universalBOM + csv_file);
        window.open(encodedUri);
    }

export const writedelete = (unique_id) => {
    let dir_name = getmystoragedir();
    $.ajax({
        url: 'na/writedelete',
        type: 'POST',
        dataType: 'JSON',
        data: {
            input: JSON.stringify(global_edges),
            uniqueid: unique_id,
            dir_name : dir_name
        },
        beforeSend: function() {

        },
        success: function(data) {
            message_displayer("Network saved successfully","success");
        }
    })
    .fail(function(res) {
        console.log(res);
        return; 
    })
    message_displayer("Network saved successfully","success");
}

export const sparkUpload = (filename_arr) =>{
    let dir_name = getmystoragedir();
        $.ajax({
                url: 'na/fileUploadRequest',
                type: 'GET',
                dataType: 'JSON',
                data: {
                    filename_arr: filename_arr,
                    dir_name : dir_name
                }
            })
            .done(function(res) {
                //console.log(res);
            })
}

export const checkStatus = (id,unique_name_timestamp) =>{
        let dir_name = getmystoragedir();
        $.ajax({
                url: 'na/getStatusFromSpark',
                type: 'GET',
                data: {
                    id: id,
                    dir_name : dir_name
                },
                dataType: 'json'
            })
            .done(function(res) {
                // when the status is not "success" or "dead" , check status until it would become "success", when it success write the json file
                if ((res['status'] != 'success') && (res['status'] != 'dead')) {
                    setTimeout(function() {
                        checkStatus(res['id'], unique_name_timestamp);
                    }, 30000);
                } else if (res['status'] == 'success') {
                    getOuputFromSparkAndStoreAsJSON(res['id'], unique_name_timestamp);
                }
            });
}

export const getOuputFromSparkAndStoreAsJSON = (id,unique_name_timestamp) =>{
    let dir_name = getmystoragedir();
    $.ajax({
        url: 'na/getOuputFromSparkAndStoreAsJSON',
        type: 'GET',
        data: {
            id: id,
            filename: unique_name_timestamp,
            dir_name : dir_name
        },
        dataType: 'json'
    })
    .done(function(res) {
    });
}


export const render_intersection_difference = (res,id_value,option) => {
   
        var nodes_arr = res["nodes"];
        var edges_arr = res["edges"];
        var info = res["info"];
        var option = res["option"];
        var edges_to_be_used_while_saving = res["edges_to_be_used_while_saving"];  


        var filteredEdges = [];

        let informationARR = [];
        $.each(info, function(index,value){
            informationARR.push(value.nodes);
        })

        $.each(edges_arr, function(index, value) {
            if(informationARR.includes(value.from) && informationARR.includes(value.to)){
                filteredEdges.push({
                    "from": value.from,
                    "to": value.to,
                    "label": value.label
                })
            }
        });

        global_edges = filteredEdges;


        

        $(".nos_of_nodes").empty();
        $(".nos_of_nodes").text(nodes_arr.length);
        $(".nos_of_edges").empty();
        $(".nos_of_edges").text(edges_arr.length);
  

        $('#analysis_summary_charts').css("display", "none");
        $('.analysis_summary_div').empty();
        $(".analysis_summary_div").css("display", "block");


        // $('.analysis_summary_div').empty();
        if(info.length == 0){
            $('.analysis_summary_div').append('<b>No intersecting nodes.</b>');
        }else{
            $('.analysis_summary_div').append('<table> <tr><th style="width:350px">Node Name</th><th style="width:80px">Color Code</th></tr>');
            if(option == "difference"){
                var color_code = "#5c2480";
            }else{
                var color_code = "#F20000";
            }
            for(var i=0; i<info.length;i++){
                let count = i + 1;
                $('.analysis_summary_div').append('<tr><td style="width:350px">'+'<a href="#target" class="click_events">'+ info[i]["nodes"] +'</a>'+'</td><td style="background-color:white;width:110px"><span class="badge badge-pill" style="background-color:'+color_code+'">&nbsp;</span></td></tr>');
            }
            $('.analysis_summary_div').append('</table>');
        }      
    
        var nodes = new vis.DataSet();
        var edges = new vis.DataSet();
    
        // create a network
        var container = document.getElementById(id_value);
        var data = {
            nodes: nodes,
            edges: edges
        };
    
        network_global = new vis.Network(container, data, binary_ops_option_format);
        
        network_global.focus(1, {
            scale: 1
        });
    
        // to add node dynamically
        $.each(nodes_arr, function(index, value) {  
                    nodes.add({
                    "id": value.id,
                    "label": value.label,
                    "group": value.group,
                    "color": value.color,
                    "shape": "dot",
                    "size": 25,
                    "font": { "size": 25 }
                });
        });
    
        $.each(edges_arr, function(index, value) {
            setTimeout(function() {
                edges.add({
                    "from": value.from,
                    "to": value.to,
                    "label": value.label
                });
    
            }, 10);
        });
    
    
        // assigning edges to global_edges:
        // global_edges = edges;
        function on_stabilize_hide_loader() {
            $("#network_loader_id").empty();
        }
    
        // clear user_defined_sequence
        
        var scaleOption = {scale:0.2};
        network_global.moveTo(scaleOption);

        network_global.on('hoverNode', function(properties) {
            on_hover_neighbors_binary_ops(properties, nodes);
        });
    
    }

    export const get_network = () => {
        return network_global;
    }
    
    /*********************OPTIONS FOR NETWORKS******************** */
    /*                                                            */
    /*********************************************************** */

    // Options format for binary operations:
var binary_ops_option_format = {
    nodes: {
        shape: 'dot',
        size: 25,
        scaling: {
            min: 10,
            max: 30
        },
        font: {
            size: 10
        },
        borderWidth: 1,
    },
    edges: {
        color: {
            inherit: true,
            color: '#fcba03'
        },
        length: 2000,
        width: 0.15,
        smooth: {
            type: 'continuous'
        }
    },
    interaction: {
        hideEdgesOnDrag: true,
        tooltipDelay: 200,
        navigationButtons: true,
        keyboard: true
    },
    physics: true,
    layout: {
        improvedLayout: false,
        randomSeed: 191006
    }

};


// Option format for global edges
var global_options = {
    nodes: {
        shape: 'dot',
        color: '',
        size: 30,
        scaling: {
            min: 10,
            max: 30
        },
        font: {
            size: 30,
            face: 'courier'
        },
        borderWidth: 1,
        // shadow: true
    },
    edges: {
        color: '#97C2FC',
        length: 1500,
        width: 0.15,
        smooth: {
            type: 'continuous'
        },
        hoverWidth: 10
            // shadow: true
    },
    interaction: {
        hideEdgesOnDrag: true,
        hover: true,
        tooltipDelay: 100,
        multiselect: true,
        navigationButtons: true,
        keyboard: true
    },
    physics: true,
    layout: {
        improvedLayout: false,
        randomSeed: 191006
    }
};

var global_options2 = {
    nodes: {
        shape: 'dot',
        color: '',
        size: 30,
        scaling: {
            min: 10,
            max: 30
        },
        font: {
            size: 30,
            face: 'courier'
        },
        borderWidth: 1,
        // shadow: true
    },
    groups: {
        1: {
            color: '#629632',
        },
        2: {
            color: '#79CDCD',
        },
        3: {
            color: '#FF0000',
        },
        4: {
            color: '#1abc9c',
        },
        5: {
            color: '#5b2c6f',
        },
        6: {
            color: '#ED5565',
        },
        7: {
            color: '#000000',
        },
        8: {
            color: '#FF0000',
        },
        9: {
            color: 'orange'
        }
    },
    edges: {
        length: 2500,
        width: 0.005,
        smooth: {
            type: 'continuous'
        },
        hoverWidth: 10
    },
    interaction: {
        hideEdgesOnDrag: true,
        hover: true,
        tooltipDelay: 100,
        multiselect: true,
        navigationButtons: true,
        keyboard: true,
    },
    physics: false,
    layout: {
        improvedLayout: false,
        randomSeed: 191006
    }
};


// Options format for link prediction and shortest path 
var options_link_shortestpath = {
    edges: {
        length: 500,
        chosen: false,
        font: {
            size: 25,

        },
        color: {
            color: 'green',
            highlight: '#FF5733',
            hover: 'blue',
            inherit: 'to',
            opacity: 1.0
        }
    },
    nodes: {
        shape: 'dot',
        color: '#ED5565',
        fixed: false,
        size: 50,

        font: {
            size: 18,
            color: '#2C3E50',
            align: 'center'
        },
        borderWidth: 2
    },
};

// Option format for centrality:
var centrality_options = {
    nodes: {
        shape: 'dot',
        color: '#307CE9',
        scaling: {
            min: 10,
            max: 30
        },
        font: {
            size: 30,
            face: 'courier'
        },
        borderWidth: 1,
        shadow: true
    },
    edges: {
        color: {
            inherit: true,
            color: '#e5e4e2',
            highlight: '#9B59B6',
        },
        font: {
            size: 10
        },
        length: 1500,
        width: 0.15,
        smooth: {
            type: 'continuous'
        },
        hoverWidth: 10
    },
    interaction: {
        hideEdgesOnDrag: true,
        hover: true,
        tooltipDelay: 100,
        navigationButtons: true,
        keyboard: true
    },

    physics: true,

    layout: {
        improvedLayout: false,
        randomSeed: 191006
    }

};
/** Option for community detection */
var community_options = {
    nodes: {
        shape: 'dot',
        scaling: {
            min: 10,
            max: 30
        },
        font: {
            size: 30,
            face: 'courier'
        },
        borderWidth: 1,
        // shadow: true
    },

    // This groups section is being added by Roshan
    // for community detection
    groups: {
        1: {
            color: 'red',
        },
        2: {
            color: 'yellow',
        },
        3: {
            color: 'green',
        },
        4: {
            color: 'brown',
        },
        5: {
            color: 'black',
        },
        6: {
            color: 'blue',
        },
        7: {
            color: 'pink',
        },
        8: {
            color: 'purple',
        },
        9: {
            color: 'orange'
        }
    },
    edges: {
        color: '#CBC8C8',
        length: 1500,
        width: 0.15,
        smooth: {
            type: 'continuous'
        },
        hoverWidth: 10
    },
    interaction: {
        hideEdgesOnDrag: true,
        hover: true,
        tooltipDelay: 100,
        navigationButtons: true,
        keyboard: true
    },

    physics: true,

    layout: {
        improvedLayout: false,
        randomSeed: 191006
    }

};



export const storeResultofSparkFromController = async (sparkID, query_list ,userID) => {
    let dir_name = getmystoragedir();
    let dataArgs = JSON.stringify({
        id: sparkID,
        dir_name : dir_name,
        query_list,
        userID
    });


    let response = await fetch('na/getFromSparkAndStore', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs,
    });
    let output = await response.json();
    return output;
}

// This is a generic on_hover function should be used the same everywhere 
export const on_hover_change_color_of_neighbournodes = async(properties, nodes) => {

    let selected_node = properties["node"];

    console.log("Printing Selected Node!");
    console.log(selected_node);

    let nodes_new = Object.keys(nodes._data);
    let con_nodes = network_global.getConnectedNodes(selected_node);

    $('#analysis_summary_charts').css("display", "none");
    $('.NeighborsDiv').empty();   
    $('.analysis_summary_div').css("display", "none");   

    $('.NeighborsDiv').append('<table> <tr><th style="width:20px">Neighbors of - <b>'+selected_node+'</b></th></tr>');

    for(let i = 0; i < con_nodes.length; i++){
        $('.NeighborsDiv').append('<tr><td style="width:500px"> <a href="#target" class="click_events">'+con_nodes[i]+'</a><label class="float-right">Expand by <input type="number"  name=" nodes" class="border smat-rounded center" value="5" id="expandupto" placeholder="Number of Nodes" style="border:8px; widows: 10px;width: 50px;padding: 1px;" autocomplete="OFF" required>  nodes <button style="padding: 5px;width: 60px;margin-bottom:13px" type="button" value='+con_nodes[i]+' id="expand_from_list" data-dismiss="modal" class="btn btn-primary">GO</button></label></td></tr></table>');
    }


    for (let i = 0; i < nodes_new.length; i++) {
        let node_index = nodes_new[i];
        if (con_nodes.includes(node_index)) {
            nodes._data[node_index].color = {
                 border: 'red'
                };
            nodes._data[node_index].font = {
                color: 'red',
                face: 'courier',
                size: 70
            };
        } else if (node_index == selected_node) {
            console.log("The selected node is :");;
            console.log(selected_node);
            nodes._data[node_index].color = {
                 border: 'green'
            };
            nodes._data[node_index].font = {
                color: 'green',
                face: 'courier',
                size: 70
            };
        } else {
            nodes._data[node_index].color = {
                 border: 'white'
            };
           // nodes._data[node_index].color = "#EA9999"; //#307CE9
            nodes._data[node_index].font = {
                color: 'blue',
                face: 'courier',
                size: 10
            };
        }
    }
    let updated_nodes = Object.values(nodes["_data"]);
    nodes.update(updated_nodes);
}


export const on_hover_neighbors_binary_ops = async(properties,nodes) =>{
    let selected_node = properties["node"];

    console.log("Printing Selected Node!");
    console.log(selected_node);

    let nodes_new = Object.keys(nodes._data);
    let con_nodes = network_global.getConnectedNodes(selected_node);

    $('#analysis_summary_charts').css("display", "none");
    $('.NeighborsDiv').empty();   
    $('.analysis_summary_div').css("display", "none");   

    $('.NeighborsDiv').append('<table> <tr><th style="width:20px">Neighbors of - <b>'+selected_node+'</b></th></tr>');

    for(let i = 0; i < con_nodes.length; i++){
        $('.NeighborsDiv').append('<tr><td style="width:500px"> <a href="#target" class="click_events">'+con_nodes[i]+'</a><label class="float-right">Expand by <input type="number"  name=" nodes" class="border smat-rounded center" value="5" id="expandupto" placeholder="Number of Nodes" style="border:8px; widows: 10px;width: 50px;padding: 1px;" autocomplete="OFF" required>  nodes <button style="padding: 5px;width: 60px;margin-bottom:13px" type="button" value='+con_nodes[i]+' id="expand_from_list" data-dismiss="modal" class="btn btn-primary">GO</button></label></td></tr></table>');
    }
}



export const on_hover_out_set_back = async(nodes) => {

    let nodes_new = Object.keys(nodes._data);

    for (let i = 0; i < nodes_new.length; i++) {
        nodes._data[nodes_new[i]].color = "#FFFFFF"; //#307CE9
        nodes._data[nodes_new[i]].font = {
            color: 'black',
            face: 'courier',
            size: 10
        };
    }

    let updated_nodes = Object.values(nodes["_data"]);
    nodes.update(updated_nodes);
}