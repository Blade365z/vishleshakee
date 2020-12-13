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

import { get_tweets_info_AjaxRequest, generate_tweets_div, TweetsGenerator } from '../utilitiesJS/TweetGenerator.js';
import { getTweetInfo, getFreqDataForTweets, getTweetsForSource, getDatesDist } from './helper.js';
import { makeSmatReady } from '../utilitiesJS/smatExtras.js';
import { getCurrentDate, getRangeType, dateProcessor, getDateRange } from '../utilitiesJS/smatDate.js';
import { drawFreqDataForTweet } from './chartHelper.js';
import { getTweetIDsFromController } from '../home/helper.js';


//Globals
var tweetDiv = 'tweetDiv';
var currentQuery, currentlyAnalysed, fromDate, toDate;
var divOffsetFlag = 0, sourceTweet; //As in offset 0 the currently searched Tweet would be printed;
const tweetTypeDict = { 'Tweet': 'Source Tweet', 'retweet': 'Re Tweet', 'QuotedTweet': 'Quoted Tweet', 'Reply': 'Reply Tweet' };
var historyJSON = {};
var tweets = [];
var analysisHistory = [], currentlyWatching = [];
var allocatedIDRecords = [];

//Logic
jQuery(function () {




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
        getDatesDist(arr[0], arr[3], arr[4], 'all').then(response => {
            if (arr[2] == 'month') {
                let objTemp = {};
                response.data.forEach(element => {
                    if (objTemp[element[2]]) {
                        objTemp[element[2]][0] = objTemp[element[2]][0] + '*' + element[0];
                        objTemp[element[2]][1] = objTemp[element[2]][1] + element[1];
                    } else {

                        objTemp[element[2]] = [element[0], element[1]];
                    }
                });

                getTweetInfo(arr[0]).then(raw => {
                    createTweetAnalysis(arr[0], arr[3], arr[4], 'trackAnalysisMain', raw.author_profile_image, raw.author, objTemp, arr[1], true);
                });

            }else{
                getTweetInfo(arr[0]).then(raw => {
                    createTweetAnalysis(arr[0], arr[3], arr[4], 'trackAnalysisMain', raw.author_profile_image, raw.author, response.data, arr[1], false);
                });
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
        if (response.type === 'Tweet') {
            if (response) {
                historyJSON[currentQuery] = { 'id': currentQuery, 'type': response.type, 'source': null, 'priority': 1 };
                analysisHistory.push(historyJSON);
                let dateArr = response.datetime.split(' ');
                fromDate = dateArr[0];
                toDate = getCurrentDate();
                getDatesDist(currentQuery, fromDate, toDate, 'all').then(dateData => {
                    createTweetAnalysis(currentQuery, fromDate, toDate, 'trackAnalysisMain', response.author_profile_image, response.author, dateData.data);
                });

            }
        } else {
            tracker(currentQuery);
        }
    });

    $('body').on('click', '#bring', async function () {
        getTweetsForSource(sourceTweet, '2020-10-31', null, 'all').then(response => {
            let arrTemp = response.data
        });
    });
    $('body').on('click', '#moreBtn', async function () {
        let arrTmp = tweets.prototype.flat();
        // console.log(arrTmp)
    });

    $('body').on('click', 'div .trackDateCard', function () {
        let valueArr = $(this).attr('value');
        valueArr = valueArr.split(/[|]/).filter(Boolean);
        if (valueArr[3]) {
            dateCardTriggered(valueArr[1], valueArr[0], valueArr[2], true, valueArr[3]);
        } else {
            dateCardTriggered(valueArr[1], valueArr[0], valueArr[2]);

        }

    })
    //trackCategoryBox
    $('body').on('click', 'div .trackCategoryBox', function () {
        let valueArr = $(this).attr('value');
        valueArr = valueArr.split(/[|]/).filter(Boolean);
        getRawTweets(valueArr[0], valueArr[1], valueArr[2])

        // 

    });

    $('#flux').on('scroll', function () {
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            alert('end reached');
        }
    })

    $('body').on('click', 'div .openTweetRaw', function () {
        let value = $(this).attr('value');
        getTweetInfo(value).then(tweetRawData => {
            if (tweetRawData) {
                let dateArr = tweetRawData.datetime.split(' ');
                fromDate = dateArr[0];
                toDate = getCurrentDate();
                getDatesDist(value, fromDate, toDate, 'all').then(response => {
                    createTweetAnalysis(value, fromDate, toDate, 'trackAnalysisMain', tweetRawData.author_profile_image, tweetRawData.author, response.data);
                })
            }
        });
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
    let maximumDependenceLevel = 3 //i.e : 0 to 2 --> 3 steps
    let type = '', tid;
    for (let i = 0; i <= maximumDependenceLevel; i++) {
        await getTweetInfo(searhIDTemp).then(response => {
            tid = response.tid;
            if (response.type === 'Tweet') {
                foundSourceFlag = 1;
                type = 'Tweet';
                sourceTweet = tid;
                historyJSON[tid] = { 'id': tid, 'type': type, 'source': null, 'priority': 1 };


            }
            else if (response.type === 'retweet') {
                type = 'retweet';
                historyJSON[tid] = { 'id': tid, 'type': type, 'source': response.retweet_source_id, 'priority': 4 };
                searhIDTemp = response.retweet_source_id;
            } else if (response.type === "QuotedTweet") {
                type = 'QuotedTweet';
                historyJSON[tid] = { 'id': tid, 'type': type, 'source': response.quoted_source_id, 'priority': 3 };
                searhIDTemp = response.quoted_source_id;
            } else if (response.type === "Reply") {
                type = 'Reply';
                historyJSON[tid] = { 'id': tid, 'type': type, 'source': response.replyto_source_id, 'priority': 2 };
                searhIDTemp = response.replyto_source_id;
            }

        });
        if (foundSourceFlag == 1) {
            break;
        }

    }
    analysisHistory.push(historyJSON);

    getTweetInfo(historyJSON[sourceTweet]['id']).then(tweetRawData => {
        if (tweetRawData) {
            let dateArr = tweetRawData.datetime.split(' ');
            fromDate = dateArr[0];
            toDate = getCurrentDate();
            getDatesDist(sourceTweet, fromDate, toDate, 'all').then(response => {
                // console.log(response);
                createTweetAnalysis(sourceTweet, fromDate, toDate, 'trackAnalysisMain', tweetRawData.author_profile_image, tweetRawData.author, response.data);

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




// const makeAnalysisReadyForTweet = (tweetID,data) => {

// }

//DateInput Box
const drawDateBox = (offset, tweetID, from = null, to = null, isGroupedByMonthFlag = false) => {
    let ischeckedDate = 'checked', ischeckedMonth = '';
    if (isGroupedByMonthFlag) {
        ischeckedMonth = 'checked';
        ischeckedDate = ''
    }
    $('#dateInputTrack-' + offset).html('<div><div class="d-flex mb-1"><span class="text-dark font-weight-bold mr-2">Group By </span><div class="mx-2"><input class="groupByRadio" type="radio" id="radioDay-' + tweetID + '-' + offset + '"   value="' + tweetID + '|' + offset + '|' + 'day' + '|' + from + '|' + to + '"  ' + ischeckedDate + '><label for="radioDay-' + tweetID + '-' + offset + '"  class="text-dark mx-1">Day-wise</label></div><div class="mx-1"><input type="radio" class="groupByRadio"   id="radioMonth-' + tweetID + '-' + offset + '"   value="' + tweetID + '|' + offset + '|' + 'month' + '|' + from + '|' + to + '" ' + ischeckedMonth + ' ><label for="radioMonth-' + tweetID + '-' + offset + '"   class="text-dark mx-1 ">Month-wise</label></div></div> </div><div id="date-divTrack-' + tweetID + '-' + offset + '"><form id="trackDateForm-' + tweetID + '-' + offset + '"><div class="d-flex mb-3"><div class="form-group   my-0  mr-2  border smat-rounded d-flex px-2 py-1  bg-white"><i class="far fa-calendar-alt mx-2 text-normal " style="margin-top:11px;"></i><input type="text" class="form-control datepicker-here  smat-from" name="fromDate" id="fromDateTrack-' + tweetID + '-' + offset + '" placeholder="From Date" onkeydown="return false;" style="border:0px;"autocomplete="OFF" data-language="en" required></div><div class="form-group  my-0  mr-2 border smat-rounded d-flex px-2 py-1  bg-white"><i class="far fa-calendar-alt mx-2 text-normal" style="margin-top:11px;"></i><input type="text" class="form-control datepicker-here smat-to " name="toDate" id="toDateTrack-' + tweetID + '-' + offset + '"  placeholder="To Date" onkeydown="return false;" style="border:0px;" autocomplete="OFF" data-language="en" required></div><button class="btn  btn-primary  " id="submit-btn-' + tweetID + '-' + offset + '"  type="submit" style="border-radius:50%;margin-top:5px;"> <span>Go </span> </button></div></form></div>');
    $('#fromDateTrack-' + tweetID + '-' + offset).datepicker();
    $('#toDateTrack-' + tweetID + '-' + offset).datepicker();
    if (from && to) {
        $('#fromDateTrack-' + tweetID + '-' + offset).val(from);
        $('#toDateTrack-' + tweetID + '-' + offset).val(to);
    }


}


const drawconnectingboxes = (offset, tweetID, data, profilePic = null, author = null, isGroupedByMonthFlag = false) => {
    // $('#trackDates-' + offset).html('<div id="sourceNode-'+tweetID+'-'+offset+'"> <div class="profilePictureDiv p-1 text-center mr-2"><img class="openTweetRaw" src="' + profilePic + '" style="height:55px;border-radius:50%"   value="'+tweetID+'"></div><div class=" text-truncate">' + author + '</div></div>')

    if (isGroupedByMonthFlag) {
        let counter = 0;
        for (const [key, value] of Object.entries(data)) {
            $('#trackDates-0').append('<div id="dateLevel-' + tweetID + '-' + counter + '" style="display: block;"><svg height="50"><line class="trackDateConnecter" x1="163.5" y1="0" x2="163.5" y2="50" stroke="grey" stroke-width="2" id="dateLine-' + tweetID + '-' + counter + '"></line></svg><div class="card trackDateCard shadow" value="' + data[key][0] + '|' + tweetID + '|' + counter + '|' + key + '"  id="dateCard-' + tweetID + '-' + offset + '-' + counter + '"><div class="card-body "  ><div class="trackDateTitle text-center font-weight-bold"  >' + key + '</div><div class="trackCount text-center ">' + data[key][1] + ' tweets </div></div></div></div>');
            counter += 1;
        }
    } else {
       
        for (let i = 0; i < data.length; i++) {
            //"i" used as level as well
            $('#trackDates-0').append('<div id="dateLevel-' + tweetID + '-' + i + '" style="display: block;"><svg height="50"><line class="trackDateConnecter" x1="163.5" y1="0" x2="163.5" y2="50" stroke="grey" stroke-width="2" id="dateLine-' + tweetID + '-' + i + '"></line></svg><div class="card trackDateCard shadow" value="' + data[i][0] + '|' + tweetID + '|' + i + '"  id="dateCard-' + tweetID + '-' + offset + '-' + i + '"><div class="card-body "  ><div class="trackDateTitle text-center font-weight-bold"  >' + data[i][0] + '</div><div class="trackCount text-center ">' + data[i][1] + ' tweets </div></div></div></div>');
        }
    }


}

const drawBoxesForCategories = (offset, tweetID, date, isGroupedByMonthFlag = false, month = null) => {
    let types = ['retweet', 'QuotedTweet', 'Reply'];
    //prepare boxes here$
    // $('#somediv').html( )
    let label = date;
    if (month) {
        label = month;
    }
    $('#trackCategoryInfo-' + offset).html('<div class="mt-4" style="display: block;" ><div class="card trackCategoryCard shadow  " id=""><div class="card-body " value=""><div><div class="trackCount text-center ">Showing Results for</div><div class="trackDateTitle text-center font-weight-bold">' + label + '</div></div><ul class="list-group list-group-flush" ><li class=" trackCategoryBox mt-2 p-3" value="' + tweetID + '|' + date + '|' + 'retweet"  id="categoryCard-retweet-' + tweetID + '-' + offset + '"><div><div class="trackCategoryTitle text-left "> <b>Re-Tweets</b></div><div class="trackCategoryCount text-left "><span id="retweetCount-' + tweetID + '-' + label + '" >0</span> tweets </div></div></li><li class="p-3 trackCategoryBox mt-2 " value="' + tweetID + '|' + date + '|' + 'QuotedTweet"  id="categoryCard-QuotedTweet-' + tweetID + '-' + offset + '"   ><div><div class="trackCategoryTitle text-left "> <b>Quoted Tweets</b></div><div class="trackCategoryCount text-left "><span id="QuotedTweetCount-' + tweetID + '-' + label + '" >0</span> tweets </div></div></li><li class="p-3 trackCategoryBox mt-2" value="' + tweetID + '|' + date + '|' + 'Reply"  id="categoryCard-Reply-' + tweetID + '-' + offset + '" ><div><div class="trackCategoryTitle text-left "> <b>Reply Tweets</b></div><div class="trackCategoryCount text-left "><span id="ReplyCount-' + tweetID + '-' + label + '">0</span> tweets </div></div></li></ul></div></div></div>');
    let fromTmp, toTmp;
    if (isGroupedByMonthFlag) {
        let dateArr = date.split(/[*]/).filter(Boolean);
        fromTmp = dateArr[0], toTmp = dateArr[dateArr.length - 1];

    } else {
        fromTmp = date, toTmp = date;
    }
    types.forEach(type => {
        getFreqDataForTweets(tweetID, fromTmp, toTmp, type).then(response => {
            response.data.forEach(element => {
                if (element) {
                    let ifAlready = parseInt($('#' + type + 'Count-' + tweetID + '-' + label).text());
                    ifAlready += element[1];
                    $('#' + type + 'Count-' + tweetID + '-' + label).text(ifAlready);
                }
            });

        });
    });
    getRawTweets(tweetID, date, 'retweet');

}


const createTweetAnalysis = (tweetID, from, to, div, profilePic, author, datesData, allotedIDargs = null, isGroupedByMonthFlag = false) => {
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
    
    // console.log('check2',analysisHistory)
    $('#' + div).html('<div class="p-3  shadow mr-auto ml-auto" style="border-radius:24px;"><div class="row justify-content-left  px-3 pl-5" id="xyz"> </div><div id="connect" style="height:2px;"></div><div class="row justify-content-center "> <div class="col-sm-3" ><div id="referenceLine-' + allotedID + '"><svg height="50"><line class="trackDateConnecter" x1="163.5" y1="0" x2="163.5" y2="50" stroke="grey" stroke-width="2" ></line></svg> </div> <div class="trackDateList" id="trackDates-' + allotedID + '"> </div> </div><div class="col-sm-3" id="trackCategoryInfo-' + allotedID + '" ></div><div class="col-sm-5"><div class="mt-4" id="dateInputTrack-' + allotedID + '" ></div><div class="tweetRawTrackDiv bg-white shadow p-3"  id="trackRawData-' + allotedID + '" style="border-radius:24px;"></div></div></div></div>');



   
    printTweetHierarchy(analysisHistory[allotedID], 'xyz', allotedID).then(response => {
        drawDateBox(allotedID, tweetID, from, to, isGroupedByMonthFlag);
        drawconnectingboxes(allotedID, tweetID, datesData, profilePic, author, isGroupedByMonthFlag);
        drawHierarchyLine(tweetID, allotedID);
        dateCardTriggered(tweetID, from, 0)
    });



    //shift the below part to on date clicked or initalize 

}


const printTweetHierarchy = async (json, div, offset) => {
    $('#' + div).html('<div class="d-flex justify-content-center hierarchyDiv" id="heirarychyMain-' + offset + '"><div class="" id="heirarychyChild-' + offset + '-1"></div><div class="" id="heirarychyChild-' + offset + '-2"  ></div><div class="" id="heirarychyChild-' + offset + '-3"  ></div><div class="" id="heirarychyChild-' + offset + '-4"  ></div></div>')

    let separator = '<div class="pt-4" id="separator-' + offset + '">-----------------------</div>';
    let mainNode = '';
    let relationship = '';
    let sourceTag = '';
    for (let key in json) {
        await getTweetInfo(key).then(response => {
            sourceTag = json[key]['priority'] < 2 ? '<div class="text-center" style="margin-top:-17px;" ><span class="badge badge-primary " > Source Tweet</span></div>' : '';
            relationship = '<div class="pt-4"><span class="badge badge-primary p-2">' + json[key]['type'] + '</span></div>';
            mainNode = '<div class="trackHierarchyNode" id="node-' + key + '-' + offset + '">' + sourceTag + '<div class="profilePictureDiv trackProfilePic p-1 text-center " value="' + key + '"><img class="openTweetRaw" src="' + response.author_profile_image + '" style="height:55px;border-radius:50%"  value="' + key + '"/> </div><div class=" text-truncate">' + response.author + '</div> </div>';
            if (json[key]['priority'] > 3) {


                $('#heirarychyChild-' + offset + '-' + json[key]['priority']).html('<div class="d-flex">' + separator + relationship + separator + mainNode + '</div>');

            } else if (json[key]['priority'] < 2) {

                $('#heirarychyChild-' + offset + '-' + json[key]['priority']).html('<div class="d-flex">' + mainNode + '</div>');

            } else {
                $('#heirarychyChild-' + offset + '-' + json[key]['priority']).html('<div class="d-flex">' + separator + relationship + separator + mainNode + '</div>');

            }



        });

    }

}


const dateCardTriggered = (tweetID, date, level, isGroupedByMonthFlag = false, month = null) => {
    $('.trackDateCard').removeClass('activeDate');
    let offset = allocatedIDRecords[tweetID][0]['allotedID'];
    $('#dateCard-' + tweetID + '-' + offset + '-' + level).addClass('activeDate');
    if (isGroupedByMonthFlag) {
        drawBoxesForCategories(offset, tweetID, date, true, month);
    } else {
        drawBoxesForCategories(offset, tweetID, date);
    }


}

const getRawTweets = async (tweetID, date, type) => {
    $('.trackCategoryBox').removeClass('activeCategory');
    let offset = allocatedIDRecords[tweetID][0]['allotedID'];
    $('#categoryCard-' + type + '-' + tweetID + '-' + offset).addClass('activeCategory');
    if (date.includes('*')) {
        let dateArr = date.split(/[*]/).filter(Boolean);
        let arr = [];
        var responseArray = await Promise.all(dateArr.map(function (x) {
            return getTweetsForSource(tweetID, x, null, type);
        }));
        TweetsGenerator(responseArray.flat(), 6, 'trackRawData-' + offset, null, null, true, null);
    } else {
        getTweetsForSource(tweetID, date, null, type).then(response => {
            TweetsGenerator(response, 6, 'trackRawData-' + offset, null, null, true, null);
        });
    }

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
    let extra = Math.round($('#trackAnalysisMain').position().left) + 15;
    x1 = x1 - extra + 'px';
    x2 = x2 - extra + 'px';
    $('#connect').html('<div><svg height="30" style="width:100%;"><line class="" x1="' + x1 + '" y1="0" x2="' + x2 + '" y2="0" stroke="grey" stroke-width="3" id="line-' + tweetID + '-1-connect" ></line></svg></div>');
}


const readjustLines = (tweetID, offset) => {
    let x1 = Math.round($('#dateLine-' + tweetID + '-' + offset).position().left);
    let x2 = Math.round($('#line-' + tweetID + '-' + offset).position().left);
    let extra = Math.round($('#trackAnalysisMain').position().left) + 15;
    x1 = x1 - extra;
    x2 = x2 - extra;
    $('#connect').html('<div><svg height="30" style="width:100%;"><line class="" x1="' + x1 + '" y1="0" x2="' + x2 + '" y2="0" stroke="grey" stroke-width="3" id="line-' + tweetID + '-1-connect" ></line></svg></div>');
}