// import {wordCloudLM} from './chartHelper.js';
import {
    get_current_time,
    tweetChunkInfo,
    getTweetIdList,
    getHashtag,
    getTopHashtag,
    checkLocation,
    findLocation,
    AllLocationNames
} from './helper.js';
import {
    TweetsGenerator
} from '../utilitiesJS/TweetGenerator.js';
import {
    forwardToHistoricalAnalysis,
    forwardToUserAnalysis
} from '../utilitiesJS/redirectionScripts.js';
import {makeAddToStoryDiv} from '../utilitiesJS/smatExtras.js'

var hashtag_info, global_tweetid_list, locations,global_place;
var interval, currentPlace;
let currentlyTrendingLocFlag = 1;
let fromDate,toDate;
let clear_map;
const categoryColor = {
    'normal': 'text-normal',
    'com': 'text-com',
    'sec': 'text-sec',
    'com_sec': 'text-com_sec'
}
const categoryColorHexDict = {
    'normal': '#297EB4',
    'com': '#ff0055',
    'sec': '#3D3D3D',
    'com_sec': '#FF00FF'
};
var global_datetime, global_datetime_;

let pname = null;
if ($(this).attr('projectName')) {
    pname = $(this).attr('projectName');
}


var markersList = document.getElementById('markersList');
L.MarkerCluster.include({
    spiderfy: function () {
        var childMarkers = this.getAllChildMarkers();
        this._group._unspiderfy();
        this._group._spiderfied = this;

        markersList.innerHTML = childMarkers
            .map((marker, index) => `<li class="litems">${marker._popup._content}</li>`)
            .join('');
        // Show the modal.
        modal.classList.add("show-modal");
    },
    unspiderfy: function () {
        this._group._spiderfied = null;
        // Hide the modal.
        modal.classList.remove("show-modal");
    }
});
var attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
var tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var tiles = L.tileLayer(tileUrl, {
    attribution
});
var glow = new L.LayerGroup();
var WCmarker = new L.LayerGroup();


var LM_Map = L.map('lmMap', {
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
    center: [21.1458, 79.0882],
    zoom: 5,
    layers: [tiles, WCmarker, glow]
});
var markerCluster = L.markerClusterGroup({
        iconCreateFunction: function (cluster) {
            return new L.DivIcon({
                html: '<div class="icon-wrapper"><b>' +
                    cluster.getChildCount() +
                    "</b></div>",
                className: "icon",
                iconSize: L.point(49, 49)
            });
        }
    }),
    group1 = L.featureGroup.subGroup(markerCluster), // use `L.featureGroup.subGroup(parentGroup)` instead of `L.featureGroup()` or `L.layerGroup()`!    
    control = L.control.layers(null, null, {
        collapsed: false
    });
markerCluster.addTo(LM_Map);


var tweetIcon = L.icon({
    iconUrl: 'public/icons/twitter.png',
    iconSize: [35, 35] // size of the icon
});

var HashtagIcon = L.icon({
    iconUrl: 'public/icons/hash.png',
    iconSize: [65, 65] // size of the icon
});



var modal = document.querySelector(".modal_lm");
var closeButton = document.querySelector(".close-button");



closeButton.addEventListener("click", closeModal);

function closeModal() {
    // Use the unspiderfy method so that internal state is updated.
    markerCluster.unspiderfy();
}

function windowOnClick(event) {
    if (event.target === modal) {
        closeModal();
    }
}

var TweetCluster = {};
var AllEvents = {
    "Hashtags": glow,
    "Tweets": group1,
    "WordCloud Hashtags": WCmarker
};


L.control.layers(TweetCluster, AllEvents).addTo(LM_Map);


var legend = L.control({
    position: "topright"
});

