//User Analysis Logic For Vishleshakee version 2.0 , Deployed by OSINT Lab ,IIT-G
//Witten By :: Mala Das , Amitabh Boruah 

//Use camelCase please notations:)



//Imports
import { getTweetInfo} from '../tweetTracking/helper.js';
import { TweetsGenerator } from '../utilitiesJS/TweetGenerator.js';
import { getNetworkTweetIDs } from './networkHelper.js';
import {makeSmatReady,displayErrorMsg} from '../utilitiesJS/smatExtras.js';
import { getCurrentDate, getRangeType, dateProcessor, getDateInFormat, getDateRange } from '../utilitiesJS/smatDate.js';
import { generateUniqueID } from '../utilitiesJS/uniqueIDGenerator.js';
import { getUserDetails,getCooccurDataForUA} from '../userAnalysis/helper.js';
// import { displayErrorMsg, makeAddToStoryDiv } from '../utilitiesJS/smatExtras.js';


var userID, sourceTweet;
var SearchID, TweetID, fromDate, toDate;   //Global Variable to keep Track of current search
var analysisHistory = [];
var historyJSON = {};
var hashtagsList = [];
var mentionsList = [];
var top_tweets = {};
let mention_click = 0;
var mentionUniqueID, hashtagsUniqueID, userID;
const tweetTypeDictShort = { 'Tweet': 'Source', 'retweet': 'Re Tweet', 'QuotedTweet': 'Quoted ', 'Reply': 'Reply ' };


