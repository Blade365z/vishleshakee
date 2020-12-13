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


//Globals
var tweetDiv = 'tweetDiv';
var currentQuery, currentlyAnalysed, fromDate, toDate;
var divOffsetFlag = 0, sourceTweet; //As in offset 0 the currently searched Tweet would be printed;
const tweetTypeDict = { 'Tweet': 'Source Tweet', 'retweet': 'Re Tweet', 'QuotedTweet': 'Quoted Tweet', 'Reply': 'Reply Tweet' };
var historyJSON = {};
var tweets = [];
var whereAreYouNow;
var analysisHistory = [];
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
                let dateArr = response.datetime.split(' ');
                fromDate = dateArr[0];
                toDate = getCurrentDate();
                initiateTweetAnalysis(historyJSON[sourceTweet]['id'], dateArr[0], toDate, historyJSON[sourceTweet]['type'], response)
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
        console.log(arrTmp)
    });

    $('body').on('click', 'div .trackDateCard', function () {
        let valueArr = $(this).attr('value');
        valueArr = valueArr.split(/[|]/).filter(Boolean);
        drawBoxesForCategories(analysisHistory[valueArr[1]][0]['allotedID'],valueArr[1], valueArr[0])

    })
    //trackCategoryBox
    $('body').on('click', 'div .trackCategoryBox', function () {
        let valueArr = $(this).attr('value');
        valueArr = valueArr.split(/[|]/).filter(Boolean);
        getTweetsForSource(valueArr[0], valueArr[1], null, valueArr[2]).then(response => {
            TweetsGenerator(response.data, 6, 'trackRawData-'+analysisHistory[valueArr[0]][0]['allotedID'], null, null, true, null);

        });
        // if (valueArr[2] == 'retweet') {
        //     let retweetDate = [];
        //     getTweetsForSource(valueArr[0], valueArr[1], null, valueArr[2]).then(response => {


        //     });
        // } else {
        //     getTweetsForSource(valueArr[0], valueArr[1], null, valueArr[2]).then(response => {


        //     });
        // }
    });
    // $('body').on('mouseover', 'div .tweetTrackDiv', function () {
    //     let value = $(this).attr('value');
    //     whereAreYouNow = value;
    // });
    // $('body').on('click', 'div #paginate', function () {

    // });





    $('#flux').on('scroll', function () {
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            alert('end reached');
        }
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
                historyJSON[tid] = { 'id': tid, 'type': type, 'source': null ,'priority':1 };
            }
            else if (response.type === 'retweet') {
                type = 'retweet';
                historyJSON[tid] = { 'id': tid, 'type': type, 'source': response.retweet_source_id ,'priority':4};
                searhIDTemp = response.retweet_source_id;
            } else if (response.type === "QuotedTweet") {
                type = 'QuotedTweet';
                historyJSON[tid] = { 'id': tid, 'type': type, 'source': response.quoted_source_id ,'priority':3};
                searhIDTemp = response.quoted_source_id;
            } else if (response.type === "Reply") {
                type = 'Reply';
                historyJSON[tid] = { 'id': tid, 'type': type, 'source': response.replyto_source_id ,'priority':2};
                searhIDTemp = response.replyto_source_id;
            }

        });
        if (foundSourceFlag == 1) {
            break;
        }

    }
    printTweetHierarchy(historyJSON); 
    getTweetInfo(historyJSON[sourceTweet]['id']).then(tweetRawData => {
        if (tweetRawData) {
            let dateArr = tweetRawData.datetime.split(' ');
            fromDate = dateArr[0];
            toDate = getCurrentDate();
            getDatesDist(sourceTweet, fromDate, toDate, 'all').then(response => {
                console.log(response);
                createTweetAnalysis(sourceTweet, fromDate, toDate, 'trackAnalysisMain', tweetRawData.author_profile_image, tweetRawData.author, response);

            })
            //    initiateTweetAnalysis(historyJSON[sourceTweet]['id'], dateArr[0], toDate, historyJSON[sourceTweet]['type'],response)
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


    //TODO::render right panel 


    //TODO::build network here
    //div id for tree ; trackTopology
    // data=data.flat();
    //  let datesWcount = data;
    // getDatesDist(sourceTweet,fromDate,toDate,'all').then(response => {
    //     console.log(response);
    // })
    //  console.log(dates)


}




// const makeAnalysisReadyForTweet = (tweetID,data) => {

// }

//DateInput Box
const drawDateBox = (offset, tweetID) => {
    $('#dateInputTrack-' + offset).html('<div id="date-divTrack-' + tweetID + '-' + offset + '"><form id="trackDateForm-' + tweetID + '-' + offset + '"><div class="d-flex mb-3"><div class="form-group   my-0  mr-2 ml-auto  border smat-rounded d-flex px-2 py-1  bg-white"><i class="far fa-calendar-alt mx-2 text-normal " style="margin-top:11px;"></i><input type="text" class="form-control datepicker-here  smat-from" name="fromDate" id="fromDateTrack-' + tweetID + '-' + offset + '" placeholder="From Date" onkeydown="return false;" style="border:0px;"autocomplete="OFF" data-language="en" required></div><div class="form-group  my-0  mr-2 border smat-rounded d-flex px-2 py-1  bg-white"><i class="far fa-calendar-alt mx-2 text-normal" style="margin-top:11px;"></i><input type="text" class="form-control datepicker-here smat-to " name="toDate" id="toDateTrack-' + tweetID + '-' + offset + '"  placeholder="To Date" onkeydown="return false;" style="border:0px;" autocomplete="OFF" data-language="en" required></div><button class="btn  btn-primary  " id="submit-btn-' + tweetID + '-' + offset + '"  type="submit" style="border-radius:50%;margin-top:5px;"> <span>Go </span> </button></div></form></div>');
}


const drawconnectingboxes = (offset, tweetID, data, profilePic = null, author = null) => {
    $('#trackDates-' + offset).html('<div id="temp"><div class="card shadow"> <div class="card-body">  <div class="profilePictureDiv p-1 text-center mr-2"><img src="' + profilePic + '" style="height:55px;border-radius:50%"></div><div class=" text-truncate">' + author + '</div></div></div>')
    for (let i = 0; i < data.length; i++) {
        $('#temp').append('<div id="dateLevel-' + tweetID + '-' + i + '" style="display: block;"><svg height="50"><line class="trackDateConnecter" x1="170.5" y1="0" x2="170.5" y2="50" stroke="grey" stroke-width="2" id="dateLine-' + tweetID + '-' + i + '"></line></svg><div class="card trackDateCard shadow" value="' + data[i][0] + '|' + tweetID + '|' + i + '"  id=""><div class="card-body "  ><div class="trackDateTitle text-center font-weight-bold"  >' + data[i][0] + '</div><div class="trackCount text-center ">' + data[i][1] + ' tweets </div></div></div></div>');
    }

}

const drawBoxesForCategories = (offset, tweetID, date) => {
    let types = ['retweet', 'QuotedTweet', 'Reply'];
    //prepare boxes here$
    // $('#somediv').html( )
    $('#trackCategoryInfo-' + offset).html('<div style="display: block;" ><div class="card trackCategoryCard shadow  " id=""><div class="card-body " value=""><div><div class="trackCount text-center ">Showing Results for</div><div class="trackDateTitle text-center font-weight-bold">' + date + '</div></div><ul class="list-group list-group-flush" ><li class="list-group-item trackCategoryBox mt-2" value="' + tweetID + '|' + date + '|' + 'retweet" ><div><div class="trackCategoryTitle text-left "> <b>Re-Tweets</b></div><div class="trackCategoryCount text-left "><span id="retweetCount-' + tweetID + '-' + date + '" >0</span> tweets </div></div></li><li class="list-group-item trackCategoryBox mt-2 " value="' + tweetID + '|' + date + '|' + 'QuotedTweet" ><div><div class="trackCategoryTitle text-left "> <b>Quoted Tweets</b></div><div class="trackCategoryCount text-left "><span id="QuotedTweetCount-' + tweetID + '-' + date + '" >0</span> tweets </div></div></li><li class="list-group-item trackCategoryBox mt-2" value="' + tweetID + '|' + date + '|' + 'Reply "><div><div class="trackCategoryTitle text-left "> <b>Reply Tweets</b></div><div class="trackCategoryCount text-left "><span id="ReplyCount-' + tweetID + '-' + date + '">0</span> tweets </div></div></li></ul></div></div></div>');

    types.forEach(element => {
        getFreqDataForTweets(tweetID, date, date, element).then(response => {
            if (response.data.length > 0) {
                $('#' + element + 'Count-' + tweetID + '-' + date).text(response.data[0][1]);
            }
        });
    });



}


const createTweetAnalysis = (tweetID, from, to, div, profilePic, author, datesData) => {
    let allotedID = analysisHistory.length;
    analysisHistory[tweetID] = [{ 'allotedID': allotedID }];
    $('#' + div).html('<div class="tweetTrackDiv my-3 ml-auto mr-auto" value="' + allotedID + '" id="trackParent-' + allotedID + '"><div class="row h-100 border"><div class="col-sm-3  py-3 px-0" ><div class="datesCol px-3" id="trackDates-' + allotedID + '"></div></div><div class="col-sm-3  py-3"><div id="trackCategoryInfo-' + allotedID + '"></div></div><div class="col-sm-6  py-3"><div id="dateInputTrack-' + allotedID + '"></div><div class="card shadow"><div class="card-body tweetRawTrackDiv" id="trackRawData-' + allotedID + '"></div></div></div></div></div>');
    drawconnectingboxes(allotedID, tweetID, datesData.data, profilePic, author);
    drawDateBox(allotedID, tweetID);
    drawBoxesForCategories(allotedID, tweetID, from)
}


const printTweetHierarchy = (arr) => {
    
}