legend.onAdd = function (LM_Map) {
    var div = L.DomUtil.create("div", "legend shadow");
    div.innerHTML += '<i style="background: #297eb4"></i><span>Normal Hashtags</span><br>';
    div.innerHTML += '<i style="background: #f30155"></i><span>Communal Hashtags</span><br>';
    div.innerHTML += '<i style="background: #3d3d3d"></i><span>Security Hashtags</span><br>';
    div.innerHTML += '<i style="background: #f500ff"></i><span>Communal and Security Hashtags</span><br>';
    div.innerHTML += '<i style="background: #00acee"></i><span>Tweets</span><br>';
    // div.innerHTML += '<i style="background: green"></i><span>Trending Events</span><br>';

    return div;
};

legend.addTo(LM_Map);


var showLegend = true; // default value showing the legend
$('.legend').hide();


var button = L.control({
    position: "topright"
});

button.onAdd = function (LM_Map) {
    var div = L.DomUtil.create("div", "submitButton");
    div.innerHTML += '</button><button class="legend_show"  style="border:none;outline: none;margin-right: -35px !important;width: 80px;height: 70px;background-size: 40px;"></button>';

    return div;
};

button.addTo(LM_Map);
localStorage.getItem('projectMetaData') && makeAddToStoryDiv('lmMap','lmPanel')


jQuery(function () {
    /*
     Below is the code writtn to filter out the hashtags from the word cloud.
     written by : Amitabh Boruah(amitabhyo@gmail.com)
    */
     global_place = "^" + $("#queryLM").val().toLowerCase();
    $('body').on('click', 'div .filter-hashtags', function () {
        let filterValue = $(this).attr('value');
        $('#currentlyTrendingLocBtn').addClass('text-normal');
        $('#currentlyTrendingLocBtn').attr('title', 'Hide  trending hashtags');
        $('#currentlyTrendingParentLoc').css('display', 'block');
        currentlyTrendingLocFlag = 1;
        $('#lmMap').css('width', '60%');

        generateCurrentlyTrending(trendingGlobal, trendingGlobal, 'currentlyTrendingLocDiv', filterValue, currentPlace);
    });

    // Typehead
    AllLocationNames().then(response => {
        locations = response;

        var locations = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: locations
        });


        $('#queryLM').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: 'cars',
            source: locations
        });
    });






    global_datetime = ["2021-02-19 00:00:00", "2021-02-19 01:00:00"];
    trigger();

    $('#submit-btn').on('click', function (e) {
        global_place = "^" + $("#queryLM").val().toLowerCase();
        trigger();
    });

    $('.nav-item ').removeClass('smat-nav-active');
    $('#nav-LM').addClass('smat-nav-active');

    $('#lmInputs').on('submit', function (e) {
        e.preventDefault();
        let LocTemp = $('#queryLM').val();
        $('.currentSearch').text(LocTemp);
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#lmPanel").offset().top
        }, 200);

    });

    $('#locationTweets').on('click', function () {
        ///Amitabh

        let to = global_datetime[1];
        let from = global_datetime[0];
        let place = "^" + $("#queryLM").val();
        $('#tweetsModal').modal('show');
        TweetsGenerator(global_tweetid_list, 6, 'tweets-modal-div', null, null, 'all');

    });
    $('#currentlyTrendingLocBtn').on('click', function () {
        if (currentlyTrendingLocFlag === 1) {
            $('#currentlyTrendingLocBtn').removeClass('text-normal');
            $('#currentlyTrendingLocBtn').attr('title', 'Show  trending hashtags');
            $('#currentlyTrendingParentLoc').css('display', 'none');
            currentlyTrendingLocFlag = 0;
            $('#lmMap').css('width', '100%');
        } else {
            $('#currentlyTrendingLocBtn').addClass('text-normal');
            $('#currentlyTrendingLocBtn').attr('title', 'Hide  trending hashtags');
            $('#currentlyTrendingParentLoc').css('display', 'block');
            currentlyTrendingLocFlag = 1;
            $('#lmMap').css('width', '60%');

        }
    });

    $('body').on('click', 'div .button1', function (e) {
        var token = $(this).text();
        console.log(token);
        $("#queryLM").val(token);
        // global_datetime = get_current_time(interval);
        // console.log($("#location_button").text());
        trigger();
    });

    $('body').on('click', 'div .sensitive_class', function (e) {

        var token = $(this).text();
        console.log(token);
        forwardToHistoricalAnalysis(token, global_datetime[0], global_datetime[1]);


    });

    $('body').on('click', 'div .username', function () {
        let queryCaptured = '$' + $(this).attr('value'); //Here query is userID
        forwardToUserAnalysis(queryCaptured, global_datetime[0], global_datetime[1]);
    });
    $('#lmMap').on('click', '.legend_show', function () {

        if (showLegend === true) {
            /* use jquery to select your DOM elements that has the class 'legend' */
            $('.legend').hide();
            showLegend = false;
        } else {
            $('.legend').show();
            showLegend = true;
        }

    });

    $('#lmDate').on('submit', function (e) {
        e.preventDefault();
        //logic different in historical analysis :: If required please update in other module
        //This logic is written on basis of requirement raised by Rahul Yumlembam.
        fromDate = $('#fromDateUA').val();
        toDate = $('#toDateUA').val();
        
        global_place = "^" + $("#rangeQueryLM").val().toLowerCase();

        console.log(" dateee::  ",fromDate+" 00:00:00",toDate+" 00:00:00");
        global_datetime = [fromDate+" 00:00:00",toDate+" 00:00:00"];
        trigger();
            
        
    });

    $('#range').on('click', function (e) {
        $('#lmDate').show();
        $('#lmInputs').hide();
    });

    $('#live').on('click', function (e) {
        $('#lmDate').hide();
        $('#lmInputs').show();
    });


});