jQuery(function () {
    makeSmatReady();

    if (localStorage.getItem('smat.me')) {
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        userID = userInfoTemp['id'];
    } else {
        window.location.href = 'login';
    }

    mentionUniqueID = generateUniqueID();
    hashtagsUniqueID = generateUniqueID();

    toDate = getCurrentDate();
    fromDate = dateProcessor(toDate, '-', 3);
    if (incoming) {
        if (fromDateReceived && toDateReceived && tweetIdReceived) {
            fromDate = fromDateReceived;
            toDate = toDateReceived;
            TweetID = tweetIdReceived;
        }
        SearchID = incoming;
    }


    // console.log(SearchID);
    getUserDetails("$"+SearchID).then(data => makePageReady(data));

    tracker(TweetID).then(response => {
    printTweetHierarchy(response,'tweet-Heirarchy',0)

    for(let i =0;i<Object.keys(response).length;i++)
        {   
            response[Object.keys(response)[i]].mentions.map(function(a){mentionsList.push(a)});
            response[Object.keys(response)[i]].hashtags.map(function(a){hashtagsList.push(a)});
        }
        mentionsList.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
        hashtagsList.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
     
        
        getNetworkTweetIDs("$"+SearchID, fromDate, toDate , "day", null, 0,hashtagsList, mentionsList).then(response2 => {
            // console.log("Count results",response2);
            top_tweets = response2.tweetCount.sort(function(a, b){
                return a.total-b.total;
            });
            console.log(top_tweets);
            $("#retweetCount").text(top_tweets[top_tweets.length-1].retweet);
            $("#replyCount").text(top_tweets[top_tweets.length-1].Reply);
            $("#quotedCount").text(top_tweets[top_tweets.length-1].QuotedTweet);
            TweetsGenerator([top_tweets[top_tweets.length-1].tid], 1, 'topTweet', null, null, 'all');
            TweetsGenerator(response2.tweetId, 6, 'networkUserTweetDiv', null, null, 'all');
            
        });

        getCooccurDataForUA("$"+SearchID, fromDate, toDate, 'hashtag', hashtagsUniqueID, userID).then(response => {
            // console.log(response[0].data);
            
            let arrayT = [];
            response[0].data.forEach(function(a){
                if(hashtagsList.includes(a.hashtag.split("#")[1])){
                    // console.log("1");
                    arrayT.push({
                        word: a.hashtag,
                        weight: a.count,
                        color: '#FF00FF'
                
                        });   
                }
                else{
                    // console.log("2");
                    arrayT.push({
                        word: a.hashtag,
                        weight: a.count,
                        color: '#297EB4'
                
                        });
                }
                
            });
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
        
            $("#" + "hashtagWC").jQWCloud({
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
            
        });
        $('body').on('click', 'div #pills-profile-tab', function () {
            if(mention_click==0){
                    getCooccurDataForUA("$"+SearchID, fromDate, toDate, 'mention', mentionUniqueID, userID).then(response => {
                        // console.log(response[0].data);
                        
                        let arrayT = [];
                        response[0].data.forEach(function(a){
                            if(mentionsList.includes(a.handle.split("@")[1])){
                                // console.log("1");
                                arrayT.push({
                                    word: a.handle,
                                    weight: a.count,
                                    color: '#FF00FF'
                            
                                    });   
                            }
                            else{
                                // console.log("2");
                                arrayT.push({
                                    word: a.handle,
                                    weight: a.count,
                                    color: '#297EB4'
                            
                                    });
                            }
                            
                        });
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
                    
                        $("#" + "mentionWC").jQWCloud({
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
                        
                    });
                    mention_click = mention_click +1;
                }
            });
    });

    // Top hashtags and mentions

});
const printTweetHierarchy = async (json, div, offset) => {
    // $('#' + div).html('<div class="d-flex justify-content-center hierarchyDiv" id="heirarychyMain-' + offset + '"><div class="" id="heirarychyChild-' + offset + '-2"  ></div><div class="" id="heirarychyChild-' + offset + '-3"  ></div><div class="" id="heirarychyChild-' + offset + '-4"  ></div></div>')
    // console.log('JSON',json)
    let separator1 = '<div class="pt-4 separator" id="separator1-' + offset + '">-----</div>';
    let separator2 = '<div class="pt-4 separator" id="separator2-' + offset + '" >----></div>';
    let mainNode = '';
    let relationship = '';
    let sourceTag = '';
    let sourceAuthor = '';
    let sourceID = null
    let currentQueryBadge = '';
    
    for (const [key, value] of Object.entries(analysisHistory[offset])) {
        if (value['type'] == 'Tweet') {
            await getTweetInfo(key).then(response => {
                sourceID = key;
                sourceAuthor = response.author
                let arrTemp = [response];
            });
        }
    };
    $('#sourceInfo').fadeIn('slow')
    let highestPriority = json[sourceID]['priority'];
    let DOM = '<div class="d-flex justify-content-center hierarchyDiv" id="heirarychyMain-' + offset + '">'
    for (let i = highestPriority; i >= 0; i--) {
        DOM += '<div class="" id="heirarychyChild-' + offset + '-' + i + '"></div>';
    }
    DOM += '</div>'
    // console.log(analysisHistory);
    $('#' + div).html(DOM);
    let namePrev = '';
    for (let key in json) {
        if (json[json[key]['source']]) {
            namePrev = json[json[key]['source']]['author']
        }
        sourceTag = json[key]['priority'] == highestPriority ? '<div class="text-center" ><span class="badge badge-danger " > Source Tweet</span></div>' : '';
        currentQueryBadge = key == incoming ? '<div class="text-center" style="margin-top:-17px;" ><span class="badge badge-primary " > Query </span></div>' : '';
        relationship = '<div class="pt-4"   ><button class="btn btn-sm btn-primary p-1 relationshipNode" data-container="body" data-trigger="hover" data-html="true" data-toggle="popover" data-placement="top" data-content="The tweet posted by <b>' + json[key]['author'] + '</b> is a ' + tweetTypeDictShort[json[key]['type']] + '  of  <b>' + namePrev + '</b>"  style="display:none;">' + tweetTypeDictShort[json[key]['type']] + '</button></div>';
        mainNode = '<div class="trackHierarchyNode" id="node-' + key + '-' + offset + '"  style="max-width:100px;">' + currentQueryBadge + '<div class="profilePictureDiv trackProfilePic p-1 text-center " value="' + key + '"><img class="openTweetRaw" src="' + json[key]['author_profile_image'] + '" style="height:55px;border-radius:50%"  value="' + key + '"/> </div><div class=" text-truncate">' + json[key]['author'] + '</div><div>' + sourceTag + '</div> <div class="badge badge-primary p-1 seeTweet" value=' + key + '>See Tweet</div></div>';
        if (json[key]['priority'] < highestPriority) {
            $('#heirarychyChild-' + offset + '-' + json[key]['priority']).html('<div class="d-flex">' + separator1 + relationship + separator2 + mainNode + '</div>');
        } else if (json[key]['priority'] == highestPriority) {
            $('#heirarychyChild-' + offset + '-' + json[key]['priority']).html('<div class="d-flex">' + mainNode + '</div>');
        }
    }
    $('[data-toggle="popover"]').popover();

    $('.relationshipNode').fadeIn(1000 * 2)
}
const tracker = async (searhIDTemp) => {
    // This code this written to bring down the time complexity from a quadratic time complexity to linear.
    let foundSourceFlag = 0;
    let maximumDependenceLevel = 15 //i.e : 0 to 2 --> 3 steps
    let type = '', tid;

    let i = 0;
    while (foundSourceFlag == 0) {
        await getTweetInfo(searhIDTemp).then(response => {
            tid = response.tid;
            if (response.message) {
                foundSourceFlag = 1;
                $('.ttContent').remove();
                displayErrorMsg('trackAnalysisMain', 'error', 'No Tracking Data Found', false);
                $('#trackAnalysisMain').fadeIn("slow")
            }
            // console.log("issue",response);
            if (response.mentions===null){
                response.mentions = {};
                response.mentions["values"]=[];
            }
            if (response.hashtags===null){
                response.hashtags = {};
                response.hashtags["values"]=[];
            }
            if (response.type === 'Tweet') {
                foundSourceFlag = 1;
                type = 'Tweet';
                sourceTweet = tid;
                historyJSON[tid] = { 'id': tid, 'type': type, 'source': null, 'priority': i, 'author': response.author, 'author_profile_image': response.author_profile_image,'hashtags':response.hashtags.values,'mentions':response.mentions.values };
            }
            else if (response.type === 'retweet') {
                type = 'retweet';
                historyJSON[tid] = { 'id': tid, 'type': type, 'source': response.retweet_source_id, 'priority': i, 'author': response.author, 'author_profile_image': response.author_profile_image,'hashtags':response.hashtags.values,'mentions':response.mentions.values };
                searhIDTemp = response.retweet_source_id;
            } else if (response.type === "QuotedTweet") {
                type = 'QuotedTweet';
                historyJSON[tid] = { 'id': tid, 'type': type, 'source': response.quoted_source_id, 'priority': i, 'author': response.author, 'author_profile_image': response.author_profile_image,'hashtags':response.hashtags.values,'mentions':response.mentions.values };
                searhIDTemp = response.quoted_source_id;
            } else if (response.type === "Reply") {
                type = 'Reply';
                historyJSON[tid] = { 'id': tid, 'type': type, 'source': response.replyto_source_id, 'priority': i, 'author': response.author, 'author_profile_image': response.author_profile_image,'hashtags':response.hashtags.values,'mentions':response.mentions.values };
                searhIDTemp = response.replyto_source_id;
            }

        });

        i += 1;
    }
    analysisHistory.push(historyJSON);
    return historyJSON;

  
}

const makePageReady = (userDetails) => {
    // $('.haTab').removeClass('active show');
    // $('#freqContentUA').addClass('active show');
    // $('.uaNav').removeClass('active');
    // $('#frqTabUA').addClass('active');
    // $('#UAAnalysisDiv').css('display', 'block');
    $("#currentUAProfilePic").attr("src", userDetails.profile_image_url_https.includes('_normal') ? userDetails.profile_image_url_https.replace('_normal', '') : userDetails.profile_image_url_https);
    $('#currentUAUserName').text(userDetails.author);
    $('#showingResultsFor').text(userDetails.author);
    $('#currentUAVerified').html(userDetails.verified === "True" ? '<img class="verifiedIcon" src="public/icons/smat-verified.png"/>' : '');

    $('#currentUAUserHandle').text('@' + userDetails.author_screen_name);
    $('#userDetailsID').text(SearchID.replace('$', ''));
    let createdOn = new Date(userDetails.created_at.seconds * 1000);
    $('#userDetailsJOINEDON').text(createdOn);
    $('#userDetailsLOCATION').text(userDetails.location == null ? 'Location not shared by user' : userDetails.location);
    $('#userDetailsBIO').text(userDetails.description == null ? 'Bio not available' : userDetails.description);
    $('#userDetailsURL').html(userDetails.url == null ? 'URL not available' : '<a href=' + userDetails.url + ' target="_blank">' + userDetails.url + '</a>');

    // let tweetDivHeight = $('#ua-leftDiv').height();
    // $('.uaTabTopRight').css('height', tweetDivHeight - 88 + 'px');
}

const createTweetAnalysis = (tweetID, from, to, div, profilePic, author, datesData, allotedIDargs = null, groupByType = null, originalDateData = null) => {

    $('#trackAnalysisMain').css('display', 'none')
    let checkFlag = 0;
    if (originalDateData.length == 1 && originalDateData[0][1] == 1) {
        checkFlag = 1;
    }

    let allotedID;
    if (allotedIDargs != null) {
        allotedID = allotedIDargs;
    } else {

        allotedID = allocatedIDRecords.length;
        allocatedIDRecords[tweetID] = [{ 'allotedID': allotedID }];
    }
    if (allocatedIDRecords[tweetID] && allotedID == allocatedIDRecords[tweetID][0]['allotedID']) {
        currentlyWatching[allocatedIDRecords[tweetID][0]['allotedID']] = tweetID;
    }
    let rangeType = groupByType;

    let chartDom = '<div class="mt-1 mx-3"><div class="mb-1">Frequency Distribution of <b>' + author + '\'s</b> <span class="seeTweet clickable" value="' + tweetID + '">tweet </span> from ' + from + ' to ' + to + '</div> <div class="d-flex"> <ul class="nav nav-pills mb-2"  role="tablist"><li class="nav-item"><a class="nav-link active smat-rounded " id="retweetTab-' + allotedID + '" data-toggle="pill" href="#retweetTabContent-' + allotedID + '" role="tab" aria-controls="retweetTabContent-' + allotedID + '" aria-selected="true">Retweet Frequency</a></li> <li class="nav-item"><a class="nav-link smat-rounded   " id="quotedTab-' + allotedID + '" data-toggle="pill" href="#quotedTabContent-' + allotedID + '" role="tab" aria-controls="pills-profile" aria-selected="false">Quoted Frequency </a></li> <li class="nav-item"><a class="nav-link smat-rounded   " id="replyTab-' + allotedID + '" data-toggle="pill" href="#replyTabContent-' + allotedID + '" role="tab" aria-controls="pills-profile" aria-selected="false">Reply Frequency </a></li></ul> </div><div class="tab-content" id="pills-tabContent"><div class="tab-pane  show active  trackChartDiv" id="retweetTabContent-' + allotedID + '" role="tabpanel" aria-labelledby="retweetTabContent-' + allotedID + '"></div><div class="tab-pane   trackChartDiv  " id="quotedTabContent-' + allotedID + '" role="tabpanel" aria-labelledby="quotedTabContent-' + allotedID + '"></div><div class="tab-pane   trackChartDiv  " id="replyTabContent-' + allotedID + '" role="tabpanel" aria-labelledby="replyTabContent-' + allotedID + '"></div> </div>';

    let networkDiv = '<div  class="row px-3"  ><div class="col-md-12 border p-0" > <div  > </div> </div><div class="col-md-0 border"></div> </div>'

    $('#trackAnalysisMain').fadeIn("slow")
    $('#' + div).html('');
    $('#' + div).html('<div class="my-3 pb-1 "><div class="justify-content-center" id="groupByItems-' + allotedID + '"></div><div class="row "><div class="col-sm-12"><div class="row justify-content-center pt-4  px-3 pl-1" id="hierarchy-' + allotedID + '"> </div></div></div><div id="connect" style="height:2px;"></div><div id="notFound-' + allotedID + '"></div><div id="analysisDOM-' + allotedID + '"></div>');
    drawDateBox(allotedID, tweetID, from, to, groupByType);
    printTweetHierarchy(analysisHistory[allotedID], 'hierarchy-' + allotedID, allotedID).then(response => {
        if (datesData.length < 1 || checkFlag == 1) {

            displayNoTrackFoundForTracking(tweetID, allotedID, from, to)
        } else {

            let tabsForMapANDPlot = '<div class="mt-3"><ul class="nav nav-pills"><li class="nav-item"><a class="nav-link mx-2 smat-rounded active" data-toggle="pill" href="#locationTab">Location Distribution</a></li><li class="nav-item"><a class="nav-link mx-2 smat-rounded " data-toggle="pill" href="#frequencyTab">Frequency Distribution</a></li></ul></div>';

            $('#analysisDOM-' + allotedID).html('<div class="row justify-content-center" > <div class="col-sm-2"><div id="referenceLine-' + allotedID + '" style="display:none;"></div> <div class="trackDateList px-4" id="trackDates-' + allotedID + '"> </div> </div><div class="col-sm-9">    <div class="row"><div class="col-sm-3">  <div id="secondCol-' + allotedID + '"> <div id="datesOptional-' + allotedID + '" >  </div> <div  id="trackCategoryInfo-' + allotedID + '"  > </div> </div>     </div><div class="col-sm-9 pr-1">   <div class="tweetRawTrackDiv bg-white shadow  mt-4 p-3 " style="border-radius:24px;">   <div class="  mb-1">Showing <b class="font-weight-bold" id="currentlyShowingTweetType-' + allotedID + '"></b> for the tweet posted by <b>' + author + '</b> </div>   <div   id="trackRawData-' + allotedID + '" ></div></div>   </div></div> ' + tabsForMapANDPlot + '   <div class="tab-content bg-white px-2 pt-2 pb-4 mt-2" style="border-radius:24px;"><div id="locationTab" class="tab-pane active"><div class="my-1 px-3">Locations of users(if shared) reposting <b>' + author + '\'s</b> <span class="seeTweet clickable" value="' + tweetID + '">tweet</span></div><div class="px-3" id="trackMap-' + allotedID + '"></div></div><div id="frequencyTab" class="tab-pane">' + chartDom + '</div></div></div>            </div></div>')
            drawconnectingboxes(allotedID, tweetID, datesData, profilePic, author, groupByType);
            drawHierarchyLine(tweetID, allotedID);
            if (groupByType == 'month') {
                // alert(month);
                let firstYear = Object.keys(datesData)[0];
                let firstMonth = Object.keys(datesData[Object.keys(datesData)[0]])[0]
                dateCardTriggered(tweetID, datesData[firstYear][firstMonth][0], 0, groupByType, Object.keys(datesData[Object.keys(datesData)[0]])[0])

            } else if (groupByType == 'week') {
                let firstYear = Object.keys(datesData)[0];
                let firstMonth = Object.keys(datesData[Object.keys(datesData)[0]])[0]
                let firstWeek = Object.keys(datesData[Object.keys(datesData)[0]][Object.keys(datesData[Object.keys(datesData)[0]])[0]])[0];
                dateCardTriggered(tweetID, datesData[firstYear][firstMonth][firstWeek][0], 0, groupByType, firstMonth, firstWeek);


            } else if (groupByType == 'day') {

                dateCardTriggered(tweetID, from, 0, groupByType, null)
            }

            makeFreqDistChart(tweetID, from, to, groupByType, allotedID)
            // getTweetsForMap(tweetID, from, to, allotedID, groupByType, originalDateData);

        }

    });
    
}