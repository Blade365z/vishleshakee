/*
The Script contains the modules to render charts in Modules namely Tweet Tracking (Authunticated) of  of the Social Media Analysis tool 
developed at OSINT LAB , IIT-G

-----------------------------
IMPORTANT NOTE
-----------------------------
1.Use camelCase notations:)
2.Avoid using synchronous requests as XML-http-requests has been deprecated already.


Script written by : Mala Das(maladas601@gmail.com), Amitabh Boruah(amitabhyo@gmail.com)
*/


/*
Test ID's:
1. Retweet : 3257530106
2. Quoted : 1303260892776128512
3: Three levels : 1303260736936792064,1303260963039133698
retweet,reply,tweet,quotedTweet

http://172.16.117.160/vishleshakee/tracking?tweetID=1310236170706497538
*/

import { generate_tweets_div, TweetsGenerator } from '../utilitiesJS/TweetGenerator.js';
import { getTweetInfo, getFreqDataForTweets, getTweetsForSource, getDatesDist, getTweetsPlotDataForMap, getNetworkForSource } from './helper.js';
import { displayErrorMsg, makeAddToStoryDiv, makeSmatReady } from '../utilitiesJS/smatExtras.js';
import { getCurrentDate, ordinal_suffix_of } from '../utilitiesJS/smatDate.js';
import { drawFreqDataForTweet, drawFreqDataForTweetMonth } from './chartHelper.js';
import { get_tweet_location, getCompleteMap } from '../utilitiesJS/getMap.js';
import {
    getMe
} from '../home/helper.js';