function trigger() {
    var type,
        from_datetime,
        to_datetime,
        place = global_place,
        refresh_type = $("#lmTefreshType").val(),
        timeLimit = $("#lmInterval :selected").val();

    currentPlace = place;
    localStorage.setItem("lmTefreshType", "manual");

    if (timeLimit == "1 Minute") {
        interval = 60;
    } else if (timeLimit == "15 Minutes") {
        interval = 900;
    } else if (timeLimit == "1 Hour") {
        interval = 3600;
    }




    if (refresh_type == "Manual Refresh") {
        for (var i = 0; i < 10000; i++) {
            clearInterval(i);
        }
        $('#currentlyTrendingLocDiv').html('<div class="text-center smat-loader " ><i class="fa fa-circle-o-notch donutSpinner mt-5" aria-hidden="true"></i></div>');
        // global_datetime = get_current_time(interval);
        // global_datetime = ["2021-02-19 00:00:00", "2021-02-19 01:00:00"];
        to_datetime = global_datetime[1];
        from_datetime = global_datetime[0];
        console.log(global_datetime);
        // findLocation('^guwahati').then(result => {
        //     console.log(result);
        // });
        checkLocation(place.split("^")[1]).then(result => {
            console.log("location result   ",result);
            console.log("this os the place name", place);
            if (Number.isInteger(parseInt(result)) == true) {
                getTweetIdList(from_datetime, to_datetime, place, "tweet_id", pname).then((response) => {
                    tweetResults(response);
                    global_tweetid_list = response;
                    // console.log(global_tweetid_list);
            
                    // let idx = 0;
                    // let chunk_size = 100;
                    // for (let i = 0; i < response.length / chunk_size; i++) {
                    //     let temp = [];
                    //     for (let j = idx; j < idx + chunk_size; j++) {
                    //         temp.push(response[j]);
                    //     }
                    //     console.log(temp);
                    //     idx = idx + chunk_size;
                    //     // const v = await tweetChunkInfo(temp);
                    //     const tt = await tweetChunkInfo(temp);
                        
                    //     console.log("----------------------------------------------------");
                    // }
                });
                // getTweetIdList(from_datetime, to_datetime, place, "tweet_info", pname).then(response => {
                //     if (response.length == 0) {
                //         $("#modal_text").text("Location based tweet not found!");
                //         $("#exampleModal").modal();
                //     } else {
                //         console.log("This is the tweet info response", response);
                //         rander_map(response);
                //     }
                // });

                if ((parseInt(result)) == 2) {
                    type = "country"
                } else if ((parseInt(result)) == 1) {
                    type = "state"
                } else if ((parseInt(result)) == 0) {
                    type = "city"
                }

                getTopHashtag(from_datetime, to_datetime, place, type).then(response_2 => {
                    getHashtag(from_datetime, to_datetime, place, type).then(response => {
                        plotHashtags(response, response_2, place);
                    });
                });
            } else {
                $("#modal_text").text("Location Doest Not Exist!");
                $("#exampleModal").modal();
            }
        });
    } else if (refresh_type == "Auto Refresh") {
        for (var i = 0; i < 10000; i++) {
            clearInterval(i);
        }
        setInterval(function () {
            var interval_,
                type_,
                from_datetime_,
                to_datetime_,

                timeLimit_ = $("#lmInterval :selected").val(),
                place_ = "^" + $("#queryLM").val();
            place_ = place_.toLowerCase();



            if (timeLimit_ == "1 Minute") {
                interval_ = 60;
            } else if (timeLimit_ == "15 Minutes") {
                interval_ = 900;
            } else if (timeLimit_ == "1 Hour") {
                interval_ = 3600;
            }


            global_datetime_ = get_current_time(interval_);

            to_datetime_ = global_datetime_[1];
            from_datetime_ = global_datetime_[0];

            checkLocation(place_.split("^")[1]).then(result => {
                if (Number.isInteger(parseInt(result.value)) == true) {
                    getTweetIdList(from_datetime_, to_datetime_, place_, "tweet_id", pname).then(response => {
                        global_tweetid_list = response;
                    });
                    getTweetIdList(from_datetime_, to_datetime_, place_, "tweet_info", pname).then(response => {
                        if (response.length == 0) {
                            $("#modal_text").text("Location based tweet not found!");
                            $("#exampleModal").modal();
                        } else {
                            rander_map(response);
                        }

                    });

                    if ((parseInt(result.value)) == 2) {
                        type_ = "country"
                    } else if ((parseInt(result.value)) == 1) {
                        type_ = "state"
                    } else if ((parseInt(result.value)) == 0) {
                        type_ = "city"
                    }

                    getTopHashtag(from_datetime_, to_datetime_, place_, type_).then(response_2 => {
                        getHashtag(from_datetime_, to_datetime_, place_, type_).then(response => {
                            plotHashtags(response, response_2, place_);
                        });
                    });
                } else {
                    $("#modal_text").text("Location Does not Exist!");
                    $("#exampleModal").modal();
                    for (var i = 0; i < 10000; i++) {
                        clearInterval(i);
                    }
                }
            });
        }, 60000);

    }
}

