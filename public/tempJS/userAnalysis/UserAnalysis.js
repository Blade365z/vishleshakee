//User Analysis Logic For Vishleshakee version 2.0 , Deployed by OSINT Lab ,IIT-G
//Witten By :: Mala Das , Amitabh Boruah 

//Use camelCase please notations:)



//Imports

import { formulateUserSearch } from '../utilitiesJS/userSearch.js';
import { get_tweet_location, getCompleteMap } from '../utilitiesJS/getMap.js';
import { getSuggestionsForUA, getUserDetails, getFreqDistDataForUA, getTweetIDsForUA, getSentiDistDataForUA, getCooccurDataForUA, addNormalSearchToDB, populateRecentSearches, getUsersFromCrawlerList } from './helper.js';
import { getCurrentDate, getRangeType, dateProcessor, getDateInFormat, getDateRange } from '../utilitiesJS/smatDate.js';
import { TweetsGenerator } from '../utilitiesJS/TweetGenerator.js';
import { generateUniqueID } from '../utilitiesJS/uniqueIDGenerator.js';
import { generateFreqDistBarChart, generateFrequencyLineChart, generateSentiDistBarChart, generateSentiDistLineChart, generateBarChartForCooccur } from './chartHelper.js';
import { displayErrorMsg, getRelationType, makeDropDownReady, makeSmatReady, makeSuggestionsReady } from '../utilitiesJS/smatExtras.js'
import { forwardToNetworkAnalysis, forwardToHistoricalAnalysis } from '../utilitiesJS/redirectionScripts.js';
import { requestToSpark, checkStatus, storeToMySqlAdvanceSearchData, getOuputFromSparkAndStoreAsJSON, getFreqDistDataForAdvanceHA, getSentiDistDataForAdvanceHA, getTweetIDsForAdvanceHA, getCooccurDataForAdvanceHA } from './AdvanceHelper.js'
import { removeFromStatusTableNormal } from '../historicalAnalysis/helper.js';
import { addTrackToDb } from '../config/helper.js';


//Global Declaration
var suggestionPopularIDs = ['$18839785', '$1447949844', '$1346439824', '$405427035', '$3171712086', '$1153045459', '$24705126', '$131188226', '$2570829264', '$207809313', '$2584552812', '$336611577', '$841609973687762944', '$4743651972', '$2166444230', '$3314976162', '$627355202', '$295833852', '$97217966', '$478469228', '$2541363451', '$39240673'];

var suggestionPopularNewsHandleIDs = ['$19897138', '$16343974', '$39240673', '$240649814', '$42606652', '$321271735', '$372754427', '$6509832', '$6433472', '$36327407', '$37034483', '$20751449', '$112404600', '$438156528', '$739053070932287488', '$267158021', '$128555221', '$742143', '$759251', '$701725963', '$55186601', '$28785486'];
var SearchID, QueryMain, fromDate, toDate;   //Global Variable to keep Track of current search
var mentionUniqueID, hashtagsUniqueID, userID;
var suggShowFLag = 1;
var mainInputCounter = 0, searchType = 0;
var searchRecords = [];
var suggestionsGlobal, suggInputBoxBuffer = [];