//Globals
var tweetDiv = 'tweetDiv';
var currentQuery, currentlyAnalysed, fromDate, toDate;
var divOffsetFlag = 0, sourceTweet; //As in offset 0 the currently searched Tweet would be printed;
const tweetTypeDict = { 'Tweet': 'Source Tweet', 'retweet': 'Re Tweet', 'QuotedTweet': 'Quoted Tweet', 'Reply': 'Reply Tweet' };
const tweetTypeDictShort = { 'Tweet': 'Source', 'retweet': 'Re Tweet', 'QuotedTweet': 'Quoted ', 'Reply': 'Reply ' };
var historyJSON = {};
var tweets = [];
var analysisHistory = [], currentlyWatching = [];
var allocatedIDRecords = [];
var userID;
var isNetworkDisplaying = 0;
//Logic
jQuery(function () {
    getMe().then(id => {
        userID = id;
    });

    $('#mainQuery').fadeIn('slow')

    makeSmatReady();
    $('body').on('click', 'div .username', function () {
        let queryCaptured = '$' + $(this).attr('value');
        queryCaptured = encodeURIComponent(queryCaptured);
        let redirectURL = 'userAnalysis' + '?query=' + queryCaptured + '&from=' + fromDate + '&to=' + toDate;
        window.open(redirectURL, '_blank');
    });



    $('body').on('click', 'div .tweetAnalysisBtn', function () {
        let idCaptured = $(this).attr('value');
        initiateTweetAnalysis(idCaptured, fromDate, toDate, historyJSON[idCaptured]['type']);
    });

    $('body').on('click', 'div .groupByRadio', function () {
        $('.groupByRadio').prop('checked', false);
        $(this).prop('checked', true);
        let arr = $(this).attr('value');
        arr = arr.split(/[|]/).filter(Boolean);
        //Add Year also  as key , object -> year -> month -> Data
        getDatesDist(arr[0], arr[3], arr[4], 'all').then(response => {

            if (response.data.length < 1) {
                displayNoTrackFoundForTracking(arr[0], arr[1], arr[3], arr[4]);
            } else {
                if (arr[2] == 'month') {

                    let objTemp = {};
                    response.data.forEach(element => {
                        let year = element[0].split(/[-]/).filter(Boolean)[0];
                        if (objTemp[year]) {

                            if (objTemp[year][element[2]]) {
                                objTemp[year][element[2]][1] = objTemp[year][element[2]][1] + element[1];
                                objTemp[year][element[2]][0] = objTemp[year][element[2]][0] + '*' + element[0];
                            } else {
                                objTemp[year][element[2]] = [element[0], element[1]]
                            }
                        } else {
                            objTemp[year] = { [element[2]]: [element[0], element[1]] }
                        }

                    });
                    getTweetInfo(arr[0]).then(raw => {
                        createTweetAnalysis(arr[0], arr[3], arr[4], 'trackAnalysisMain', raw.author_profile_image, raw.author, objTemp, arr[1], 'month', response.data);
                    });

                } else if (arr[2] == 'day') {
                    getTweetInfo(arr[0]).then(raw => {
                        createTweetAnalysis(arr[0], arr[3], arr[4], 'trackAnalysisMain', raw.author_profile_image, raw.author, response.data, arr[1], 'day', response.data);
                    });
                } else if (arr[2] == 'week') {
                    let objTemp = {};
                    processDataForWeek(response.data).then(obj => {
                        getTweetInfo(arr[0]).then(raw => {
                            createTweetAnalysis(arr[0], arr[3], arr[4], 'trackAnalysisMain', raw.author_profile_image, raw.author, obj, arr[1], 'week', response.data);
                        });
                    })

                }

            }

        });
    })

    $('#ttDateForm').on('submit', function (e) {
        e.preventDefault();
        fromDate = $('#fromDateTT').val();
        toDate = $('#toDateTT').val();
        getTweetInfo(historyJSON[sourceTweet]['id']).then(response => {
            if (response) {
                initiateTweetAnalysis(historyJSON[sourceTweet]['id'], fromDate, toDate, historyJSON[sourceTweet]['type'], response)
            }
        });
    })


    if (tweetIDCaptured) {
        currentQuery = tweetIDCaptured;
    } else {
        console.log('Nothing capt.')
    }

    //Check if currently queried Tweet is the sourceTweetAlready!
    getTweetInfo(currentQuery).then(response => {
        let arrTemp = [response];
        generate_tweets_div(arrTemp, 'mainQuery', true, false)
        $('#queryAuthor').text(response.author);
        $('#dateQuery').text(response.datetime);

        if (response.type === 'Tweet') {
            if (response) {
                historyJSON[currentQuery] = { 'id': currentQuery, 'type': 'Tweet', 'source': response.replyto_source_id, 'priority': 1, 'author': response.author, 'author_profile_image': response.author_profile_image };
                        sourceTweet=currentQuery;
                analysisHistory.push(historyJSON);
                let dateArr = response.datetime.split(' ');
                fromDate = dateArr[0];
                toDate = getCurrentDate(); //change this if you want to make date dynamic
                getDatesDist(currentQuery, fromDate, toDate, 'all').then(dateData => {

                    createTweetAnalysis(currentQuery, fromDate, toDate, 'trackAnalysisMain', response.author_profile_image, response.author, dateData.data, null, 'day', dateData.data);
                });

            }
        } else {
            tracker(currentQuery);
        }
    });

    $('body').on('click', '#bring', async function () {
        console.log("This is the source tweet 2", sourceTweet);
        getTweetsForSource(sourceTweet, '2020-10-31', null, 'all').then(response => {
            let arrTemp = response.data
        });
    });

    $('body').on('click', '.seeTweet', async function () {
        let id = $(this).attr('value');
        getTweetInfo(id).then(response => {
            let aTemp = [response];
            $('#tweetsModal').modal('show');
            generate_tweets_div(aTemp, 'tweets-modal-div', true, false)
        });
    });

    $('body').on('click', 'div .trackDateCard  ', function () {
        let valueArr = $(this).attr('value');
        valueArr = valueArr.split(/[|]/).filter(Boolean);
        console.log(valueArr);
        if (valueArr[3] == 'month') {
            dateCardTriggered(valueArr[1], valueArr[0], valueArr[2], valueArr[3], valueArr[4]);
        } if (valueArr[3] == 'week') {
            dateCardTriggered(valueArr[1], valueArr[0], valueArr[2], valueArr[3], valueArr[4], valueArr[5]);
        }
        else if (valueArr[3] == 'day') {
            dateCardTriggered(valueArr[1], valueArr[0], valueArr[2], valueArr[3]);
        }
    })

    $('body').on('click', '.datesOptionalCard ', function () {
        let valueArr = $(this).attr('value');
        valueArr = valueArr.split(/[|]/).filter(Boolean);
        $('.datesOptionalCard').removeClass('activeDate')
        $(this).addClass('activeDate')
        drawBoxesForCategories(allocatedIDRecords[valueArr[1]][0]['allotedID'], valueArr[1], valueArr[0], valueArr[3], valueArr[4], valueArr[5] ? null : valueArr[5])
    })



    //trackCategoryBox
    $('body').on('click', 'div .trackCategoryBox', function () {
        let valueArr = $(this).attr('value');
        valueArr = valueArr.split(/[|]/).filter(Boolean);
        getRawTweets(valueArr[0], valueArr[1], valueArr[2]);
        //TODO::Radjeep

    });

    $('body').on('submit', '.trackDateForm', function (e) {
        e.preventDefault();
        let valueArr = $(this).attr('value');
        valueArr = valueArr.split(/[|]/).filter(Boolean);
        let fromTemp = $('#fromDateTrack-' + valueArr[0] + '-' + valueArr[1]).val();
        let toTemp = $('#toDateTrack-' + valueArr[0] + '-' + valueArr[1]).val();
        getTweetInfo(valueArr[0]).then(tweetRawData => {
            getDatesDist(valueArr[0], fromTemp, toTemp, 'all').then(response => {
                if (response.data.length > 0) {
                    console.log(response)
                    fromTemp = response.data[0][0]

                }
                createTweetAnalysis(valueArr[0], fromTemp, toTemp, 'trackAnalysisMain', tweetRawData.author_profile_image, tweetRawData.author, response.data, valueArr[1], 'day', response.data);
            });

        });

    });
    $('body').on('click', '#generateNetwork', function () {
        getDatesDist(sourceTweet, fromDate, toDate, 'all').then(response => {
            createNetworkForTrack(sourceTweet, response);
        })

    })

    $('body').on('click', 'div .openTweetRaw', function () {
        let value = $(this).attr('value');
        getTweetInfo(value).then(tweetRawData => {

            if (tweetRawData.type == 'retweet') {
                // alert('No tracking available for Re-Tweets!')
            } else {
                let dateArr = tweetRawData.datetime.split(' ');
                fromDate = dateArr[0];
                toDate = getCurrentDate(); //change this if you want to make date dynamic
                getDatesDist(value, fromDate, toDate, 'all').then(response => {
                    createTweetAnalysis(value, fromDate, toDate, 'trackAnalysisMain', tweetRawData.author_profile_image, tweetRawData.author, response.data, null, 'day', response.data);
                })

            }
        });
    });
    $('body').on('click', 'div #generateNetworkTrack', function () {
        alert();
    });
    $(window).on('resize', function () {
        currentlyWatching.forEach(element => {
            if (allocatedIDRecords[element]) {
                readjustLines(element, allocatedIDRecords[element][0]['allotedID']);
            }
        });
    })


});




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
            if (response.type === 'Tweet') {
                foundSourceFlag = 1;
                type = 'Tweet';
                sourceTweet = tid;
                historyJSON[tid] = { 'id': tid, 'type': type, 'source': null, 'priority': i, 'author': response.author, 'author_profile_image': response.author_profile_image };
            }
            else if (response.type === 'retweet') {
                type = 'retweet';
                historyJSON[tid] = { 'id': tid, 'type': type, 'source': response.retweet_source_id, 'priority': i, 'author': response.author, 'author_profile_image': response.author_profile_image };
                searhIDTemp = response.retweet_source_id;
            } else if (response.type === "QuotedTweet") {
                type = 'QuotedTweet';
                historyJSON[tid] = { 'id': tid, 'type': type, 'source': response.quoted_source_id, 'priority': i, 'author': response.author, 'author_profile_image': response.author_profile_image };
                searhIDTemp = response.quoted_source_id;
            } else if (response.type === "Reply") {
                type = 'Reply';
                historyJSON[tid] = { 'id': tid, 'type': type, 'source': response.replyto_source_id, 'priority': i, 'author': response.author, 'author_profile_image': response.author_profile_image };
                searhIDTemp = response.replyto_source_id;
            }

        });

        i += 1;
    }
    analysisHistory.push(historyJSON);

    getTweetInfo(sourceTweet).then(tweetRawData => {
        if (tweetRawData) {
            let dateArr = tweetRawData.datetime.split(' ');
            fromDate = dateArr[0];
            $('.sourceProfPic').html('<div class="profilePictureDiv p-1 text-center mr-2"><img src="' + tweetRawData.author_profile_image + '" style="height:33px;border-radius:50%"></div>')
            $('.sourceAuthor').html('<div> <p class="pt-1 m-0 font-weight-bold username" value="1731554581">' +
                tweetRawData.author + ' </p><p class="smat-dash-title pull-text-top m-0 "> @' + tweetRawData.author_screen_name + ' </p></div>')
            toDate = getCurrentDate(); //change this if you want to make date dynamic
            getDatesDist(sourceTweet, fromDate, toDate, 'all').then(response => {
                createTweetAnalysis(sourceTweet, fromDate, toDate, 'trackAnalysisMain', tweetRawData.author_profile_image, tweetRawData.author, response.data, null, 'day', response.data);

            })
        }
    });
}
const printTweetOnDiv = (data, offset, type) => {
    adjustLines();
    divOffsetFlag = 1; //TODO check left for source.
    $('.level' + '-' + offset).css('display', 'block');
    let divTemp = tweetDiv + '-' + offset;
    data = [data];
    let analysisBtnFlag = false
    if (type === 'QuotedTweet' || type === 'Reply' || type === 'Tweet') {
        analysisBtnFlag = true
    }
    $('#tweetTitle' + '-' + offset).text(tweetTypeDict[type]);
    generate_tweets_div(data, divTemp, true, analysisBtnFlag)

}