// export const getTweetIdList = async (from,to,query,option,pname=null)
export const tweetResults = async (response) =>{
    clear_map = true;
    let idx = 0;
    let chunk_size = 50;
    for (let i = 0; i < response.length / chunk_size; i++) {
        let temp = [];
        for (let j = idx; j < idx + chunk_size; j++) {
            temp.push(response[j]);
        }
        idx = idx + chunk_size;
        const tweetInfoMap = await tweetChunkInfo(temp);
        console.log("ttttttt",tweetInfoMap);
        rander_map(tweetInfoMap);
        clear_map = false;
        
    }
    clear_map = true;
  }


const rander_map = (data) => {

    // group1.clearLayers();
    if (clear_map==true) {
        group1.clearLayers();
    }
    // if (data[0]["sentiment"] == "2") {

    //     LM_Map.setView([parseFloat(data[0]["Latitude"]), parseFloat(data[0]["Longitude"])], 4);
    // } else if (data[0]["sentiment"] == "1") {

    //     LM_Map.setView([parseFloat(data[0]["Latitude"]), parseFloat(data[0]["Longitude"])], 4);
    // } else if (data[0]["sentiment"] == "0") {

    //     LM_Map.setView([parseFloat(data[0]["Latitude"]), parseFloat(data[0]["Longitude"])], 4);
    // }

    for (var i = 0; i < data.length; i++) {
        //   var dat = { lat: op[i].Latitude , lng: op[i].Longitude , count: 1};
        //   heatmapLayer.addData(dat);
        if (data[i]["Latitude"] != null) {


            var senti = data[i]["sentiment"];
            if (senti == "0") {

                let tweet = data[i];

                let sentiment = '',
                    category = '',
                    media = '',
                    location = '',
                    senticlass = '';
                category = (tweet.category == 'normal') ? 'Normal' : ((tweet.category == 'sec') ? 'Security' : ((tweet.category == 'com') ? 'Communal' : 'Communal & Security'));
                if (tweet.sentiment === 0) {
                    sentiment = 'Postive';
                    senticlass = 'pos'
                } else if (tweet.sentiment === 1) {
                    sentiment = 'Negative';
                    senticlass = 'neg'
                } else {
                    sentiment = 'Neutral';
                    senticlass = 'neu'
                }

                if (tweet.t_location) {
                    location = tweet.t_location;
                }


                let div_element = '<div class="border  p-2 "><div class="d-flex"><div class="profilePictureDiv p-1 text-center mr-2"><img src="' + tweet.author_profile_image + '" style="height:33px;border-radius:50%" /></div><div> <p class="pt-1 m-0 font-weight-bold username"   value="' + tweet.author_id + '" >' + tweet.author + ' </p><p class="smat-dash-title pull-text-top m-0 "> @' + tweet.author_screen_name + ' </p></div> <div class="px-1 pt-1 mx-2  " >  <i class="fa fa-circle   text-' + tweet.category + '" aria-hidden="true" title="' + category + '"></i> </div> </div>  <div style="width:80%;"><p class="smat-tweet-body-text mb-1 filter_text">' + tweet.tweet_text + '</p></div><div id="" class="row d-flex justify-content-center tweet_media_body_' + tweet['tid'] + '" ></div><div class="d-flex"><p class="m-0 tweet-details">  <span>' + location + '</span>    <span class=" mx-2" >  <i class="fa fa-circle text-' + senticlass + '" aria-hidden="true" title="' + sentiment + '"></i>  ' + sentiment + '</span>              </p> </div></div>';


                L.marker([parseFloat(data[i]["Latitude"]), parseFloat(data[i]["Longitude"])], {
                    icon: tweetIcon
                }).bindPopup(div_element).addTo(group1);
            } else if (senti == "1") {
                let tweet = data[i];

                let sentiment = '',
                    category = '',
                    media = '',
                    location = '';
                let senticlass = '';
                category = (tweet.category == 'normal') ? 'Normal' : ((tweet.category == 'sec') ? 'Security' : ((tweet.category == 'com') ? 'Communal' : 'Communal & Security'));
                if (tweet.sentiment === 0) {
                    sentiment = 'Postive';
                    senticlass = 'pos'
                } else if (tweet.sentiment === 1) {
                    sentiment = 'Negative';
                    senticlass = 'neg'
                } else {
                    sentiment = 'Neutral';
                    senticlass = 'neu'
                }

                if (tweet.t_location) {
                    location = tweet.t_location;
                }


                let div_element = '<div class="border  p-2 "><div class="d-flex"><div class="profilePictureDiv p-1 text-center mr-2"><img src="' + tweet.author_profile_image + '" style="height:33px;border-radius:50%" /></div><div> <p class="pt-1 m-0 font-weight-bold username"   value="' + tweet.author_id + '" >' + tweet.author + ' </p><p class="smat-dash-title pull-text-top m-0 "> @' + tweet.author_screen_name + ' </p></div> <div class="px-1 pt-1 mx-2  " >  <i class="fa fa-circle   text-' + tweet.category + '" aria-hidden="true" title="' + category + '"></i> </div> </div>  <div style="width:80%;"><p class="smat-tweet-body-text mb-1 filter_text">' + tweet.tweet_text + '</p></div><div id="" class="row d-flex justify-content-center tweet_media_body_' + tweet['tid'] + '" ></div><div class="d-flex"><p class="m-0 tweet-details">  <span>' + location + '</span>    <span class=" mx-2" >  <i class="fa fa-circle text-' + senticlass + '" aria-hidden="true" title="' + sentiment + '"></i>  ' + sentiment + '</span>              </p> </div></div>';


                L.marker([parseFloat(data[i]["Latitude"]), parseFloat(data[i]["Longitude"])], {
                    icon: tweetIcon
                }).bindPopup(div_element).addTo(group1);
            } else if (senti == "2") {
                let tweet = data[i];

                let sentiment = '',
                    category = '',
                    media = '',
                    location = '';
                let senticlass = '';
                category = (tweet.category == 'normal') ? 'Normal' : ((tweet.category == 'sec') ? 'Security' : ((tweet.category == 'com') ? 'Communal' : 'Communal & Security'));
                if (tweet.sentiment === 0) {
                    sentiment = 'Postive';
                    senticlass = 'pos'
                } else if (tweet.sentiment === 1) {
                    sentiment = 'Negative';
                    senticlass = 'neg'
                } else {
                    sentiment = 'Neutral';
                    senticlass = 'neu'
                }

                if (tweet.t_location) {
                    location = tweet.t_location;
                }


                let div_element = '<div class="border  p-2 "><div class="d-flex"><div class="profilePictureDiv p-1 text-center mr-2"><img src="' + tweet.author_profile_image + '" style="height:33px;border-radius:50%" /></div><div> <p class="pt-1 m-0 font-weight-bold username"   value="' + tweet.author_id + '" >' + tweet.author + ' </p><p class="smat-dash-title pull-text-top m-0 "> @' + tweet.author_screen_name + ' </p></div> <div class="px-1 pt-1 mx-2  " >  <i class="fa fa-circle   text-' + tweet.category + '" aria-hidden="true" title="' + category + '"></i> </div> </div>  <div style="width:80%;"><p class="smat-tweet-body-text mb-1 filter_text">' + tweet.tweet_text + '</p></div><div id="" class="row d-flex justify-content-center tweet_media_body_' + tweet['tid'] + '" ></div><div class="d-flex"><p class="m-0 tweet-details">  <span>' + location + '</span>    <span class=" mx-2" >  <i class="fa fa-circle text-' + senticlass + '" aria-hidden="true" title="' + sentiment + '"></i>  ' + sentiment + '</span>              </p> </div></div>';


                L.marker([parseFloat(data[i]["Latitude"]), parseFloat(data[i]["Longitude"])], {
                    icon: tweetIcon
                }).bindPopup(div_element).addTo(group1);
            }
            group1.addTo(LM_Map);
        }
    }
    // }







}