//Logic Implementation 
jQuery(function () {
    $('#tableInitialTitle,#tableInitialTitleAdv , #userSuggestions').html('<div class="text-center pt-5  " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>');



    makeSmatReady();
    if (localStorage.getItem('smat.me')) {
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        userID = userInfoTemp['id'];
    } else {
        window.location.href = 'login';
    }
    // readSearchFromLocalDB('smatSearchHistory','UAsearches',userID);

    toDate = getCurrentDate()
    fromDate = dateProcessor(toDate, '-', 3);
    if (incoming) {
        if (fromDateReceived && toDateReceived) {
            fromDate = fromDateReceived;
            toDate = toDateReceived;
        }
        SearchID = incoming;
        initateUserSearch(SearchID);
    }
    populateRecentSearches(userID, 0, 'ua').then(response => {
        if(response.length<1){
            displayErrorMsg('tableInitialTitle','normal','No recent normal searches found in records.',false);
        }
        response.forEach(element => {
            addQueryToStatusTable(0, element.queryID, element.query, element.fromDate, element.toDate, element.queryID, false, element.hashtagID, element.mentionID);
        });
    });
    populateRecentSearches(userID, 1, 'ua').then(response => {
        if(response.length<1){
            displayErrorMsg('tableInitialTitleAdv','normal','No recent advance searches found in records.',false);
        }
        response.forEach(element => {
            addQueryToStatusTable(1, element.queryID, element.query, element.fromDate, element.toDate, element.queryID, false, element.hashtagID, element.mentionID);
        });
    });
    getUsersFromCrawlerList().then(response => {
        let clearFlag=0;
        response.forEach(element => {
            getUserDetails(element['track']).then(response => {
                if(clearFlag==0){
                    $('#userSuggestions').html('');
                    clearFlag=1;
                }
                printUserListNoLoop(response, 'userSuggestions');
            });
        });
    })
    $('.nav-item ').removeClass('smat-nav-active');
    $('#nav-UA').addClass('smat-nav-active');
   

    $('#fromDateUA').val(fromDate);
    $('#toDateUA').val(toDate);
    makeSuggestionsReady('haQueryInputBox', 50).then(response => {
        suggestionsGlobal = response;
        if (suggInputBoxBuffer.length > 0) {
            suggInputBoxBuffer.forEach(element => {
                makeDropDownReady(response, 'input-' + element, 'suggestion');
            });

        }

    });

    $('#uaQueryHandleForm').on('submit', function (e) {
        //logic different in historical analysis :: If required please update in other module
        //This logic is written on basis of requirement raised by Rahul Yumlembam.
        e.preventDefault();
        if (searchType == 1) {
            let q = SearchID;
            fromDate = $('#fromDateUA').val();
            toDate = $('#toDateUA').val();
            let operandInput = '&';
            if (mainInputCounter > 0) {
                for (let i = 0; i <= mainInputCounter; i++) {
                    if (i != 0) {

                        let queryInput = $('#queryID' + i).val();
                        if (i > 1) {
                            if (document.getElementById('notID' + i).checked) {
                                queryInput = '!' + queryInput;
                            }
                            operandInput = $('#operandID' + i).val();
                        }
                        q = q + operandInput + queryInput;
                    }
                }

                q = '(' + q + ')';
            }
            openSpecificTab('advQueryTab','recentSearchTab');
            displayErrorMsg('errorMsgUA', 'success', 'Advanced Query triggered successfully!');
            initateUserSearch(q);
        } else {
            fromDate = $('#fromDateUA').val();
            toDate = $('#toDateUA').val();
            initateUserSearch(SearchID);
        }

    });

    $('#uaSearchForm').on('submit', function (e) {
        e.preventDefault();
        let tokenCapturedForSearch = $('#queryUASearch').val();
        tokenCapturedForSearch = tokenCapturedForSearch.trim();
        formulateUserSearch(tokenCapturedForSearch, 'userContainerList');
    });

    $('body').on('click', '.authorName', function () {
        let capturedID = $(this).attr('value');
        $('.modal').modal('hide');
        initateUserSearch(capturedID);
    })


    $('.suggHandles').on('click', function () {
        let capturedToken = $(this).attr('value');
        initateUserSearch(capturedToken);
    });
    $('body').on('click', 'div .deleteBtn', function () {
        let type = $(this).attr('type');
        let idCaptured = $(this).attr('value');
        if (type == '0') {
            $(this).parent().parent().remove();
            removeFromStatusTableNormal(idCaptured);
        } else {
            alert('TODO::Spark Status delete route')
            // removeFromStatusTable(filename);
            // $(this).parent().parent().remove();
            // deleteFromStatusTable(filename)
        }
        delete searchRecords[idCaptured];
        checkRecords();

       
    });
    
    let tweetDivHeight = $('#userInfoDiv').height();
    $('#uaTweetsDiv').css('max-height', tweetDivHeight - 20 + 'px');

    $('body').on('click', 'div .closeGraph', function () {
        let valueCapt = $(this).attr('value');
        $('.' + valueCapt).remove();
    });

    $('#showUAsugg').on('click', function () {
        suggestionToggle();
    });

    $('#locationTabUA').on('click', function () {
        $('#locationContentUA').html(`<div id="result-div-map" style="height:400px;"></div>
                                        <div class="modal_lm">
                                            <div class="modal-content">
                                                <span class="close-button">&times;</span>
                                                <ul id="markersList"></ul>
                                            </div>
                                        </div>`);
        let rangeType = getRangeType(fromDate, toDate);

        get_tweet_location(SearchID, fromDate, toDate, rangeType, null).then(response => {
            getCompleteMap('result-div-map', response);
            // for (var i = 0; i < response.length; i++) {

            // }
        });

    });

    $('body').on('click', 'div .query', function () {
        let queryCaptured = $(this).text().trim();
        forwardToHistoricalAnalysis(queryCaptured, fromDate, toDate);
    });

    $('body').on('click', 'div .analyzeNetworkButton', function () {
        let args = $(this).attr('value');
        args = args.split(/[|]/).filter(Boolean);
        forwardToNetworkAnalysis(args);
    })



    $('body').on('click', 'div .filterTweets', function () {
        let args = $(this).attr('value');
        args = args.split(/[|]/).filter(Boolean);

        if (args[4] === 'hour' || args[4] === 'day') {
            getTweetIDsForUA(SearchID, args[1], args[2], args[4], args[0]).then(response => {
                TweetsGenerator(response.data, 6, args[3], args[1], args[2], true, args[4]);
            });
        } else if (args[4] === '10sec') {
            getTweetIDsForUA(SearchID, args[1], args[2], args[4], args[0], 1).then(response => {
                TweetsGenerator(response.data, 6, args[3], args[1], args[2], true, args[4]);
            });
        }
    });

    $('body').on('click','div #addHandleToCrawlerList',function(){
        getUserDetails(SearchID).then(response=>{
            addTrackToDb(null,SearchID,'user',response.author_screen_name,1);
            //TODO::Complete UI, add success error messages, confirm add pop up
        });
    })

    //Advanced Qurey logic for UA 
    $('body').on('click', 'div #addQueryButton', function () {
        $('#addQueryHint').css('display', 'none');
        mainInputCounter += 1;
        if (mainInputCounter > 0) //each input will increase mainInputCounter
            searchType = 1; //if more than ine input is available, thn it is advance search
        $('#removeField').css('display', 'block');
        if (mainInputCounter == 1) {
            $('#queryAdvUA').append('<div id="fieldID' + mainInputCounter + '" ><div class=" form-group  mb-1 d-flex"><div class=" border smat-rounded px-2 py-1 bg-white w-100 d-flex"  id="input-' + mainInputCounter + '"><input type="text" class="form-control  typeahead  smat-ha-Input " id="queryID' + mainInputCounter + '" placeholder="Query"  autocomplete="OFF"  required></div></div></div>');
            !suggestionsGlobal ? suggInputBoxBuffer.push(mainInputCounter) : makeDropDownReady(suggestionsGlobal, 'input-' + mainInputCounter, 'suggestion');

        } else {
            // not operation enabled
            $('#queryAdvUA').append('<div id="fieldID' + mainInputCounter + '" ><div class=" form-group  mb-1 d-flex"><div class="" value="' + mainInputCounter + '"><select class=" smat-select btn HA-operand-select mx-2" id="operandID' + mainInputCounter + '" ><option value="&">AND</option><option class="or-option"  value="|">OR</option></select></div><div class=" border smat-rounded px-2 py-1 bg-white w-100 d-flex" id="input-' + mainInputCounter + '" ><input  type="checkbox" value="" name="NOT" id="notID' + mainInputCounter + '" title="NOT" value="option2" style="margin-top:13px;"><input type="text" class="form-control   typeahead smat-ha-Input " id="queryID' + mainInputCounter + '" placeholder="Query"  autocomplete="OFF" required></div></div></div>');
            !suggestionsGlobal ? suggInputBoxBuffer.push(mainInputCounter) : makeDropDownReady(suggestionsGlobal, 'input-' + mainInputCounter, 'suggestion');

        }
        if (mainInputCounter === 2) {
            $('#addQueryButton').css('display', 'none');
        }
    });

    $('body').on('click', 'div #removeField', function () {
        $('#fieldID' + mainInputCounter).remove();
        mainInputCounter -= 1;
        if (mainInputCounter < 1) {
            $('#removeField').css('display', 'none');
            searchType = 0;
            $('#addQueryHint').css('display', 'block');
        }
        if ($('#addQueryButton').is(":hidden") && mainInputCounter < 3) {
            $('#addQueryButton').css('display', 'block');
        }
    });

    $('body').on('click', 'div .showBtn', function () {
        let idCaptured = $(this).attr('value');
        initateUserSearch(searchRecords[idCaptured][0]['query'], searchRecords[idCaptured][0]['filename'], searchRecords[idCaptured][0]['from'], searchRecords[idCaptured][0]['to'], searchRecords[idCaptured][0]['mentionUniqueID'], searchRecords[idCaptured][0]['hashtagUniqueID'], searchRecords[idCaptured][0]['searchType'], false);
    })

});