const adjustLines = () => {
    let widthOfTweetCard = $('.tweetCard').css('width');
    widthOfTweetCard = widthOfTweetCard.includes('px') ? widthOfTweetCard.replace('px', '') : widthOfTweetCard;
    widthOfTweetCard = Math.round(widthOfTweetCard) / 2;

    $('.tweetBoxConnector').attr('x1', widthOfTweetCard);
    $('.tweetBoxConnector').attr('x2', widthOfTweetCard);
}

const initiateTweetAnalysis = async (id, from, to, type, raw) => {
    let data = [];
    $('#trackAnalysisMainDiv').css('display', 'block');
    if (from && to) {
        $('#fromDateTT').val(from);
        $('#toDateTT').val(to);
    }
    // id = '1308832944925147146'; //hardcoding it for now.
    currentlyAnalysed = id;
    $('#analysisType').text(tweetTypeDict[type]);
    $('.TTtab').html('<div class="text-center  smat-loader " ><i class="fa fa-circle-o-notch donutSpinner mt-5" aria-hidden="true"></i></div>');
    // console.log('Analysis submitted for : ' + currentlyAnalysed + ' From:' + from + ' to:' + to + ' Type:' + type);
    await getFreqDataForTweets(id, from, to, 'retweet').then(response => {
        // data.push(response['data'].flat());
        if (response.data.length < 1) {
            $('#retweetContent').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
        } else {
            data['retweet'] = response['data'];
            drawFreqDataForTweet(response, 'retweetContent', id, 'retweet');
        }
    });
    await getFreqDataForTweets(id, from, to, 'QuotedTweet').then(response => {

        // data.push(response['data'].flat());
        if (response.data.length < 1) {
            $('#quotedtweetContent').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
        } else {
            data['QuotedTweet'] = response['data'];
            drawFreqDataForTweet(response, 'quotedtweetContent', id, 'QuotedTweet');
        }
    });
    await getFreqDataForTweets(id, from, to, 'Reply').then(response => {
        // data.push(response['data'].flat());
        if (response.data.length < 1) {
            $('#replytweetContent').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
        } else {
            data['Reply'] = response['data'];
            drawFreqDataForTweet(response, 'replytweetContent', id, 'Reply');
        }
    });



}


//DateInput Box
const drawDateBox = (offset, tweetID, from = null, to = null, groupByType) => {
    // $('#dateInputTrack-').html('');
    let ischeckedDate = 'checked', ischeckedMonth = '', ischeckedWeek = '';
    if (groupByType == 'month') {
        ischeckedMonth = 'checked';
        ischeckedDate = ''
    } else if (groupByType == 'week') {
        ischeckedWeek = 'checked'
        ischeckedDate = ''
    }
    $('#groupByItems-' + offset).html('<div><div class="d-flex mb-1 justify-content-center"><span class="text-dark font-weight-bold mr-2">Group By </span><div class="mx-2"><input class="groupByRadio" type="radio" id="radioDay-' + tweetID + '-' + offset + '"   value="' + tweetID + '|' + offset + '|' + 'day' + '|' + from + '|' + to + '"  ' + ischeckedDate + '><label for="radioDay-' + tweetID + '-' + offset + '"  class="text-dark mx-1">Day-wise</label></div><div class="mx-1"><input type="radio" class="groupByRadio"   id="radioMonth-' + tweetID + '-' + offset + '"   value="' + tweetID + '|' + offset + '|' + 'month' + '|' + from + '|' + to + '" ' + ischeckedMonth + ' ><label for="radioMonth-' + tweetID + '-' + offset + '"   class="text-dark mx-1 ">Month-wise</label></div><div class="mx-1"><input type="radio" class="groupByRadio"   id="radioWeek-' + tweetID + '-' + offset + '"   value="' + tweetID + '|' + offset + '|' + 'week' + '|' + from + '|' + to + '"  ' + ischeckedWeek + ' ><label for="radioWeek-' + tweetID + '-' + offset + '"   class="text-dark mx-1 ">Week-wise</label></div></div> </div><div class="text-dark text-center pull-text-top">Showing track from <span class="font-weight-bold">' + from + '</span> to <span class="font-weight-bold">' + to + '</span></div>');
    $('#fromDateTrack-' + tweetID + '-' + offset).datepicker();
    $('#toDateTrack-' + tweetID + '-' + offset).datepicker();
    if (from && to) {
        $('#fromDateTrack-' + tweetID + '-' + offset).val(from);
        $('#toDateTrack-' + tweetID + '-' + offset).val(to);
    }
    $('#dateQueryTrack').fadeIn('slow')

}