const plotHashtags = (data, data_2, place) => {

    glow.clearLayers();

    var hashtag_data = data;


    var normalIcon = L.icon.pulse({
        iconSize: [10, 10],
        color: '#297eb4',
        fillColor: '#297eb4'
    });
    var SecurityIcon = L.icon.pulse({
        iconSize: [10, 10],
        color: '#3d3d3d',
        fillColor: '#3d3d3d'
    });
    var CommunalIcon = L.icon.pulse({
        iconSize: [10, 10],
        color: '#ff0055',
        fillColor: '#ff0055'
    });
    var SCIcon = L.icon.pulse({
        iconSize: [10, 10],
        color: '#2e7eb4',
        fillColor: '#2e7eb4'
    });

    // wordCloudLM(hashtag_data["hash_lat_lng_total_cat_info_arr"], 'trendingLM', data_2);
    generateCurrentlyTrending(data_2["top_data_with_cat_by_location"], hashtag_data["hash_lat_lng_total_cat_info_arr"], 'currentlyTrendingLocDiv', 'all', place);

    $.each(hashtag_data['lat_lng_hash_arr'], function (v, c) {
        var lat = v.split("_")[0],
            lng = v.split("_")[1];

        var category_array = [],
            mainIcon,
            l_str = '',
            hashtags_div = '',
            country = hashtag_data['lat_lng_info_arr'][v][0].split("^")[1],
            state = hashtag_data['lat_lng_info_arr'][v][1].split("^")[1],
            city = hashtag_data['lat_lng_info_arr'][v][2].split("^")[1];

        if (state != 'dummy state') {
            l_str += '<button type="button" class="button1 border-right"  id="location_button" value="' + state + '">' + state + '</button>';
        }

        if (city != 'dummy city') {
            l_str += '<button type="button" class="button1 border-right"  id="location_button" value="' + city + '">' + city + '</button>';
        }

        if (country != 'dummy country') {
            l_str += '<button type="button" class="button1 border-right"  id="location_button" value="' + country + '">' + country + '</country>';
        }


        hashtag_data["lat_lng_hash_arr"][v].forEach(function (f) {

            var hashtag_color,
                l = hashtag_data["hash_lat_lng_total_cat_info_arr"][f][v].slice(1);
            category_array.push(l);
            const indexOfMax = l.indexOf(Math.max(...l));
            if (indexOfMax == 0) {
                hashtag_color = '#ff0055';
            } else if (indexOfMax == 1) {
                hashtag_color = '#3d3d3d';
            } else if (indexOfMax == 2) {
                hashtag_color = '#2e7eb4';
            } else if (indexOfMax == 3) {
                hashtag_color = '#297eb4';
            }
            hashtags_div += '<button class="sensitive_class border-right" style="color:' + hashtag_color + '; background: none; border: none;">' + f + '</button>';

        });

        var result = category_array.reduce((r, a) => a.map((b, i) => (r[i] || 0) + b), []);

        const mainIconValue = result.indexOf(Math.max(...result));
        if (mainIconValue == 0) {
            mainIcon = CommunalIcon;
        } else if (mainIconValue == 1) {
            mainIcon = SecurityIcon;
        } else if (mainIconValue == 2) {
            mainIcon = SCIcon;
        } else if (mainIconValue == 3) {
            mainIcon = normalIcon;
        }


        hashtags_div += "</p>";


        var div_style = `<div class="row">
                                <div class="col">
                                    <div class="row">
                                        <div class="row" style=" display: inline-block; position: relative; margin-left: 15px; margin-right: 5px;" >
                                        ` + hashtags_div;

        div_style += `</div>
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            ` + l_str + `
                                        </div>
                                    </div>
                                </div>
                            </div>`;

        L.marker([lat, lng], {
            'icon': mainIcon
        }).bindPopup(div_style).addTo(glow).openTooltip();
    });



}