// const generateSuggestions = (userIDArray, div, type = null) => {
//     let cookie = 'smat-' + type + '-suggestionJSON';
//     let helperResult;
//     if (localStorage.getItem(cookie)) {
//         helperResult = JSON.parse(localStorage.getItem(cookie));
//     } else {
//         helperResult = getSuggestionsForUA(userIDArray);
//         localStorage.setItem(cookie, JSON.stringify(helperResult));
//     }
//     let counter = 0;
//     let index = 1;
//     helperResult.forEach(element => {
//         counter++;
//         if (counter === 12)
//             index = 2
//         $('#' + div + '-' + index).append('<div class="suggHandles" title="' + element[1] + '"  value="' + element[0] + '"> <img src="' + element[3] + '" class="profilePicSmall UAProfilePicture" /> </div>');
//     });

// }

const initateUserSearch = (query, key = null, fromDateArg = null, toDateArg = null, mentionUniqueIDArg = null, hashtagsUniqueIDArg = null, searchTypeArg = null, addToStatusTable = true) => {
    if (fromDateArg && toDateArg) {
        fromDate = fromDateArg;
        toDate = toDateArg;
        $('#fromDateUA').val(fromDate);
        $('#toDateUA').val(toDate);
    }
    if (mentionUniqueIDArg && hashtagsUniqueIDArg) {
        mentionUniqueID = mentionUniqueIDArg;
        hashtagsUniqueID = hashtagsUniqueIDArg;
    } else {
        mentionUniqueID = generateUniqueID();
        hashtagsUniqueID = generateUniqueID();
    }
    //One extra checking if Advaced Query or normal search
    //Two Seach types :: 1(Advanced query) , 0 (Normal query)
    if (searchTypeArg) {
        searchType = searchTypeArg;
    } else {
        if (query.includes('&') || query.includes('|')) {
            searchType = 1;
            QueryMain = query;
        } else {
            $('#addQueryHint').css('display', 'block');
            ResetAdvQueryIps('addAdvQueryDiv');
            searchType = 0;
            SearchID = query;
        }
    }


    let unique_name_timestamp = new Date().getTime()  //mala
    if (addToStatusTable) {
        if (searchType == 0) {
            addNormalSearchToDB(unique_name_timestamp, userID, query, fromDate, toDate, 'Success', 'ua', hashtagsUniqueID, mentionUniqueID);
        } else {
            //TODO::add to sparkstarsTable
        }
        addQueryToStatusTable(searchType, null, query, fromDate, toDate, unique_name_timestamp, false, mentionUniqueID, hashtagsUniqueID,true); //mala
    }
    if (searchType === 0) {
        getUserDetails(SearchID).then(data => makePageReady(data));
        let rangeType = getRangeType(fromDate, toDate);
        // window.history.pushState("", "", 'userAnalysis?query=' + encodeURIComponent(SearchID) + '&from=' + fromDate + '&to=' + toDate);
        frequencyDistributionUA(SearchID, rangeType, fromDate, toDate, null, 'freqContentUA', false);

        sentimentDistributionUA(SearchID, rangeType, fromDate, toDate, null, 'sentiContentUA', false);
        //forHashtagsGraph
        plotDistributionGraphUA(SearchID, fromDate, toDate, 'hashtag', hashtagsUniqueID, userID, 'hashtagsContentTab');
        //forMentionsGraph
        plotDistributionGraphUA(SearchID, fromDate, toDate, 'mention', mentionUniqueID, userID, 'mentionsContentUA');
    } else {
        //mala
        console.log('Advanced Search Detected!');
        // 11 trigger to spark function
        console.log(query);
        triggerSparkRequest(query, fromDate, toDate, unique_name_timestamp);
        //...TODOMALA
    }
}