const drawconnectingboxes = (offset, tweetID, data, profilePic = null, author = null, groupByType) => {
    // $('#trackDates-' + offset).html('<div id="sourceNode-'+tweetID+'-'+offset+'"> <div class="profilePictureDiv p-1 text-center mr-2"><img class="openTweetRaw" src="' + profilePic + '" style="height:55px;border-radius:50%"   value="'+tweetID+'"></div><div class=" text-truncate">' + autho r + '</div></div>')
    $('#referenceLine-' + offset).html('<svg height="50"><line class="trackDateConnecter" x1="105" y1="0" x2="105" y2="50" stroke="grey" stroke-width="2" ></line></svg> ')
    $('#referenceLine-' + offset).fadeIn(100);
    $('#trackDates-0').html('');
    if (groupByType == 'month') {
        let counter = 0;
        for (const [key1, months] of Object.entries(data)) {
            for (const [key, value] of Object.entries(months)) {

                $('#trackDates-0').append('<div id="dateLevel-' + tweetID + '-' + counter + '" style="display: block;"><svg height="50"><line class="trackDateConnecter" x1="80.5" y1="0" x2="80.5" y2="50" stroke="grey" stroke-width="2" id="dateLine-' + tweetID + '-' + counter + '"></line></svg><div class="card trackDateCard shadow" value="' + months[key][0] + '|' + tweetID + '|' + counter + '|' + 'month' + '|' + key + '"  id="dateCard-' + tweetID + '-' + offset + '-' + counter + '"><div class="card-body "  ><div class="trackDateTitle text-center font-weight-bold"  >' + key + '</div><div class="trackCount text-center ">' + months[key][1] + ' tweets </div></div></div></div>');
                counter += 1;
            }

        };

    } else if (groupByType == 'week') {
        let counter = 0;
        for (const [yearIndex, month] of Object.entries(data)) {
            for (const [monthIndex, weeks] of Object.entries(month)) {
                for (const [key, value] of Object.entries(weeks)) {
                    $('#trackDates-0').append('<div id="dateLevel-' + tweetID + '-' + counter + '" style="display: block;"><svg height="50"><line class="trackDateConnecter" x1="80.5" y1="0" x2="80.5" y2="50" stroke="grey" stroke-width="2" id="dateLine-' + tweetID + '-' + counter + '"></line></svg><div class="card trackDateCard shadow" value="' + weeks[key][0] + '|' + tweetID + '|' + counter + '|' + 'week' + '|' + monthIndex + '|' + key + '"  id="dateCard-' + tweetID + '-' + offset + '-' + counter + '"><div class="card-body "  ><div class="trackDateTitle text-center font-weight-bold"  >' + monthIndex + '</div><div class="trackWeekTitle text-center font-weight-bold pull-text-top"   >' + ordinal_suffix_of(key) + ' week</div><div class="trackCount text-center ">' + weeks[key][1] + ' tweets </div></div></div></div>');
                    counter += 1;
                }
            }
        }
    }
    else {

        if (data[0][1] == 1 && data.length == 1) {
            $('#notFound-' + offset).html('<div class="card noTrackFoundCard" style="margin-left:' + x1 + 'px"><div class="card-body"><div>No tracking available for Re-Tweet</div><div class=" " > No Tracking data found from <b>' + from + '</b> to <b>' + to + '</b></div></div></div>');
            $('.ttContent').remove();
            return 0;
        }
        for (let i = 0; i < data.length; i++) {
            //"i" used as level as well\
            if (i == 0) {
                data[i][1] = data[i][1] - 1;
            }

            $('#trackDates-0').append('<div id="dateLevel-' + tweetID + '-' + i + '" style="display: none;"><svg height="50"><line class="trackDateConnecter" x1="80.5" y1="0" x2="80.5" y2="50" stroke="grey" stroke-width="2" id="dateLine-' + tweetID + '-' + i + '"></line></svg><div class="card trackDateCard shadow" value="' + data[i][0] + '|' + tweetID + '|' + i + '|' + 'day' + '"  id="dateCard-' + tweetID + '-' + offset + '-' + i + '"><div class="card-body "  ><div class="trackDateTitle text-center font-weight-bold"  >' + data[i][0] + '</div><div class="trackCount text-center ">' + data[i][1] + ' tweets </div></div></div></div>');

            $('#dateLevel-' + tweetID + '-' + i).fadeIn(1000 * i + 1);
        }
    }


}