const wordcloudPlot = (data_, hashtag) => {

    WCmarker.clearLayers();
    $.each(data_[hashtag], function (v, c) {
        var lat = v.split("_")[0],
            lng = v.split("_")[1];


        L.marker([lat, lng], {
            'icon': HashtagIcon
        }).addTo(WCmarker);

    });
}

const wordCloudLM = (hashtag_latlng, div, response) => {
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create(div, am4plugins_wordCloud.WordCloud);
    chart.fontFamily = "Courier New";
    var series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
    series.randomness = 0;
    series.rotationThreshold = 0;
    series.minFontSize = am4core.percent(8);
    series.maxFontSize = am4core.percent(30);

    var dataformat = [];
    $.each(response, function (v, c) {

        let token = v;
        let count = c[0];
        let color;
        if (c[1] == 'normal') {
            color = "#2e7eb4"
        } else if (c[1] == 'com') {
            color = "#f30155"
        } else if (c[1] == 'sec') {
            color = "#3d3d3d"
        } else if (c[1] == 'com_sec') {
            color = "#2e7eb4"
        }

        dataformat.push({
            tag: token,
            count: count,
            "color": am4core.color(color)
        })

    });

    // data.forEach(element => {
    //     dataformat.push({
    //         tag: element['token'],
    //         count: element['count'],
    //         "color": am4core.color(element['color'])
    //     })

    // });


    series.data = dataformat;

    series.dataFields.word = "tag";
    series.dataFields.value = "count";

    series.colors = new am4core.ColorSet();
    series.colors.passOptions = {};

    series.labels.template.propertyFields.fill = "color";

    // series.labels.template.url = "https://stackoverflow.com/questions/tagged/{word}";
    // series.labels.template.urlTarget = "_blank";
    // series.labels.template.tooltipText = "{word}: {value}";

    var hoverState = series.labels.template.states.create("hover");
    hoverState.properties.fill = am4core.color("#FF0000");

    series.labels.template.events.on("over", function (ev) {

        var item = ev.target.tooltipDataItem.dataContext;
        var token = item['tag'];


        // wordcloudPlot(hashtag_latlng, token);
        // plotEventOnMap(token, only_hashtag_place_data);
    });

    // var subtitle = chart.titles.create();
    // subtitle.text = "(click to open)";

    // var title = chart.titles.create();
    // title.text = "Most Popular Tags @ StackOverflow";
    // title.fontSize = 20;
    // title.fontWeight = "800";
}


