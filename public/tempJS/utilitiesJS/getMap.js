import { displayErrorMsg, makeSmatReady } from '../utilitiesJS/smatExtras.js';
import {
    tweetChunkInfo
} from '../locationMonitor/helper.js';


//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};


export const get_tweet_location = async(query, from = null, to = null, rangeType, filter = null, isDateTimeAlready = 0,pname=null) => {
    let dataArgs;
    if (from != null && to != null && isDateTimeAlready == 0) {
        dataArgs = JSON.stringify({ from, to, query, rangeType, filter, isDateTimeAlready,pname});
    } else if (isDateTimeAlready == 1) {
        dataArgs = JSON.stringify({ from, to, query, rangeType, filter, isDateTimeAlready,pname});
    }
    let response = await fetch('LM/getTweetInfo', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}

export const get_tweet_location_home = async (interval = null, query, fromTime = null, toTime = null, filter = null,pname =null) => {
    let dataArgs;
    if (interval == null && fromTime != null) {
        dataArgs = JSON.stringify({ fromTime, toTime, query,pname});
    } else {
        dataArgs = JSON.stringify({ interval, query,pname});
    }
    if (filter !== null) {
        dataArgs = JSON.stringify({ fromTime, toTime, query, filter,pname});
    }
    let response = await fetch('LM/getTweetInfoHome', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}

export const tweetResults = async (response,id,pname) =>{
    // $('#'+id).css('height', '450px');
    var LocationArray = [];
    var modal = document.querySelector(".modal_lm");
    var closeButton = document.querySelector(".close-button");
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
    var History_Map = L.map(id, {
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        },
        center: [21.1458, 79.0882],
        zoom: 5,
        layers: [tiles, glow]
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
    markerCluster.addTo(History_Map);
    // var modal = document.querySelector(".modal_main_map");
    // var closeButton = document.querySelector(".close-button");
    // closeButton.addEventListener("click", closeModal);
    // window.addEventListener("click", windowOnClick);
    var tweetIcon = L.icon({
        iconUrl: 'public/icons/twitter.png',
        iconSize: [35, 35] // size of the icon
    });

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

    let setView_coordinates = false;
    let setView_coordinates_lat = 0.0;
    let setView_coordinates_lng = 0.0;
    var location_tweet_count = 0;
    var clear_map = true;
    let idx = 0;
    let chunk_size = 1000;
    for (let i = 0; i < response.length / chunk_size; i++) {
        let temp = [];
        for (let j = idx; j < idx + chunk_size; j++) {
            temp.push(response[j]);
        }
        // console.log(temp);
        idx = idx + chunk_size;
        const tweetInfoMap = await tweetChunkInfo(temp,pname);
        // console.log("ttttttt",tweetInfoMap);
        getCompleteMap(tweetInfoMap);
        // clear_map = false;
        
    }
    console.log("all location names",LocationArray);
    // clear_map = true;


    function getCompleteMap(op){
        // if (clear_map==true) {
        //     group1.clearLayers();
        // }

        
        for (var i = 0; i < op.length; i++) {
            
            if (op[i].Latitude != null) {
                LocationArray.push(op[i].t_location);
                // if(setView_coordinates!==true){
                //     setView_coordinates_lat = op[i].Latitude;
                //     setView_coordinates_lng = op[i].Longitude;
                //     setView_coordinates = true;
                // }

                // location_tweet_count = location_tweet_count + 1;
                
                // var senti = op[i].sentiment.value;
                var senti = op[i].sentiment;
                
                if (senti == "0") {

                    let tweet = op[i];

                    let sentiment = '', category = '', media = '', location = '';
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
                    
                    // console.log(div_element);

                    L.marker([parseFloat(op[i]["Latitude"]), parseFloat(op[i]["Longitude"])], {
                        icon: tweetIcon
                    }).bindPopup(div_element).addTo(group1);
                } else if (senti == "1") {
                    let tweet = op[i];

                    let sentiment = '', category = '', media = '', location = '';
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
                    

                    L.marker([parseFloat(op[i]["Latitude"]), parseFloat(op[i]["Longitude"])], {
                        icon: tweetIcon
                    }).bindPopup(div_element).addTo(group1);
                } else if (senti == "2") {
                    let tweet = op[i];

                    let sentiment = '', category = '', media = '', location = '';
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
                    

                    L.marker([parseFloat(op[i]["Latitude"]), parseFloat(op[i]["Longitude"])], {
                        icon: tweetIcon
                    }).bindPopup(div_element).addTo(group1);
                }
                group1.addTo(History_Map);
            }
        }
        
        // var legend = L.control({position: 'bottomright'});

        // legend.onAdd = function (History_Map) {
        //     var div = L.DomUtil.create("div", "legend_info shadow");
            
        //     div.innerHTML += '<i style="background: white"></i><span>Total Tweets       :'+op.length+'</span><br>';
        //     div.innerHTML += '<i style="background: white"></i><span>Tweet with Location:'+location_tweet_count+'</span><br>';
            
            

        //     return div;
        // };

        // legend.addTo(History_Map);


        // $('.legend_info').css({'background':'white','border-radius': '5%','padding': '5px'});
        // if(location_tweet_count==0)
        // {
        //     // displayErrorMsg(id,'error','No Location Found',false);
        //     // $('#'+id).css('height', '50px');
        //     // $('#'+id).html(`<div style="height: 50px;font-size:1.6em;"><div class="text-center ">No Map Data Found.</div></div>`);
        //     $('.legend_info').css({'padding': '25px'});
        //     if(id=='result-div-map'){
        //         $('#'+id).css('height', '400px');
        //         History_Map.invalidateSize();
        //         History_Map.zoomOut(2, {
        //             "animate": true
        //             });
        //     }
        //     else{
        //         $('#'+id).css('height', '450px');
        //         History_Map.invalidateSize('true');
        //         History_Map.zoomOut(2, {
        //             "animate": true
        //             });
        //     }
            

        // }
        // else{
        //     if(id=='result-div-map'){
        //         $('#'+id).css('height', '400px');
        //         History_Map.invalidateSize();
        //         History_Map.setView([setView_coordinates_lat,setView_coordinates_lng], History_Map.getZoom(), {
        //             "animate": true,
        //             "pan": {
        //                 "duration": 2
        //             }
        //             });
        //     }
        //     else{
        //         $('#'+id).css('height', '450px');
        //         History_Map.invalidateSize('true');
        //         History_Map.setView([setView_coordinates_lat,setView_coordinates_lng], History_Map.getZoom(), {
        //             "animate": true,
        //             "pan": {
        //                 "duration": 2
        //             }
        //             })
        //     }
        // }
        }
}


export const getCompleteMap_ = async (id,op)=> {
    // if (clear_map==true) {
        // group1.clearLayers();
    // }
    var modal = document.querySelector(".modal_lm");
    var closeButton = document.querySelector(".close-button");
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
    var History_Map = L.map(id, {
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        },
        center: [21.1458, 79.0882],
        zoom: 5,
        layers: [tiles, glow]
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
    markerCluster.addTo(History_Map);
    // var modal = document.querySelector(".modal_main_map");
    // var closeButton = document.querySelector(".close-button");
    // closeButton.addEventListener("click", closeModal);
    // window.addEventListener("click", windowOnClick);
    var tweetIcon = L.icon({
        iconUrl: 'public/icons/twitter.png',
        iconSize: [35, 35] // size of the icon
    });

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

    let setView_coordinates = false;
    let setView_coordinates_lat = 0.0;
    let setView_coordinates_lng = 0.0;
    var location_tweet_count = 0;

    
    for (var i = 0; i < op.length; i++) {
        
        if (op[i].Latitude != null) {
            if(setView_coordinates!==true){
                setView_coordinates_lat = op[i].Latitude;
                setView_coordinates_lng = op[i].Longitude;
                setView_coordinates = true;
            }

            location_tweet_count = location_tweet_count + 1;
            
            // var senti = op[i].sentiment.value;
            var senti = op[i].sentiment;
            
            if (senti == "0") {

                let tweet = op[i];

                let sentiment = '', category = '', media = '', location = '';
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
                
                // console.log(div_element);

                L.marker([parseFloat(op[i]["Latitude"]), parseFloat(op[i]["Longitude"])], {
                    icon: tweetIcon
                }).bindPopup(div_element).addTo(group1);
            } else if (senti == "1") {
                let tweet = op[i];

                let sentiment = '', category = '', media = '', location = '';
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
                

                L.marker([parseFloat(op[i]["Latitude"]), parseFloat(op[i]["Longitude"])], {
                    icon: tweetIcon
                }).bindPopup(div_element).addTo(group1);
            } else if (senti == "2") {
                let tweet = op[i];

                let sentiment = '', category = '', media = '', location = '';
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
                

                L.marker([parseFloat(op[i]["Latitude"]), parseFloat(op[i]["Longitude"])], {
                    icon: tweetIcon
                }).bindPopup(div_element).addTo(group1);
            }
            group1.addTo(History_Map);
        }
    }
    
    // var legend = L.control({position: 'bottomright'});

    // legend.onAdd = function (History_Map) {
    //     var div = L.DomUtil.create("div", "legend_info shadow");
        
    //     div.innerHTML += '<i style="background: white"></i><span>Total Tweets       :'+op.length+'</span><br>';
    //     div.innerHTML += '<i style="background: white"></i><span>Tweet with Location:'+location_tweet_count+'</span><br>';
        
        

    //     return div;
    // };

    // legend.addTo(History_Map);


    // $('.legend_info').css({'background':'white','border-radius': '5%','padding': '5px'});
    // if(location_tweet_count==0)
    // {
    //     // displayErrorMsg(id,'error','No Location Found',false);
    //     // $('#'+id).css('height', '50px');
    //     // $('#'+id).html(`<div style="height: 50px;font-size:1.6em;"><div class="text-center ">No Map Data Found.</div></div>`);
    //     $('.legend_info').css({'padding': '25px'});
    //     if(id=='result-div-map'){
    //         $('#'+id).css('height', '400px');
    //         History_Map.invalidateSize();
    //         History_Map.zoomOut(2, {
    //             "animate": true
    //             });
    //     }
    //     else{
    //         $('#'+id).css('height', '450px');
    //         History_Map.invalidateSize('true');
    //         History_Map.zoomOut(2, {
    //             "animate": true
    //             });
    //     }
        

    // }
    // else{
    //     if(id=='result-div-map'){
    //         $('#'+id).css('height', '400px');
    //         History_Map.invalidateSize();
    //         History_Map.setView([setView_coordinates_lat,setView_coordinates_lng], History_Map.getZoom(), {
    //             "animate": true,
    //             "pan": {
    //                 "duration": 2
    //             }
    //             });
    //     }
    //     else{
    //         $('#'+id).css('height', '450px');
    //         History_Map.invalidateSize('true');
    //         History_Map.setView([setView_coordinates_lat,setView_coordinates_lng], History_Map.getZoom(), {
    //             "animate": true,
    //             "pan": {
    //                 "duration": 2
    //             }
    //             })
    //     }
    // }
    }