const drawBoxesForCategories = async (offset, tweetID, date, groupByType, month = null, week = null) => {
    let types = ['retweet', 'QuotedTweet', 'Reply'];

    $('#trackCategoryInfo-' + offset).html('');
    let label = date;
    if (groupByType == 'month' || groupByType == 'week') {
        label = month;
    }
    let weekDOM = '';
    if (week) {
        weekDOM = '<span class="text-dark text-center  ">' + ordinal_suffix_of(week) + ' week of </span>';
    }

    $('#trackCategoryInfo-' + offset).html('<div class="mt-4" style="display: block;" ><div class="card trackCategoryCard shadow  " id="categoryCard-' + offset + '"><div class="card-body " value=""><div><div class="trackCount text-center ">Showing Results for</div>  <div class="trackDateTitle text-center font-weight-bold"> ' + weekDOM + label + '</div></div><ul class="list-group list-group-flush" ><li class=" trackCategoryBox mt-2 p-3" value="' + tweetID + '|' + date + '|' + 'retweet"  id="categoryCard-retweet-' + tweetID + '-' + offset + '" style="pointer-events:none"><div> <div class="trackCategoryTitle text-left ">No. of <b class="text-primary">Re-Tweets</b></div><div class="trackCategoryCount text-left "><span id="retweetCount-' + tweetID + '-' + label + '" >0</span> tweets </div><div class="pull-text-top"><small>Click to see the tweets</small></div></div></li><li class="p-3 trackCategoryBox mt-2 " value="' + tweetID + '|' + date + '|' + 'QuotedTweet"  id="categoryCard-QuotedTweet-' + tweetID + '-' + offset + '"   style="pointer-events:none" ><div><div class="trackCategoryTitle text-left ">No. of <b class="text-primary">Quoted Tweets</b></div><div class="trackCategoryCount text-left "><span id="QuotedTweetCount-' + tweetID + '-' + label + '" >0</span> tweets </div><div class="pull-text-top"><small>Click to see the tweets</small></div></div></li><li class="p-3 trackCategoryBox mt-2" value="' + tweetID + '|' + date + '|' + 'Reply"  id="categoryCard-Reply-' + tweetID + '-' + offset + '"  style="pointer-events:none"><div><div class="trackCategoryTitle text-left ">No. of <b class="text-primary">Reply Tweets</b></div><div class="trackCategoryCount text-left "><span  class="font-weight-bold" id="ReplyCount-' + tweetID + '-' + label + '">0</span> Tweets </div><div class="pull-text-top"><small>Click to see the tweets</small></div></div></li></ul></div></div></div>');
    let fromTmp, toTmp;
    if (groupByType == 'month' || groupByType == 'week') {
        let dateArr = date.split(/[*]/).filter(Boolean);
        fromTmp = dateArr[0], toTmp = dateArr[dateArr.length - 1];

    } else {
        fromTmp = date, toTmp = date;

    }
    let whereIsData = 'retweet';
    let counter = 0;
    // types.forEach(type => {

    await Promise.all(types.map(async (type) => {
        await getFreqDataForTweets(tweetID, fromTmp, toTmp, type).then(response => {
            response.data.forEach(element => {
                $('#categoryCard-' + type + '-' + tweetID + '-' + offset).css('pointer-events', 'auto')
                if (element) {
                    let ifAlready = parseInt($('#' + type + 'Count-' + tweetID + '-' + label).text());
                    ifAlready += element[1];
                    $('#' + type + 'Count-' + tweetID + '-' + label).text(ifAlready);
                    if (counter == 0 && ifAlready > 0) {
                        whereIsData = type;
                        counter = 1;
                    }
                }
            });

        });

    }));
    getRawTweets(tweetID, date, whereIsData);

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
const makeFreqDistChart = (tweetID, from, to, groupByType = null, offset) => {
    if (groupByType == 'day' || groupByType == null) {
        getFreqDataForTweets(tweetID, from, to, 'retweet').then(response => {
            if (response.data.length < 1) {
                $('#retweetTabContent-' + offset).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> The tweet posted by the user has not been Re-Tweeted by any user. </div>');
            } else {
                drawFreqDataForTweet(response, 'retweetTabContent', tweetID, 'retweet', groupByType, offset);
            }

        });
        getFreqDataForTweets(tweetID, from, to, 'QuotedTweet').then(response => {
            if (response.data.length < 1) {
                $('#quotedTabContent-' + offset).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> The tweet posted by the user has not been Quoted by any user. </div>');
            } else {
                drawFreqDataForTweet(response, 'quotedTabContent', tweetID, 'QuotedTweet', groupByType, offset);
            }

        });
        getFreqDataForTweets(tweetID, from, to, 'Reply').then(response => {
            if (response.data.length < 1) {
                $('#replyTabContent-' + offset).html('<div class="alert-danger text-center m-3 p-2 smat-rounded">The tweet posted by the user has not been Replied by any user.</div>');
            } else {
                drawFreqDataForTweet(response, 'replyTabContent', tweetID, 'Reply', groupByType, offset);
            }

        });
    } else if (groupByType == 'month') {
        getFreqDataForTweets(tweetID, from, to, 'retweet').then(response => {
            let objTemp = {}
            if (response.data.length < 1) {
                $('#retweetTabContent-' + offset).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> The tweet posted by the user has not been Re-Tweeted by any user. </div>');
            } else {
                let objTemp = {}
                response.data.forEach(element => {
                    if (objTemp[element[2]]) {
                        objTemp[element[2]] = objTemp[element[2]] + element[1];
                    } else {

                        objTemp[element[2]] = element[1];
                    }
                });

                drawFreqDataForTweetMonth(objTemp, 'retweetTabContent', tweetID, 'retweet', groupByType, offset);
            }

        })

        getFreqDataForTweets(tweetID, from, to, 'QuotedTweet').then(response => {
            let objTemp = {}
            if (response.data.length < 1) {
                $('#quotedTabContent-' + offset).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> The tweet posted by the user has not been Quoted by any user. </div>');
            } else {
                let objTemp = {}
                response.data.forEach(element => {
                    if (objTemp[element[2]]) {
                        objTemp[element[2]] = objTemp[element[2]] + element[1];
                    } else {

                        objTemp[element[2]] = element[1];
                    }
                });

                drawFreqDataForTweetMonth(objTemp, 'quotedTabContent', tweetID, 'QuotedTweet', groupByType, offset);
            }

        })

        getFreqDataForTweets(tweetID, from, to, 'Reply').then(response => {
            let objTemp = {}
            if (response.data.length < 1) {
                $('#replyTabContent-' + offset).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> The tweet posted by the user has not been Replied by any user. </div>');
            } else {
                let objTemp = {}
                response.data.forEach(element => {
                    if (objTemp[element[2]]) {
                        objTemp[element[2]] = objTemp[element[2]] + element[1];
                    } else {

                        objTemp[element[2]] = element[1];
                    }
                });
                drawFreqDataForTweetMonth(objTemp, 'replyTabContent', tweetID, 'Reply', groupByType, offset);
            }

        })
    } else if (groupByType == 'week') {

        getFreqDataForTweets(tweetID, from, to, 'retweet').then(response => {
            if (response.data.length < 1) {
                $('#retweetTabContent-' + offset).html('<div class="alert-danger text-center mx-3 mt-4 p-2 smat-rounded"> The tweet posted by the user has not been Re-Tweeted by any user. </div>');
            } else {
                processDataForWeek(response.data).then(obj => {
                    drawFreqDataForTweetMonth(obj, 'retweetTabContent', tweetID, 'retweet', groupByType, offset);
                });
            }
        });
        getFreqDataForTweets(tweetID, from, to, 'QuotedTweet').then(response => {
            if (response.data.length < 1) {
                $('#quotedTabContent-' + offset).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> The tweet posted by the user has not been Quoted by any user. </div>');
            } else {
                processDataForWeek(response.data).then(obj => {
                    drawFreqDataForTweetMonth(obj, 'quotedTabContent', tweetID, 'retweet', groupByType, offset);
                });
            }
        });
        getFreqDataForTweets(tweetID, from, to, 'Reply').then(response => {
            if (response.data.length < 1) {
                $('#retweetTabContent-' + offset).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> The tweet posted by the user has not been Replied by any user. </div>');
            } else {
                processDataForWeek(response.data).then(obj => {
                    drawFreqDataForTweetMonth(obj, 'replyTabContent', tweetID, 'retweet', groupByType, offset);
                });
            }
        });

    }
}
const printTweetHierarchy = async (json, div, offset) => {
    // $('#' + div).html('<div class="d-flex justify-content-center hierarchyDiv" id="heirarychyMain-' + offset + '"><div class="" id="heirarychyChild-' + offset + '-2"  ></div><div class="" id="heirarychyChild-' + offset + '-3"  ></div><div class="" id="heirarychyChild-' + offset + '-4"  ></div></div>')

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
                generate_tweets_div(arrTemp, 'sourceInfo', true, false)
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
        currentQueryBadge = key == currentQuery ? '<div class="text-center" style="margin-top:-17px;" ><span class="badge badge-primary " > Query </span></div>' : '';
        relationship = '<div class="pt-4"   ><button class="btn btn-sm btn-primary p-1 relationshipNode" data-container="body" data-trigger="hover" data-html="true" data-toggle="popover" data-placement="top" data-content="The tweet posted by <b>' + json[key]['author'] + '</b> is a ' + tweetTypeDictShort[json[key]['type']] + '  of  <b>' + namePrev + '</b>"  style="display:none;">' + tweetTypeDictShort[json[key]['type']] + '</button></div>';
        mainNode = '<div class="trackHierarchyNode" id="node-' + key + '-' + offset + '">' + currentQueryBadge + '<div class="profilePictureDiv trackProfilePic p-1 text-center " value="' + key + '"><img class="openTweetRaw" src="' + json[key]['author_profile_image'] + '" style="height:55px;border-radius:50%"  value="' + key + '"/> </div><div class=" text-truncate">' + json[key]['author'] + '</div><div>' + sourceTag + '</div> <div class="badge badge-primary p-1 seeTweet" value=' + key + '>See Tweet</div></div>';
        if (json[key]['priority'] < highestPriority) {
            $('#heirarychyChild-' + offset + '-' + json[key]['priority']).html('<div class="d-flex">' + separator1 + relationship + separator2 + mainNode + '</div>');
        } else if (json[key]['priority'] == highestPriority) {
            $('#heirarychyChild-' + offset + '-' + json[key]['priority']).html('<div class="d-flex">' + mainNode + '</div>');
        }
    }
    $('[data-toggle="popover"]').popover();

    $('.relationshipNode').fadeIn(1000 * 2)
}