//mala
const triggerSparkRequest = (query, fromDate, toDate, unique_name_timestamp, highlight = false) => {
    let queries = [query, fromDate, toDate];
    let query_list = get_tokens_wrt_pattern(queries); // get token
    console.log(query_list);

    // 12 store to MySQl.....
    storeToMySqlAdvanceSearchData(userID, unique_name_timestamp, fromDate, toDate, query, "running...", 'ua').then(data => {
        console.log(data);
    });

    // 13 request to spark.....
    requestToSpark(query_list, unique_name_timestamp).then(data => {
        console.log(data);
        let sparkID = data.id;
        // 14 add row to table UI.....
        addToStatusTable(sparkID, query, fromDate, toDate, unique_name_timestamp, highlight = false);
        // 15 check status until it becomes success.....
        let checkSpartStatusInterval = setInterval(function () { checkSparkStatus(sparkID, unique_name_timestamp, fromDate, toDate, query, checkSpartStatusInterval); }, 10000);

    });
}



//mala
const checkSparkStatus = (sparkID, unique_name_timestamp, fromDate, toDate, query, checkSpartStatusInterval) => {
    checkStatus(sparkID, unique_name_timestamp, userID).then(data => {
        console.log(data);
        if (data.status === 'success') {
            window.clearInterval(checkSpartStatusInterval);//clear the interval
            // // update status to MySQl.....
            // storeToMySqlAdvanceSearchData(userID, unique_name_timestamp, fromDate, toDate, query).then(data => {
            //     console.log(data);
            // });

            // write to file.....
            // getOuputFromSparkAndStoreAsJSON(sparkID, unique_name_timestamp, userID).then(data => {
            //     consle.log(data);
            //     // change status in table(UI).....  // (#Corona OR #Coronavirus)
            //     makeShowBtnReadyAfterSuccess(sparkID, unique_name_timestamp);
            // });

            //16 enable Show btn....
            makeShowBtnReadyAfterSuccess(sparkID, unique_name_timestamp);
        } else if (data.status === 'dead') {
            window.clearInterval(checkSpartStatusInterval);//clear the interval
            $('#' + sparkID + 'DeleteBtn').prop("disabled", false);
            $('#' + sparkID + 'Status').text('Dead');
        }
    });
}

//mala
const makeShowBtnReadyAfterSuccess = (sparkID, filename) => {
    $('#' + sparkID + 'ShowBtn').prop("disabled", false);
    $('#' + sparkID + 'DeleteBtn').prop("disabled", false);
    let btnValue = $('#' + sparkID + 'Btn').attr('value');
    // $('#' + sparkID + 'Btn').removeClass('btn-secondary');
    // $('#' + sparkID + 'Btn').addClass('btn-primary');
    $('#' + sparkID + 'Status').text('Success');
}

//mala
const get_tokens_wrt_pattern = (queries, pattern = null) => {
    var final_query_list = [];
    final_query_list = getDateRange(queries[1], queries[2]);
    final_query_list.push('i');
    if (pattern) {
        var query_list = queries[0].trim().match(pattern);
    } else {
        // var pattern = /#(\w+)|@(\w+)|\*(\w+)|\&|\||\!|\(|\)/g;
        var pattern = /#(\w+)|@(\w+)|\^(\w+)|\*(\w+)|\&|\||\!|\(|\)/g;
        var query_list = queries[0].trim().match(pattern);
    }
    return final_query_list.concat(query_list);
}



const makePageReady = (userDetails) => {

    $('.haTab').removeClass('active show');
    $('#freqContentUA').addClass('active show');
    $('.uaNav').removeClass('active');
    $('#frqTabUA').addClass('active');
    $('#UAAnalysisDiv').css('display', 'block');
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

    let tweetDivHeight = $('#ua-leftDiv').height();
    $('.uaTabTopRight').css('height', tweetDivHeight - 88 + 'px');
}