let trendingGlobal, trendingGlobal_latLong;
const generateCurrentlyTrending = (data, data_hashtag_latlng, div, filterArgument, query = null, interval = null) => {
    trendingGlobal = data;
    trendingGlobal_latLong = data_hashtag_latlng;
    $('#currentlyTrendingLocBtn').addClass('text-normal');
    $('#' + div).css('display', 'block');
    $('#' + div).html('');
    query = query.includes('^') ? query.replace('^', '') : query;
    query = query[0] === query[0].toUpperCase() ? query : query[0].toUpperCase() + query.slice(1, );
    $('#currentlyTrendingLocTitle').html('<div class="text-center m-0 " > <p class="m-0 smat-box-title-large  " >Trending from <b>  ' + query + ' </b> </p><p class="pull-text-top mb-1"><small class="text-muted pull-text-top "> </small> </p>')

    const arrayTemp = data;
    let arrayT = [];
    for (const [key, value] of Object.entries(arrayTemp)) {
        if (filterArgument !== 'all') {
            if (value[1] !== filterArgument) {
                continue;
            }
        };
        let category = (value[1] == 'normal') ? 'Normal' : ((value[1] == 'sec') ? 'Security' : ((value[1] == 'com') ? 'Communal' : 'Communal & Security'));

        // let urlArg = key.includes('#') ? key.replace('#', '%23') : '' + key;
        arrayT.push({
            word: key,
            weight: value[0],
            color: categoryColorHexDict[value[1]]

        })
    }
    let minFontSize = 12,
        maxFontSize = 45;
    let padding = 5;
    if (arrayT.length > 10) {
        padding = 0;
        minFontSize = 12, maxFontSize = 30
    } else if (arrayT.length > 25) {
        minFontSize = 12, maxFontSize = 35
        padding = 0;
    }

    $("#" + div).jQWCloud({
        words: arrayT,
        minFont: minFontSize,
        maxFont: maxFontSize,
        verticalEnabled: true,
        padding_left: padding,
        cloud_font_family: 'roboto',
        word_click: function () {
            forwardToHistoricalAnalysis($(this).text(), global_datetime[0], global_datetime[1]);

        },
        word_mouseOver: function () {
            $(this).css('opacity', '50%');
            $(this).css('cursor', 'pointer');
            wordcloudPlot(data_hashtag_latlng, $(this).text());
        },
        word_mouseOut: function () {
            $(this).css('opacity', '100%');
        },


    });

}