const dateCardTriggered = (tweetID, date, level, groupByType, month = null, week = null) => {
    $('.trackDateCard').removeClass('activeDate');
    let offset = allocatedIDRecords[tweetID][0]['allotedID'];
    $('#dateCard-' + tweetID + '-' + offset + '-' + level).addClass('activeDate');
    // console.log('range', groupByType);
    if (groupByType == 'month') {
        drawBoxesForCategories(offset, tweetID, date, groupByType, month);
        printDatesOptional(tweetID, date, level, groupByType, month, 'datesOptional-' + offset);

    } else if (groupByType == 'week') {
        drawBoxesForCategories(offset, tweetID, date, groupByType, month, week);
        printDatesOptional(tweetID, date, level, groupByType, month, 'datesOptional-' + offset, ', ' + ordinal_suffix_of(week) + ' week');

    } else if (groupByType == 'day') {
        drawBoxesForCategories(offset, tweetID, date);
    }


}
const printDatesOptional = (tweetID, date, level, groupByType, month, div, week = '') => {

    let dateArr = date.split(/[*]/).filter(Boolean);
    $('#' + div).html('<div class="card mt-4 shadow"><div class="card-body"><div><p class="text-dark text-left mb-0 text-center">Tweets arrived in <b>' + month + week + '</b> on:</p></div><div class="dateOptionalList px-2 "><ul class="list-group list-group-flush" id="datesOptionalList-' + allocatedIDRecords[tweetID][0]['allotedID'] + '"></ul> </div></div></div>');
    $('#datesOptionalList-' + allocatedIDRecords[tweetID][0]['allotedID']).html('');
    dateArr.forEach(element => {
        $('#datesOptionalList-' + allocatedIDRecords[tweetID][0]['allotedID']).append('<div class="datesOptionalCard  mt-1 border p-1 " value="' + element + '|' + tweetID + '|' + level + '|' + groupByType + '|' + month + '|' + week + '"  style="border-radius:24px;"><li class="  text-center">' + element + '</li><div>');

    });

}