//Frequency Distribution chart Logic starts here
/*
Please NOTE :
1. Set a global with value defined as the parent div to ease the process we  need to append the chart.
2.Set append Args to True when append is requeired
*/
let freqParentDiv = 'freqContentUA';
export const frequencyDistributionUA = (query = null, rangeType, fromDate = null, toDate = null, toTime = null, div, appendArg = false) => {
    let chartType = 'freq-chart';
    let appendedChartParentID = rangeType + '-' + chartType;
    $('.' + appendedChartParentID).remove();

    let chartDivID = div + '-' + rangeType + '-chart';
    let summaryDivID = div + '-' + rangeType + '-summary';
    let chartTweetDivID = div + rangeType + '-tweets';
    // class="' + rangeType + '-charts"
    if (rangeType == 'hour') {
        $('.hour-' + chartType).remove();
        $('.10sec-' + chartType).remove();
    }
    if (appendArg) {
        $('#' + freqParentDiv).append('<div class=" mt-2   appendedChart ' + appendedChartParentID + '"><div class="d-flex"> <div class="mr-auto closeGraph"    value="' + rangeType + '-freq-chart" title="close" > close <i class="fas fa-times"></i> </div> </div> <div class="row"><div class="col-sm-8"><div class="uaTab freqDistChart resultDiv  chartDiv border" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="freqDistTweets border resultDiv " id="' + chartTweetDivID + '"></div><div class="freqDistSummary border d-flex pt-2 resultDiv "  id="' + summaryDivID + '" ></div></div></div></div>');
    } else {
        $('#' + div).html('<div><div class="row"><div class="col-sm-8"><div class="uaTab freqDistChart border resultDiv  chartDiv" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="freqDistTweets resultDiv   border" id="' + chartTweetDivID + '"></div><div class="freqDistSummary border d-flex pt-2 resultDiv "  id="' + summaryDivID + '" ></div></div></div></div>');
    }
    //Loader...
    $('#' + chartDivID).html('<div class="text-center pt-5  " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
    $('#' + chartTweetDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>');
    if (rangeType == 'day') {
        getFreqDistDataForUA(query, fromDate, toDate, null, rangeType, 0).then(response => {
            if (response.data.length < 1) {
                $('.resultDiv').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
            } else {
                generateFreqDistBarChart(query, response, rangeType, chartDivID);
                freqSummaryGenerator(response, summaryDivID, rangeType);
                getTweetIDsForUA(query, fromDate, toDate, rangeType, null).then(response => {
                    TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
                });
            }

        });


    } else if (rangeType == 'hour') {
        getFreqDistDataForUA(query, fromDate, toDate, null, rangeType, 0).then(response => {
            if (response.data.length < 1) {
                $('.resultDiv').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
            } else {
                generateFreqDistBarChart(query, response, rangeType, chartDivID);
                freqSummaryGenerator(response, summaryDivID, rangeType);
                getTweetIDsForUA(query, fromDate, toDate, rangeType, null).then(response => {
                    TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
                });
            }
        });

    } else {
        getFreqDistDataForUA(query, fromDate, toDate, null, rangeType, 1).then(response => {
            if (response.data.length < 1) {
                $('.resultDiv').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
            } else {
                generateFrequencyLineChart(query, response, rangeType, chartDivID);
                freqSummaryGenerator(response, summaryDivID, rangeType);
                getTweetIDsForUA(query, fromDate, toDate, rangeType, null, 1).then(response => {
                    let fromDateTemp = fromDate.split(/[ ,]+/).filter(Boolean);
                    TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, fromDate, true, rangeType);
                });
            }
        });
    }

}
let sentiParentDiv = 'sentiContentUA';
export const sentimentDistributionUA = (query = null, rangeType, fromDate = null, toDate = null, toTime = null, div, appendArg = false) => {
    let chartType = 'senti-chart';
    let appendedChartParentID = rangeType + '-' + chartType;
    $('.' + appendedChartParentID).remove();
    let chartDivID = div + '-' + rangeType + '-chart';
    let summaryDivID = div + '-' + rangeType + '-summary';
    let chartTweetDivID = div + rangeType + '-tweets';
    if (rangeType == 'hour') {
        $('.hour-' + chartType).remove();
        $('.10sec-' + chartType).remove();
    }
    if (appendArg) {
        $('#' + sentiParentDiv).append('<div class=" mt-2 ' + appendedChartParentID + '"><div class="d-flex"> <div class="mr-auto closeGraph"    value="' + rangeType + '-senti-chart" title="close" > close <i class="fas fa-times"></i> </div> </div> <div class="row"><div class="col-sm-8"><div class="uaTab sentiDistChart chartDiv resultDiv  border" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="sentiDistTweets  resultDiv border" id="' + chartTweetDivID + '"></div><div class="sentiDistSummary border  resultDiv d-flex pt-2"  id="' + summaryDivID + '" ></div></div></div></div>');
    } else {
        $('#' + div).html('<div><div class="row"><div class="col-sm-8"><div class="uaTab resultDiv  sentiDistChart  chartDiv border"  id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="sentiDistTweets  resultDiv border" id="' + chartTweetDivID + '"></div><div class="sentiDistSummary resultDiv  border d-flex pt-2"  id="' + summaryDivID + '" ></div></div></div></div>');
    }
    //Loader...
    $('#' + chartDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
    $('#' + chartTweetDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>');
    if (rangeType == 'day') {
        getSentiDistDataForUA(query, fromDate, toDate, null, rangeType, 0).then(response => {
            if (response.data.length < 1) {
                $('.resultDiv').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
            } else {
                generateSentiDistBarChart(response, query, rangeType, chartDivID);
                generateSentimentSummary(response, summaryDivID, rangeType);
                getTweetIDsForUA(query, fromDate, toDate, rangeType, null).then(response => {
                    TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
                });
            }

        });

    } else if (rangeType == 'hour') {
        getSentiDistDataForUA(query, fromDate, toDate, null, rangeType, 0).then(response => {
            if (response.data.length < 1) {
                $('.resultDiv').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
            } else {
                generateSentiDistBarChart(response, query, rangeType, chartDivID);
                generateSentimentSummary(response, summaryDivID, rangeType);
                getTweetIDsForUA(query, fromDate, toDate, rangeType, null).then(response => {
                    TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
                });
            }
        });
    } else {

        getSentiDistDataForUA(query, fromDate, toDate, null, rangeType, 1).then(response => {
            if (response.data.length < 1) {
                $('.resultDiv').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
            } else {
                generateSentiDistLineChart(query, response, rangeType, chartDivID);
                generateSentimentSummary(response, summaryDivID, rangeType);
                getTweetIDsForUA(query, fromDate, toDate, rangeType, null, 1).then(response => {
                    let fromDateTemp = fromDate.split(/[ ,]+/).filter(Boolean);
                    TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, fromDate, true, rangeType);
                });
            }
        });
    }



}

const plotDistributionGraphUA = (query, fromDate, toDate, option, uniqueID, userID, div) => {
    //Loader...
    let chartDivID = option + '-chart';
    $('#' + div).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>');
    getCooccurDataForUA(query, fromDate, toDate, option, uniqueID, userID).then(response => {
        if (response[0]['data'].length < 1) {
            $('#' + div).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
        } else {
            let relType = getRelationType(query, option);
            $('#' + div).html('<div class="d-flex"> <span class="ml-auto mr-3"><p class="m-0 smat-box-title-large font-weight-bold text-dark" id="' + option + '-total">0</p><p class="pull-text-top smat-dash-title m-0 ">Total Nodes</p></span> <button class="btn btn-primary  smat-rounded  mr-1  mt-1 analyzeNetworkButton "   value="' + query + '|' + toDate + '|' + fromDate + '|' + relType + '|' + uniqueID + '|' + userID + '" > <span> Analyse network </span> </button></div><div class="px-3" id="' + chartDivID + '" style="min-height:30%;"></div>');
            response.length < 1 ? $('#' + div).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>') : generateBarChartForCooccur(query, response[0]['data'], chartDivID, option, fromDate, toDate);
            $('#' + option + '-total').text(response[0]['nodes']);
        }
    });
}


//Summary Scripts
const freqSummaryGenerator = (data = null, div, rangeType) => {
    data = data['data'];
    $('#' + div).html('<div class="d-flex"> <span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-dark" id="freqTotalPublic-' + rangeType + '">0</p><p class="pull-text-top smat-dash-title m-0 ">Tweets Arrived</p></span></div><div class="d-flex "><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-normal" id="publicNormalTotal-' + rangeType + '">0</p><p class="pull-text-top smat-dash-title m-0 ">Normal</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-sec" id="publicSecTotal-' + rangeType + '">0</p><p class="pull-text-top smat-dash-title m-0">Security</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-com" id="publicComTotal-' + rangeType + '">0</p><p class="pull-text-top smat-dash-title m-0">Communal</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-com_sec" id="publiccom_secTotal-' + rangeType + '">0</p><p class="pull-text-top smat-dash-title m-0">Sec.& Com.</p></span></div>');

    let freqTotal = 0, totalNormal = 0, totalSec = 0, totalCom = 0, totalcom_sec = 0;
    data.forEach(element => {
        freqTotal += element[1];
        totalNormal += element[5];
        totalSec += element[3];
        totalCom += element[2];
        totalcom_sec += element[4];

    });

    $('#freqTotalPublic-' + rangeType).text(freqTotal);
    $('#publicNormalTotal-' + rangeType).text(totalNormal);
    $('#publicSecTotal-' + rangeType).text(totalSec);
    $('#publicComTotal-' + rangeType).text(totalCom);
    $('#publiccom_secTotal-' + rangeType).text(totalcom_sec);



}
const generateSentimentSummary = (data = null, div, range) => {
    let arrTemp = [];
    let posSumTemp = 0, negSumTemp = 0, neuSumTemp = 0;
    if (data['data'].length > 0) {
        data['data'].forEach(element => {
            posSumTemp += parseInt(element[1]);
            negSumTemp += parseInt(element[2]);
            neuSumTemp += parseInt(element[3]);
        });
    }
    $('#' + div).html('<div class="sentiSummaryDiv" id="sentiSummary' + range + '" ><div class="removeMarginMediaQuery"  > <div  id="sentiSummaryBar-' + range + '" ></div> </div><div> <div class="d-flex "><div><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">' + posSumTemp + '</p><p class="pull-text-top m-0 smat-dash-title ">Positive</p></div><div class="mx-2"><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">' + neuSumTemp + '</p><p class="pull-text-top m-0 smat-dash-title ">Neutral</p></div><div class="mx-2"><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">' + negSumTemp + '</p><p class="pull-text-top m-0 smat-dash-title ">Negative</p></div></div></div></div>');

    arrTemp = [posSumTemp, negSumTemp, neuSumTemp];
    generateSentimentSummaryBar(arrTemp, "sentiSummaryBar-" + range, 'hour')
}
const generateSentimentSummaryBar = (sentiTotalArray, div, range_type) => {

    let total_pos = sentiTotalArray[0];
    let total_neg = sentiTotalArray[1];
    let total_neu = sentiTotalArray[2];

    $('#' + div).html('<div class="row  p-1"> <span style="display: inline-block;"><div class=" sentiment_bar_summary border sentiment_bar_pos" id="' + div + '_bar_' + range_type + '_pos" data-toggle="popover"  data-content="' + total_pos + ' Positive Tweets posted"></div> </span> <span style=" display: inline-block;"><div class="  sentiment_bar_summary border sentiment_bar_neu "  id="' + div + '_bar_' + range_type + '_neu" data-toggle="popover" data-content="' + total_neu + ' Neutral Tweets posted"></div>  </span> <span style=" display: inline-block;"><div class=" sentiment_value_neg sentiment_bar_summary border sentiment_bar_neg"  id="' + div + '_bar_' + range_type + '_neg"data-toggle="popover"  data-content="' + total_neg + ' Negative Tweets posted"></div></span></div ><div class="row"><span>  <a class="senti_summary_bar_text"  id="' + div + '_value_' + range_type + '_pos" >23%</a>  </span><span> <a  class="senti_summary_bar_text"  id="' + div + '_value_' + range_type + '_neu" >48%</a>   </span> <span><a class="senti_summary_bar_text"  id="' + div + '_value_' + range_type + '_neg" >29%</a></span>');

    var total = total_pos + total_neg + total_neu;


    var pos = Math.round((total_pos / total) * 100);
    var neg = Math.round((total_neg / total) * 100);
    var neu = Math.round((total_neu / total) * 100);


    $('#' + div + '_bar_' + range_type + '_pos').css('width', pos + 'px');
    $('#' + div + '_bar_' + range_type + '_neg').css('width', neg + 'px');
    $('#' + div + '_bar_' + range_type + '_neu').css('width', neu + 'px');

    $('#' + div + '_value_' + range_type + '_pos').css('margin-left', (pos / 4) + 'px');
    $('#' + div + '_value_' + range_type + '_neg').css('margin-left', (neg / 4) + 5 + 'px');
    $('#' + div + '_value_' + range_type + '_neu').css('margin-left', (neu / 4) + 5 + 'px');


    $('#' + div + '_value_' + range_type + '_pos').text(pos + '%');
    $('#' + div + '_value_' + range_type + '_neg').text(neg + '%');
    $('#' + div + '_value_' + range_type + '_neu').text(neu + '%');


}

//Tooggling the Suesstion List
const suggestionToggle = () => {
    if (suggShowFLag == 0) {
        $('#searchTable').css('display', 'block');
        $('#suggestionCurrentStatus').text('Hide');
        suggShowFLag = 1;
    } else {
        $('#searchTable').css('display', 'none');
        $('#suggestionCurrentStatus').text('Show');
        suggShowFLag = 0;
    }
}
/*
The code written below is to capture the back event. Since we are appending the window.history wtih current query so redirect the page we have to write this .
*/
$(window).on('popstate', function (event) {
    var url = window.location.href;
    window.location.href = url;
});


const addQueryToStatusTable = (searchType, sparkID = null, query, fromDate, toDate, unique_name_timestamp = null, fromStatusTable = false, mentionUniqueID = null, hashtagsUniqueID = null,highlight=false) => {
  
    unique_name_timestamp != null ? unique_name_timestamp : unique_name_timestamp = new Date().getTime()
    let recordTemp = [{ 'query': query, 'from': fromDate, 'to': toDate, 'mentionUniqueID': mentionUniqueID, 'hashtagUniqueID': hashtagsUniqueID, 'searchType': searchType, "filename": unique_name_timestamp.toString() }];
    searchRecords[unique_name_timestamp] = recordTemp;
    let status = 'Running...';
    let queryElement = '';
    let disabledProperty = '';
    let tableDiv = '';
    let queryTemp;
    fromStatusTable === true ? disabledProperty = '' : disabledProperty;
    fromStatusTable === true ? status = 'Success' : status;
    if (searchType == 1) {
        $('#tableInitialTitleAdv').html('');
        tableDiv = "uaAdvStatusTable";
        queryElement = decodeQuery(query);
        sparkID = unique_name_timestamp;
        queryTemp = query.replace('(', '');
        queryTemp = queryTemp.replace(')', '');
        let queries = queryTemp.split(/[|&]+/g).filter(Boolean);
        queryTemp = queries[0];

    } else {
        $('#tableInitialTitle').html('');
          tableDiv = "uaStatusTable";
        sparkID = unique_name_timestamp;
        status = 'Success';
        disabledProperty = '';
        queryElement = '';
        queryTemp = query;
    }
    let hightlightArg='';
    if(highlight){
    hightlightArg='highlighted-'+sparkID+'  alert-danger';
        setTimeout(() => {
            $('.highlighted-'+sparkID).removeClass('alert-danger')
        }, 6000);
   }
    getUserDetails(queryTemp).then(data => {
        if (data)
            queryElement = '@' + data.author_screen_name + queryElement;
        //mala
        if (searchType)
            $('<tr class="'+hightlightArg+'"><td>' + queryElement + '</td><td>' + fromDate + '</td><td>' + toDate + '</td><td id="' + sparkID + 'Status">' + status + '</td><td><button class="btn btn-primary smat-rounded mx-1 showBtn" value="' + unique_name_timestamp + '" id="' + sparkID + 'ShowBtn" ' + disabledProperty + ' disabled> Show </button><button class="btn btn-danger mx-1  smat-rounded deleteBtn" value="' + unique_name_timestamp + '" id="' + sparkID + 'DeleteBtn" ' + disabledProperty + '  type="1" disabled> Delete </button></td></tr>').prependTo('#' + tableDiv);
        else
            $('<tr class="'+hightlightArg+'"> <td>' + queryElement + '</td><td>' + fromDate + '</td><td>' + toDate + '</td><td id="' + sparkID + 'Status">' + status + '</td><td><button class="btn btn-primary smat-rounded mx-1 showBtn" value="' + unique_name_timestamp + '" id="' + sparkID + 'ShowBtn" ' + disabledProperty + '> Show </button><button class="btn btn-danger mx-1  smat-rounded deleteBtn" value="' + unique_name_timestamp + '" id="' + sparkID + 'DeleteBtn" ' + disabledProperty + '  type="'+searchType+'"> Delete </button></td></tr>').prependTo('#' + tableDiv);
    });

}
const decodeQuery = (query) => {
    query = query.replace('(', '');
    query = query.replace(')', '');

    // let query = '#CAA&#Radio+!*protest';
    let queries = query.split(/[|&]+/g).filter(Boolean);
    let operands = query.match(/[|&]+/g);

    let counter = 0;
    let finalString = '';
    finalString = '';
    queries[0] = '';
    for (let i = 0; i < queries.length; i++) {
        if (i == 0) {
            finalString += '<span>' + queries[i] + '</span> ';
        } else {
            finalString += '<span> <b>' + decodeOperand(operands[i - 1]) + '</b> </span> ';
            if (queries[i].includes('!')) {
                let tempQuery = queries[i].replace('!', '');
                finalString += '<span class="NOT">' + tempQuery + '</span> ';
            }

            else
                finalString += '<span>' + queries[i] + '</span> ';
        }
    }

    return finalString;
}

const decodeOperand = (operand) => {
    if (operand == '&')
        return 'AND';
    else
        return 'OR'
}


const ResetAdvQueryIps = (div) => {
    mainInputCounter = 0;
    $('#' + div).html('<div class="d-flex mb-2" id="addAdvQueryDiv"><div class="d-flex" id="queryAdvUA"></div><div><button class="btn btn-neg smat-rounded mx-1 mt-2 " id="removeField" onclick="return false" style="display: none;"> <i class="fa fa-minus" aria-hidden="true"></i></button></div><div><button class="btn btn-primary smat-rounded mx-1 mt-2 " id="addQueryButton" onclick="return false" style="display: block;"><i class="fa fa-plus" aria-hidden="true"></i></button></div><div><p class="mb-0 mt-3 text-muted" id="addQueryHint" style="display: block;"> Click to add more queries </p></div></div>');
}


export const printUserListNoLoop = (element, div) => {
  
    let verified ='';
    try {
        if (element.verified) {
             verified = element.verified == 'True' ? '<span><img class="verifiedIcon" src="public/icons/smat-verified.png"/></span>' : '';
        }
        $('#' + div).append('<div class="row m-2"><span><img class="profilePicSmall" src="' + element['profile_image_url_https'] + '"  /> </span><span class="ml-1"><a class="authorName pt-1 m-0 font-weight-bold"   value="$' + element['author_id'] + '"  >' + element['author'] + '</a> ' + verified + '<p class="smat-dash-title pull-text-top m-0 ">@' + element['author_screen_name'] + '</p></span></div>')
    } catch {
        console.log('err');
    }
}

export const checkRecords = () =>{
    let advCount=0,normalCount=0;
    Object.keys(searchRecords).forEach(function(key) {
        if(searchRecords[key][0]['searchType']==1)
        advCount+=1;
        else if(searchRecords[key][0]['searchType']==0)
        normalCount+=1
    }); 
    if(advCount==0){
        displayErrorMsg('tableInitialTitleAdv','normal','No recent advance searches found in records.',false);
    }
    if(normalCount==0){
        displayErrorMsg('tableInitialTitle','normal','No recent normal searches found in records.',false);
    }
}


const openSpecificTab = (tabID,tabClass) => {
    //This function expects a tab class to be provided in its neighbourhod tabs
    $('.recentSearchTab a').removeClass('active');
    $('.'+tabClass+'Content').removeClass('active');
    $('.'+tabClass+'Content').removeClass('show');
    
    $('#'+tabID).addClass('active');
    let tab = $('#'+tabID).attr('href');
    $(tab).addClass('active')
    $(tab).addClass('show')

}