const getRawTweets = async (tweetID, date, type) => {
    //adjusting height
    $('.trackCategoryBox').removeClass('activeCategory');
    let offset = allocatedIDRecords[tweetID][0]['allotedID'];
    setTimeout(() => {
        let heightTemp = $('#secondCol-' + offset).height();
        $('#trackRawData-' + offset).css('height', heightTemp - 30 + 'px');
        $('#trackRawData-' + offset + '_tweets').css('height', heightTemp - 80 + 'px');
    }, 700);
    $('#currentlyShowingTweetType-' + offset).text(tweetTypeDict[type] + '(s)');
    $('#categoryCard-' + type + '-' + tweetID + '-' + offset).addClass('activeCategory');
    $('#trackMap-' + offset).html('<div class="text-center  smat-loader " ><i class="fa fa-circle-o-notch donutSpinner mt-5" aria-hidden="true"></i></div>');
    $('#trackMap-' + offset).html(`<div class="bg-transparent" id="result-div-map"  style="display:none" ></div>
    <div class="modal_lm">
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <ul id="markersList"></ul>
        </div>
    </div>`);
    if (date.includes('*')) {
        let dateArr = date.split(/[*]/).filter(Boolean);
        let arr = [];
        var responseArray = await Promise.all(dateArr.map(function (x) {
            console.log("This is the source tweet 3", x, tweetID);
            return getTweetsForSource(tweetID, x, null, type);
        }));
        console.log('Rajdeep tweets:', responseArray.flat().length);

        if (responseArray.flat().length < 1) {
            displayErrorMsg('trackRawData-' + offset, 'error', 'No Tweets Found.', false);
        } else {

            getTweetsPlotDataForMap(responseArray.flat()).then(tweetsRaw => {
                getCompleteMap("result-div-map", tweetsRaw);
            });
            TweetsGenerator(responseArray.flat(), 6, 'trackRawData-' + offset, null, null, true, null);
        }
    } else {
        getTweetsForSource(tweetID, date, null, type).then(response => {

            if (response.length < 1) {
                displayErrorMsg('trackRawData-' + offset, 'error', 'No Tweets Found.', false);

            } else {

                getTweetsPlotDataForMap(response).then(tweetsRaw => {
                    getCompleteMap("result-div-map", tweetsRaw);
                });
                TweetsGenerator(response, 6, 'trackRawData-' + offset, null, null, true, null);

            }
        });
    }
    $('#result-div-map').fadeIn('slow')
}
const updateDates = (id, fromDate, toDate) => {
    getTweetInfo(historyJSON[sourceTweet]['id']).then(tweetRawData => {
        if (tweetRawData) {
            let dateArr = tweetRawData.datetime.split(' ');
            fromDate = dateArr[0];
            toDate = getCurrentDate();
            getDatesDist(sourceTweet, fromDate, toDate, 'all').then(response => {
                createTweetAnalysis(sourceTweet, fromDate, toDate, 'trackAnalysisMain', tweetRawData.author_profile_image, tweetRawData.author, response.data);

            })
        }
    });
}
const drawHierarchyLine = (tweetID, offset) => {
    $('#node-' + tweetID + '-' + offset).append('<div ><svg style="width:100%;height:30px;"><line x1="30" y1="0" x2="30" y2="100" stroke="grey" stroke-width="2"   id="line-' + tweetID + '-' + offset + '" ></line></svg></div>');

    let x1 = Math.round($('#dateLine-' + tweetID + '-' + offset).position().left);
    let x2 = Math.round($('#line-' + tweetID + '-' + offset).position().left);
    let extra = Math.round($('#trackAnalysisMain').position().left);
    x1 = x1 - extra + 'px';
    x2 = x2 - extra + 'px';
    $('#connect').html('<div><svg height="30" style="width:100%;"><line class="" x1="' + x1 + '" y1="0" x2="' + x2 + '" y2="0" stroke="grey" stroke-width="3" id="line-' + tweetID + '-1-connect" ></line></svg></div>');
}


const readjustLines = (tweetID, offset) => {
    let x1 = Math.round($('#dateLine-' + tweetID + '-' + offset).position().left);
    let x2 = Math.round($('#line-' + tweetID + '-' + offset).position().left);
    let extra = Math.round($('#trackAnalysisMain').position().left);
    x1 = x1 - extra;
    x2 = x2 - extra;
    $('#connect').html('<div><svg height="30" style="width:100%;"><line class="" x1="' + x1 + '" y1="0" x2="' + x2 + '" y2="0" stroke="grey" stroke-width="3" id="line-' + tweetID + '-1-connect" ></line></svg></div>');
}



const processDataForWeek = async (rawData) => {
    let objTemp = {};
    rawData.forEach(element => {
        let year = element[0].split(/[-]/).filter(Boolean)[0];
        if (objTemp[year]) {
            if (objTemp[year][element[2]]) {
                if (objTemp[year][element[2]][element[3]]) {
                    objTemp[year][element[2]][element[3]][1] = objTemp[year][element[2]][element[3]][1] + element[1];
                    objTemp[year][element[2]][element[3]][0] = objTemp[year][element[2]][element[3]][0] + '*' + element[0];

                } else {
                    objTemp[year][element[2]][element[3]] = [element[0], element[1]];

                }
            } else {
                objTemp[year][element[2]] = { [element[3]]: [element[0], element[1]] }
            }
        } else {
            objTemp[year] = { [element[2]]: { [element[3]]: [element[0], element[1]] } }
        }

    });
    return objTemp;
}

const displayNoTrackFoundForTracking = (tweetID, offset, from, to) => {
    $('.refLineForNoDataFound').remove();
    $('#node-' + tweetID + '-' + offset).append('<div class="refLineForNoDataFound"><svg style="width:100%;height:30px;"><line x1="30" y1="0" x2="30" y2="100" stroke="grey" stroke-width="2"   id="line-' + tweetID + '-' + offset + '" ></line></svg></div>');
    let x1 = Math.round($('#line-' + tweetID + '-' + offset).position().left);
    let extra = Math.round($('#trackAnalysisMain').position().left);
    let x2 = Math.round($('.noTrackFoundCard').width());
    x1 = x1 - extra - 200;
    getTweetInfo(tweetID).then(response => {
        if (response.type === 'retweet') {
            $('.ttContent').remove();
            $('#notFound-' + offset).html('<div class="card noTrackFoundCard" style="margin-left:' + x1 + 'px"><div class="card-body"><div>No tracking available for Re-Tweet</div><div class=" " > No Tracking data found from <b>' + from + '</b> to <b>' + to + '</b></div></div></div>');
        } else {
$('#networkContent').css('display','none')
            $('#notFound-' + offset).html('<div class="card noTrackFoundCard" style="margin-left:' + x1 + 'px"><div class="card-body"><div>The Tweet by <b>' + response.author + '</b> has neither been Re-Tweeted nor Quoted/Replied</div><div class=" " > No Tracking data found from <b>' + from + '</b> to <b>' + to + '</b></div></div></div>');
        }
    })


}
const printSourceInfo = (offset, div, data) => {


    $('#' + div).fadeIn('slow')
}

const getTweetsForMap = async (tweetID, from, to, offset, groupByType = null, originalDateData) => {
    let types = ['retweet', 'QuotedTweet', 'Reply'];
    let idArray = [];
    await Promise.all(originalDateData.map(async (y) => {
        let ArrTmp = await Promise.all(types.map(function (x) {
            console.log("This is the source tweet 5", tweetID, y[0]);
            return getTweetsForSource(tweetID, y[0], null, x)
        }));
        await idArray.push(ArrTmp);

    }));
    idArray = idArray.flat().flat();
    $('#trackMap-' + offset).html(`<div class="bg-transparent" id="result-div-map"  ></div>
 <div class="modal_lm">
     <div class="modal-content">
         <span class="close-button">&times;</span>
         <ul id="markersList"></ul>
     </div>
 </div>`);
    getTweetsPlotDataForMap(idArray).then(response => {
        getCompleteMap("result-div-map", response);
    });
}




const createNetworkForTrack = (id, dateList) => {
    isNetworkDisplaying = 1;
    console.log('Current Query:' ,currentQuery  , 'Source TweetID: ' , sourceTweet);
    $('#generateNetwork').remove();
    $('#trackNetworkMsg').html('<div class="d-flex justify-content-center"><div class=""><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div><div class="mt-2 mx-2">Loading network.Please wait.</div></div>');
    let dateArr = [];
    console.log(dateList);
    dateList.data.forEach(element => {
        dateArr.push(element[0]);
    });
    makeAddToStoryDiv('track_net')
    getNetworkForSource(userID, id, dateArr).then(res => {
        getTweetInfo(id).then(response => {
            generate_tweets_div([response], 'networkTrackTweetDiv', true, false)
        });
        $('#trackNetworkMsg').html('');
        $('#networkDiv').fadeIn('slow')
        $('#ttNodesCountNetwork').html(res["nodes"].length);
        $('#ttEdgesCountNetwork').html(res["edges"].length);
        

        var nodes_arr = res["nodes"];
        var edges_arr = res["edges"];

        var global_options_tt = {
            nodes: {
                shape: 'dot',
                color: '',
                size: 70,
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
                color: '#a3c2c2',
                length: 1800,
                width: 0.3,
                arrows: "from",
                smooth: {
                    type: 'continuous'
                },
                hoverWidth: 50
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
            physics: {
                // forceAtlas2Based: {
                //     gravitationalConstant: -26,
                //     centralGravity: 0.0003,
                //     springLength: 1800,
                //     springConstant: 0.018,
                // },
                // maxVelocity: 500,
                // solver: "forceAtlas2Based",
                // timestep: 0.35,
                // stabilization: { iterations: 2500 },
            },
            layout: {
                randomSeed: undefined,
                improvedLayout:true,
                clusterThreshold: 150,
                hierarchical: {
                  enabled:false,
                  levelSeparation: 150,
                  nodeSpacing: 100,
                  treeSpacing: 200,
                  blockShifting: true,
                  edgeMinimization: true,
                  parentCentralization: true,
                  direction: 'UD',        // UD, DU, LR, RL
                  sortMethod: 'hubsize',  // hubsize, directed
                  shakeTowards: 'leaves'  // roots, leaves
                }
            }
        };

        console.log(res);

        // update in network information division
        $(".nos_of_nodes").empty();
        $(".nos_of_nodes").text(nodes_arr.length);
        $(".nos_of_edges").empty();
        $(".nos_of_edges").text(edges_arr.length);


        var nodes = new vis.DataSet();
        var edges = new vis.DataSet();

        // create a network
        //var container = document.getElementsByClassName(id_value);
        var container = document.getElementById("track_net");

        var data = {
            nodes: nodes,
            edges: edges
        };

        var network_global_tracking = new vis.Network(container, data, global_options_tt);


        network_global_tracking.focus(1, {
            scale: 1
        });

        // number of nodes

        // to add node dynamically
        // $(".loader").remove();

        let centralityValues = {};
        $.each(edges_arr, function (index, value) {
            if(centralityValues[value.from] == null){
                centralityValues[value.from] = 1;
            }else{
                centralityValues[value.from] = centralityValues[value.from] + 1;
            }

            if(centralityValues[value.to] == null){
                centralityValues[value.to] = 1;
            }else{
                centralityValues[value.to] = centralityValues[value.to] + 1;
            }
        });

        $.each(nodes_arr, function (index, value) {
            let node_color = value.color;
            if(value.id == "QW"+sourceTweet){

            }else if(value.id == "QW"+currentQuery){
                node_color = "yellow";
                centralityValues[value.id] = 20;
            }

            if(centralityValues[value.id]>50){
                centralityValues[value.id] = (centralityValues[value.id] * 1)+40;
            }else{
                centralityValues[value.id] = (centralityValues[value.id] * 1.5)+20;
            }

            if(centralityValues[value.id]>180){
                centralityValues[value.id] = 180;
            }
            nodes.add({
                "id": value.id,
                "label": value.label,
                "shape": value.shape,
                "size": centralityValues[value.id],
                "borderWidth": value.borderwidth,
                "border": value.border,
                "color": node_color,
                // "color":{
                //     background: '#FFFFFF'
                // },
                "font": {
                    "size": 30
                }
            });
        });


        // to add edges dynamically
        $.each(edges_arr, function (index, value) {
            setTimeout(function () {
                edges.add({
                    "from": value.from,
                    "to": value.to,
                    "label": value.label
                });

            }, 10);
        });

        network_global_tracking.on('hoverNode', function (properties) {
            // alert(properties.node);
            let id = properties.node.match(/[\d]*/g).filter(Boolean);
            getTweetInfo(id[0]).then(response => {
                $('#hoveredOnDiv').css('display', 'block');
                $('#hoveredOnType').text(tweetTypeDict[response.type]);
                $('#hoveredOnAuthor').text(response.author);
                generate_tweets_div([response], 'networkTrackTweetDiv', true, false)
            });
        });
        var scaleOption = {scale:0.2};
        network_global_tracking.moveTo(scaleOption);
        $('.vis-network').removeAttr('tabindex');
    })

}



//--------------------------------------

