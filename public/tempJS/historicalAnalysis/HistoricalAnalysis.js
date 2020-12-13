/*jshint esversion: 6 */
//imports 

import { get_tweet_location, getCompleteMap } from '../utilitiesJS/getMap.js';
import { getFreqDistDataForHA, getTweetIDsForHA, getSentiDistDataForHA, getCooccurDataForHA, getQueryStatues, removeFromStatusTable, removeFromStatusTableNormal } from './helper.js';
import { generateFreqDistBarChart, generateFrequencyLineChart, generateSentiDistBarChart, generateSentiDistLineChart, generateBarChartForCooccur } from './chartHelper.js';
import { getCurrentDate, getRangeType, dateProcessor } from '../utilitiesJS/smatDate.js';
import { TweetsGenerator } from '../utilitiesJS/TweetGenerator.js';
import { generateUniqueID } from '../utilitiesJS/uniqueIDGenerator.js';
import { makeSuggestionsReady, makeSmatReady, makeDropDownReady, getRelationType, displayErrorMsg, toShowSelectedProject } from '../utilitiesJS/smatExtras.js';
import { getDateRange } from '../utilitiesJS/smatDate.js';
import { requestToSpark, checkStatus, storeToMySqlAdvanceSearchData, getOuputFromSparkAndStoreAsJSON, getFreqDistDataForAdvanceHA, getSentiDistDataForAdvanceHA, getTweetIDsForAdvanceHA, getCooccurDataForAdvanceHA } from './Advancehelper.js';
import { forwardToNetworkAnalysis } from '../utilitiesJS/redirectionScripts.js';
import { addNormalSearchToDB, populateRecentSearches } from '../userAnalysis/helper.js';



//Global variable definitions 
var mainInputCounter = 0, statusTableFlag = 0, searchType = 0;
var searchRecords = [];
// just for testing...............
// searchRecords[1113] =  [{ 'query': '(#Corona|#Coronavirus)', 'from': '2020-09-11', 'to': '2020-09-13', 'mentionUniqueID': 1234, 'hashtagUniqueID': 3456, 'userUniqueID': 7891, 'searchType': 'advance' }];
// .....................................................end
var fromDate = getCurrentDate(), toDate = getCurrentDate(), query = '';
let hashtagSuggestion = [];
//0:Normal, 1:AdvancedSearch
var mentionUniqueID = '', hashtagUniqueID = '', userUniqueID = '', userID;
if (localStorage.getItem('smat.me')) {
    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    userID = userInfoTemp['id'];
} else {
    window.location.href = 'login';
}

var suggestionsGlobal, suggInputBoxBuffer = [];


// ready function
jQuery(function () {
    console.log(localStorage.getItem('projectName'));
    // to show project selected................................
    toShowSelectedProject();
    // ........................................................
    
    
    $('[data-toggle="popover"]').popover(); //Initalizing popovers
    makeSmatReady();
    fromDate = getCurrentDate()
    toDate = dateProcessor(toDate, '-', 0);
    populateRecentSearches(userID, 0, 'ha').then(response => {
        if (response.length < 1) {
            displayErrorMsg('tableInitialTitle', 'normal', 'No recent normal searches found in records.', false);
        }
        response.forEach(element => {
            updateStatusTable(element.query, element.fromDate, element.toDate, 0, true, element.queryID, false);
        });
    });
    // get past advance searches from MySQL Table......... 
    getQueryStatues(userID, 'ha').then(response => {
        if (response.length < 1) {
            displayErrorMsg('tableInitialTitleAdv', 'normal', 'No recent advance searches found in records.', false);
        }
        if (response) {
            statusTableFlag = 1;
            $('#showTableBtn span').text(" Hide Search History ");
            $('#searchTable').css('display', 'block');
            console.log("helooooooo");
            console.log(response);
            response.forEach(element => {
                updateStatusTable(element.query, element.fromDate, element.toDate, 1, true, element.queryID)

                addToStatusTable(element.queryID, element.query, element.fromDate, element.toDate, element.queryID, true, element.status);
            });
        }

        //pass redirect queries only after having the past advance searches from mysql
        if (incoming) {

            if (incoming.includes('&') || incoming.includes('|')) {
                searchType = 1;
                setTimeout(() => {
                    openSpecificTab('advQueryTab', 'recentSearchTab'); 
                }, 200);
         
            } else {
                searchType = 0;
                setTimeout(() => {
                    openSpecificTab('normalQueryTab', 'recentSearchTab');
                }, 200);
               
            }
            
            updateStatusTable(incoming, fromDateReceived, toDateReceived, searchType, false, null, true);

        }
    })
    // /haQueryInputBox
    let getStatusFromMySqlInterval = setInterval(function () { getStatusFromMySql(userID, getStatusFromMySqlInterval); }, 10000);


    $("#fromDateHA").val(fromDate);
    $("#toDateHA").val(fromDate);
    $('#querySugg').html('<div class="text-center pt-5 mt-5" ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
    makeSuggestionsReady('haQueryInputBox', 50).then(response => {
        suggestionsGlobal = response;

        showSuggestions(suggestionsGlobal, 'querySugg');
        if (suggInputBoxBuffer.length > 0) {
            suggInputBoxBuffer.forEach(element => {
                makeDropDownReady(response, 'input-' + element, 'suggestion');
            });

        }else{
            displayErrorMsg('querySugg','error','No Trending data',false);
        }

    });


    mainInputCounter = 0;
    statusTableFlag = 0;
    searchType = 0;
    $('.nav-item ').removeClass('smat-nav-active');
    $('#nav-HA').addClass('smat-nav-active');


    $('body').on('click', 'div .closeGraph', function () {
        let valueCapt = $(this).attr('value');
        $('.' + valueCapt).remove();
    });


    $('#helpBtnHA').on('click', function () {
        $('#haHelpModal').modal('show');
    });


    // *********** ADD btn
    $('#addQueryButton').on('click', function () {
        mainInputCounter += 1;
        if (mainInputCounter > 0) //each input will increase mainInputCounter
            searchType = 1; //if more than ine input is available, thn it is advance search
        $('#removeField').css('display', 'block');
        if (mainInputCounter == 1) {
            $('#queryInputDiv').append('<div id="fieldID' + mainInputCounter + '" ><div class=" form-group  d-flex"><div class="" value="' + mainInputCounter + '"><select class=" smat-select btn HA-operand-select mx-2" id="operandID' + mainInputCounter + '" ><option value="&">AND</option><option class="or-option"  value="|">OR</option></select></div><div class=" border smat-rounded px-2 py-1 bg-white w-100 d-flex"  id="input-' + mainInputCounter + '"><input type="text" class="form-control  typeahead  smat-ha-Input " id="queryID' + mainInputCounter + '" placeholder="Query"  autocomplete="OFF"  required></div></div></div>');
            !suggestionsGlobal ? suggInputBoxBuffer.push(mainInputCounter) : makeDropDownReady(suggestionsGlobal, 'input-' + mainInputCounter, 'suggestion');

        } else {
            // not operation enabled
            $('#queryInputDiv').append('<div id="fieldID' + mainInputCounter + '" ><div class=" form-group  d-flex"><div class="" value="' + mainInputCounter + '"><select class=" smat-select btn HA-operand-select mx-2" id="operandID' + mainInputCounter + '" ><option value="&">AND</option><option class="or-option"  value="|">OR</option></select></div><div class=" border smat-rounded px-2 py-1 bg-white w-100 d-flex" id="input-' + mainInputCounter + '" ><input  type="checkbox" value="" name="NOT" id="notID' + mainInputCounter + '" title="NOT" value="option2" style="margin-top:13px;"><input type="text" class="form-control   typeahead smat-ha-Input " id="queryID' + mainInputCounter + '" placeholder="Query"  autocomplete="OFF" required></div></div></div>');
            !suggestionsGlobal ? suggInputBoxBuffer.push(mainInputCounter) : makeDropDownReady(suggestionsGlobal, 'input-' + mainInputCounter, 'suggestion');

        }
        if (mainInputCounter === 3) {
            $('#addQueryButton').css('display', 'none');
        }
    });


    // *********** When OR selected hide NOT operation
    // $('body').on('change', 'div .HA-operand-select', function () {
    //     let operandTemp = $(this).val();
    //     let idTemp = $(this).parent().attr('value');
    //     $('#notID' + idTemp).prop('checked', false); // Unchecks it
    //     if (operandTemp === '+') {
    //         $('#notID' + idTemp).css('display', 'none');
    //     } else {
    //         $('#notID' + idTemp).css('display', 'block');
    //     }
    // })



    // *********** Remove btn
    $('#removeField').on('click', function () {
        $('#fieldID' + mainInputCounter).remove();
        mainInputCounter -= 1;
        if (mainInputCounter < 1) {
            $('#removeField').css('display', 'none');
            searchType = 0;
        }
        if ($('#addQueryButton').is(":hidden") && mainInputCounter < 3) {
            $('#addQueryButton').css('display', 'block');
        }
    });



    $('body').on('click', 'div .analyzeNetworkButton', function () {
        let args = $(this).attr('value');
        args = args.split(/[?]/).filter(Boolean);
        forwardToNetworkAnalysis(args);
    })


    // *********** Submit btn
    $('#haQueryInputs').on('submit', function (event) {
        event.preventDefault();
        let q = $('#queryToken').val();
        statusTableFlag = 1;
        $('#searchTable').css('display', 'block');
        $('#analysisPanelHA').css('display', 'none');
        let fromDate = $('#fromDateHA').val();
        let toDate = $('#toDateHA').val();
        if (mainInputCounter > 0) {
            for (let i = 0; i <= mainInputCounter; i++) {
                if (i != 0) {
                    let qTemp = '(' + q;
                    let queryInput = $('#queryID' + i).val();
                    if (i > 1) {
                        if (document.getElementById('notID' + i).checked) {
                            queryInput = '!' + queryInput;
                        }
                    }
                    let operandInput = $('#operandID' + i).val();
                    qTemp = qTemp + operandInput + queryInput + ')';
                    q = qTemp;
                }
            }
        }
        // console.log(searchType);
        updateStatusTable(q, fromDate, toDate, searchType);
        resetQueryPanel(mainInputCounter);
    });



    // *********** Show Search History
    $('#showTableBtn').on('click', function () {
        if (statusTableFlag === 0) {
            $('#showTableBtn span').text(" Hide Search History ");
            $('#searchTable').css('display', 'block');
            statusTableFlag = 1;
        }
        else {
            $('#showTableBtn span').text(" Show Search History ");
            $('#searchTable').css('display', 'none');
            statusTableFlag = 0;
        }
    });




    $('#frqTabHA').on('click', function () {
    });



    $('#sentiTabHA').on('click', function () {
    });




    $('#mentionsTabHA').on('click', function () {
    });



    $('#locationTabHA').on('click', function () {
        $('#locationContentHA').html(`<div id="result-div-map" style="height:400px;"></div>
                                        <div class="modal_lm">
                                            <div class="modal-content">
                                                <span class="close-button">&times;</span>
                                                <ul id="markersList"></ul>
                                            </div>
                                        </div>`);
        let rangeType = getRangeType(fromDate, toDate);

        get_tweet_location(query, fromDate, toDate, rangeType, null).then(response => {
            getCompleteMap('result-div-map', response);
        });

    });



    //TweetFiter
    $('body').on('click', 'div .filterTweets', function () {
        let args = $(this).attr('value');
        args = args.split(/[|]/).filter(Boolean);

        if (args[4] === 'hour' || args[4] === 'day') {
            getTweetIDsForHA(query, args[1], args[2], args[4], args[0]).then(response => {
                TweetsGenerator(response.data, 6, args[3], args[1], args[2], true, args[4]);
            });
        } else if (args[4] === '10sec') {
            getTweetIDsForHA(query, args[1], args[2], args[4], args[0], 1).then(response => {
                TweetsGenerator(response.data, 6, args[3], args[1], args[2], true, args[4]);
            });
        }
    });



    $('body').on('click', 'div .username', function () {
        let queryCaptured = '$' + $(this).attr('value');
        queryCaptured = encodeURIComponent(queryCaptured);
        let fromTemp = encodeURIComponent(fromDate);
        let toDateTemp = encodeURIComponent(toDate);
        let redirectURL = 'userAnalysis' + '?query=' + queryCaptured + '&from=' + fromTemp + '&to=' + toDateTemp;
        window.open(redirectURL, '_blank');
    });



    //The Function below are specific to the query panel
    //TODO::Formulate these functions based on the searches
    $('body').on('click', '.showBtn', function () {
        $('#analysisPanelHA').css('display', 'block');
        let recordsCaptured = searchRecords[$(this).attr('value')];
        // console.log(recordsCaptured);
        if (recordsCaptured[0]['searchType'] == 1) {
            // for advance search................
            // console.log(recordsCaptured[0]['query']);
            initiateHistoricalAnalysisAdvance(recordsCaptured[0]['query'], recordsCaptured[0]['from'], recordsCaptured[0]['to'], recordsCaptured[0]['mentionUniqueID'], recordsCaptured[0]['hashtagUniqueID'], recordsCaptured[0]['userUniqueID'], recordsCaptured[0]['searchType'], recordsCaptured[0]['filename']);
        } else {
            // for normal search........................
            initiateHistoricalAnalysis(recordsCaptured[0]['query'], recordsCaptured[0]['from'], recordsCaptured[0]['to'], recordsCaptured[0]['mentionUniqueID'], recordsCaptured[0]['hashtagUniqueID'], recordsCaptured[0]['userUniqueID'], recordsCaptured[0]['searchType']);
        }
    });




    $('body').on('click', 'div .deleteBtn', function () {
        let type = $(this).attr('type');
        let idCaptured = $(this).attr('value');
        if (type == '0') {
            $(this).parent().parent().remove();
            removeFromStatusTableNormal(idCaptured);
        } else {
            removeFromStatusTable(idCaptured);
            $(this).parent().parent().remove();
            // deleteFromStatusTable(filename)
        }
        delete searchRecords[idCaptured];
        checkRecords();
    });


    $('body').on('click', 'div .saveAnalysisBtn', function () {
        // let type = $(this).attr('type');
        // let idCaptured = $(this).attr('value');
        // if (type == '0') {
        //     $(this).parent().parent().remove();
        // } else {
        //     //advance search
        // }
    });


    $('body').on('click', 'div .suggHashtags', function () {
        updateStatusTable($(this).text(), fromDate, toDate, 0, false, null, true);
    });

});
// ..................END of jquery ready function.......




















const getStatusFromMySql = (userID) => {	
    // get past advance searches from MySQL Table......... 
    getQueryStatues(userID, 'ha').then(response => {
        if (response.length < 1) {
            displayErrorMsg('tableInitialTitleAdv', 'normal', 'No recent advance searches found in records.', false);
        }
        if (response) {
            // statusTableFlag = 1;
            $('#haAdvStatusTable').empty();
            // console.log("helooooooo");
            // console.log(response);
            response.forEach(element => {
                updateStatusTable(element.query, element.fromDate, element.toDate, 1, true, element.queryID)

                addToStatusTable(element.queryID, element.query, element.fromDate, element.toDate, element.queryID, true, element.status);
            });
        }
    });
}


const updateStatusTable = (query, fromDate, toDate, searchType, fromStatusTable = false, filename = null, highlight = false) => {
    let uniqueTimeStamp = filename == null ? new Date().getTime() : filename;
    let queryElement = decodeQuery(query);
    mentionUniqueID = generateUniqueID();
    hashtagUniqueID = generateUniqueID();
    userUniqueID = generateUniqueID();
    let highlightTag = '';
    highlight === true ? highlightTag = 'alert-danger' : highlightTag;
    // console.log(highlightTag)
    //normal search ....add to Status Table
    if (searchType == 0) {
        // openSpecificTab('normalQueryTab', 'recentSearchTab');
        if (!filename) {
            addNormalSearchToDB(uniqueTimeStamp, userID, query, fromDate, toDate, 'Success', 'ha', hashtagUniqueID, mentionUniqueID);
        }
        $('#tableInitialTitle').html('');
        $('<tr class="statusTableRow ' + highlightTag + '"><td>' + queryElement + '</td><td>' + fromDate + '</td><td>' + toDate + '</td><td >Success</td><td><button class="btn btn-primary smat-rounded mx-1 showBtn" value="' + uniqueTimeStamp + '"> Show </button><button class="btn btn-danger mx-1  smat-rounded deleteBtn" type="0" value="' + uniqueTimeStamp + '"  > Delete </button></td></tr>').prependTo("#haNormalStatusTable");
        let recordTemp = [{ 'query': query, 'from': fromDate, 'to': toDate, 'mentionUniqueID': mentionUniqueID, 'hashtagUniqueID': hashtagUniqueID, 'userUniqueID': userUniqueID, 'searchType': searchType }];

        searchRecords[uniqueTimeStamp] = recordTemp;

        //advance search ....add to Status Table
    } else if (searchType == 1) {
        // openSpecificTab('advQueryTab', 'recentSearchTab');
        $('#tableInitialTitleAdv').html('');
        if (fromStatusTable) {
            let recordTemp = [{ 'query': query, 'from': fromDate, 'to': toDate, 'mentionUniqueID': mentionUniqueID, 'hashtagUniqueID': hashtagUniqueID, 'userUniqueID': userUniqueID, 'searchType': searchType, "filename": filename }];
            searchRecords[filename] = recordTemp;
        } else {
            let recordTemp = [{ 'query': query, 'from': fromDate, 'to': toDate, 'mentionUniqueID': mentionUniqueID, 'hashtagUniqueID': hashtagUniqueID, 'userUniqueID': userUniqueID, 'searchType': searchType, "filename": uniqueTimeStamp.toString() }];
            searchRecords[uniqueTimeStamp] = recordTemp;

            // 11 trigger to spark function
            console.log(query);
            triggerSparkRequest(query, fromDate, toDate, uniqueTimeStamp.toString());
        }
    }
    if (highlightTag) {
        setTimeout(() => {
            $('.statusTableRow').removeClass('alert-danger');
        }, 5000);
    }
}



const triggerSparkRequest = (query, fromDate, toDate, unique_name_timestamp, highlight = false) => {
    let queries = [query, fromDate, toDate];
    let query_list = get_tokens_wrt_pattern(queries); // get token
    // console.log(query_list);

    // 12 store to MySQl.....
    storeToMySqlAdvanceSearchData(userID, unique_name_timestamp, fromDate, toDate, query, "running...", 'ha').then(data => {
        // console.log(data);
    });

    // 13 request to spark.....
    requestToSpark(query_list, unique_name_timestamp).then(data => {
        console.log(data);
        let sparkID = data.id;
        // 14 add row to table UI.....
        addToStatusTable(sparkID, query, fromDate, toDate, unique_name_timestamp, highlight = false);
        // 15 check status until it becomes success.....
        checkSparkStatus(sparkID, unique_name_timestamp, fromDate, toDate, query); 
        // let checkSpartStatusInterval = setInterval(function () { checkSparkStatus(sparkID, unique_name_timestamp, fromDate, toDate, query, checkSpartStatusInterval); }, 10000);
    });
}




const checkSparkStatus = (sparkID, unique_name_timestamp, fromDate, toDate, query) => {
    checkStatus(sparkID, unique_name_timestamp, userID).then(data => {
        console.log(data);
        if (data.status === 'success') {
            // window.clearInterval(checkSpartStatusInterval);//clear the interval
            //16 enable Show btn....
            makeShowBtnReadyAfterSuccess(sparkID, unique_name_timestamp);
        } else if (data.status === 'dead') {
            // window.clearInterval(checkSpartStatusInterval);//clear the interval
            $('#' + sparkID + 'DeleteBtn').prop("disabled", false);
            $('#' + sparkID + 'Status').text('Dead');
        }
    });
}



const addToStatusTable = (sparkID, query, fromDate, toDate, unique_name_timestamp, fromStatusTable = false, query_status) => {
    let queryElement = decodeQuery(query);
    let disabledProperty = 'disabled';
    let status = 'Running...';

    fromStatusTable === true ? disabledProperty = '' : disabledProperty;
    // fromStatusTable === true ? status = 'Success' : status;
    if (fromStatusTable) {
        status = query_status;
    }
    // $('#haStatusTable').append('<tr><th scope="row">' + unique_name_timestamp + '</th><td>' + queryElement + '</td><td>' + fromDate + '</td><td>' + toDate + '</td><td id="' + sparkID + 'Status">' + status + '</td><td><button class="btn btn-primary smat-rounded mx-1 showBtn" value="' + unique_name_timestamp + '" id="' + sparkID + 'ShowBtn" ' + disabledProperty + '> Show </button><button class="btn btn-danger mx-1  smat-rounded deleteBtn" value="' + unique_name_timestamp + '" id="' + sparkID + 'DeleteBtn" ' + disabledProperty + '  type="1"> Delete </button></td></tr>');

    $('<tr><td>' + queryElement + '</td><td>' + fromDate + '</td><td>' + toDate + '</td><td id="' + sparkID + 'Status">' + status + '</td><td><button class="btn btn-primary smat-rounded mx-1 showBtn" value="' + unique_name_timestamp + '" id="' + sparkID + 'ShowBtn" ' + disabledProperty + '> Show </button><button class="btn btn-danger mx-1  smat-rounded deleteBtn" value="' + unique_name_timestamp + '" id="' + sparkID + 'DeleteBtn" ' + disabledProperty + '  type="1"> Delete </button></td></tr>').prependTo("#haAdvStatusTable");
}




const makeShowBtnReadyAfterSuccess = (sparkID, filename) => {
    $('#' + sparkID + 'ShowBtn').prop("disabled", false);
    $('#' + sparkID + 'DeleteBtn').prop("disabled", false);
    let btnValue = $('#' + sparkID + 'Btn').attr('value');
    // $('#' + sparkID + 'Btn').removeClass('btn-secondary');
    // $('#' + sparkID + 'Btn').addClass('btn-primary');
    $('#' + sparkID + 'Status').text('Success');
}




const resetQueryPanel = (counter) => {
    for (let i = 0; i <= counter; i++) {
        $('#fieldID' + i).remove();
    }
    $('#queryToken').val('');
    $('#fromDateHA').val('');
    $('#toDateHA').val('');
    $('#removeField').css('display', 'none');

    // mainInputCounter initialize to 0 again because it will restart again
    mainInputCounter = 0;
    searchType = 0;
}




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



const decodeQuery = (query) => {
    // let query = '#CAA&#Radio+!*protest';
    let queries = query.split(/[|&]+/g).filter(Boolean);
    let operands = query.match(/[|&]+/g);

    let counter = 0;
    let finalString = '';
    finalString = '<div>';
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


/*
-------------------------------------------------------------------------
            HISTORICAL ANALYSIS  MAIN LOGIC STARTS HERE 
------------------------------------------------------------------------
(Please use camelCase Notation :) )
*/



const initiateHistoricalAnalysis = (queryTemp, fromTemp, toTemp, mentionID, hashtagID, activeUserID, searchType) => {
    //  mentionUniqueID = generateUniqueID();
    query = queryTemp;
    fromDate = fromTemp;
    toDate = toTemp;
    $('#currentlySearchedQuery').text(query);
    $('#analysisPanelHA').css('display', 'block');
    let rangeType = getRangeType(fromDate, toDate);

    frequencyDistributionHA(query, rangeType, fromDate, toDate, null, 'freqContentHA', false);
    sentimentDistributionHA(query, rangeType, fromDate, toDate, null, 'sentiContentHA', false);
    plotDistributionGraphHA(query, fromDate, toDate, 'user', activeUserID, userID, 'usersContentHA');
    plotDistributionGraphHA(query, fromDate, toDate, 'mention', mentionID, userID, 'mentionsContentHA');
    plotDistributionGraphHA(query, fromDate, toDate, 'hashtag', hashtagID, userID, 'hashtagsContentTab');
}




const initiateHistoricalAnalysisAdvance = (queryTemp, fromTemp, toTemp, mentionID, hashtagID, activeUserID, searchType, filename) => {
    // console.log("initiate advance seach analysis");
    query = queryTemp;
    fromDate = fromTemp;
    toDate = toTemp;
    $('#currentlySearchedQuery').text(query);
    $('#analysisPanelHA').css('display', 'block');
    let rangeType = getRangeType(fromDate, toDate);
    frequencyDistributionHA(query, rangeType, fromDate, toDate, null, 'freqContentHA', false, filename);
    sentimentDistributionHA(query, rangeType, fromDate, toDate, null, 'sentiContentHA', false, filename);
    plotDistributionGraphHA(query, fromDate, toDate, 'user', activeUserID, userID, 'usersContentHA', filename);
    plotDistributionGraphHA(query, fromDate, toDate, 'mention', mentionID, userID, 'mentionsContentHA', filename);
    plotDistributionGraphHA(query, fromDate, toDate, 'hashtag', hashtagID, userID, 'hashtagsContentTab', filename);


    // query to spark
    //update the status  of table
    //check status frequently
    //when success, store to mysql and enable show and dlt btn
}




let freqParentDiv = 'freqContentHA';
export const frequencyDistributionHA = (query = null, rangeType, fromDate = null, toDate = null, toTime = null, div, appendArg = false, filename = null) => {
    let chartType = 'freq-chart';
    let appendedChartParentID = rangeType + '-' + chartType;
    $('.' + appendedChartParentID).remove();

    let chartDivID = div + '-' + rangeType + '-chart';
    let summaryDivID = div + '-' + rangeType + '-summary';
    let chartTweetDivID = div + rangeType + '-tweets';
    // class="' + rangeType + '-charts"
    // console.log(chartDivID);
    if (rangeType == 'hour') {
        $('.hour-' + chartType).remove();
        $('.10sec-' + chartType).remove();
    }
    if (appendArg) {
        $('#' + freqParentDiv).append('<div class=" mt-2   appendedChart ' + appendedChartParentID + '"   ><div class="d-flex"> <div class="mr-auto closeGraph"    value="' + rangeType + '-freq-chart" title="close" >close <i class="fas fa-times"></i> </div> </div> <div class="row"><div class="col-sm-8"><div class="haTab freqDistChart resultDiv-'+rangeType+' chartDiv border" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="freqDistTweets resultDiv-'+rangeType+' border" id="' + chartTweetDivID + '"></div><div class="freqDistSummary resultDiv-'+rangeType+' border d-flex pt-2"  id="' + summaryDivID + '" ></div></div></div></div>');
    } else {
        $('#' + div).html('<div><div class="row"><div class="col-sm-8"><div class="haTab freqDistChart resultDiv-'+rangeType+' chartDiv border" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="freqDistTweets resultDiv-'+rangeType+' border" id="' + chartTweetDivID + '"></div><div class="freqDistSummary resultDiv-'+rangeType+' border d-flex pt-2"  id="' + summaryDivID + '" ></div></div></div></div>');
    }
    //Loader...userID
    $('#' + chartDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
    $('#' + chartTweetDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
    if (rangeType == 'day') {
        if (filename) {
            getFreqDistDataForAdvanceHA(query, fromDate, toDate, rangeType, filename, userID).then(data => {
                generateFreqDistBarChart(query, data, rangeType, chartDivID, filename);
                freqSummaryGenerator(data, summaryDivID, rangeType);
            });

            getTweetIDsForAdvanceHA(query, fromDate, toDate, rangeType, null, filename, userID).then(response => {
                TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
            });
        } else {
            getFreqDistDataForHA(query, fromDate, toDate, null, rangeType, 0).then(data => {
                if (data.data.length < 1) {
                    $('.resultDiv-'+rangeType).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
                } else {
                    generateFreqDistBarChart(query, data, rangeType, chartDivID);
                    freqSummaryGenerator(data, summaryDivID, rangeType);
                    getTweetIDsForHA(query, fromDate, toDate, rangeType, null).then(response => {
                        TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
                    });
                }
            });

        }
    } else if (rangeType == 'hour') {
        if (filename) {
            getFreqDistDataForAdvanceHA(query, fromDate, toDate, rangeType, filename, userID).then(data => {
                generateFreqDistBarChart(query, data, rangeType, chartDivID, filename);
                freqSummaryGenerator(data, summaryDivID, rangeType);
            });

            getTweetIDsForAdvanceHA(query, fromDate, toDate, rangeType, null, filename, userID).then(response => {
                TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
            });
        } else {
            getFreqDistDataForHA(query, fromDate, toDate, null, rangeType, 0).then(data => {
                if (data.data.length < 1) {
                    $('.resultDiv-'+rangeType).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
                } else {
                    generateFreqDistBarChart(query, data, rangeType, chartDivID);
                    freqSummaryGenerator(data, summaryDivID, rangeType);
                    getTweetIDsForHA(query, fromDate, toDate, rangeType, null).then(response => {
                        TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
                    });
                }
            });

        }
    } else {
        if (filename) {
            getFreqDistDataForAdvanceHA(query, fromDate, toDate, rangeType, filename, userID).then(data => {
                generateFrequencyLineChart(query, data, rangeType, chartDivID, filename);
                freqSummaryGenerator(data, summaryDivID, rangeType);
            });

            getTweetIDsForAdvanceHA(query, fromDate, toDate, rangeType, null, filename, userID).then(response => {
                // console.log(rangeType);
                TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
            });
        } else {
            getFreqDistDataForHA(query, fromDate, toDate, null, rangeType, 1).then(data => {
                if (data.data.length < 1) {
                    $('.resultDiv-'+rangeType).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
                } else {
                    generateFrequencyLineChart(query, data, rangeType, chartDivID);
                    freqSummaryGenerator(data, summaryDivID, rangeType);
                    getTweetIDsForHA(query, fromDate, toDate, rangeType, null, 1).then(response => {
                        let fromDateTemp = fromDate.split(/[ ,]+/).filter(Boolean);
                        TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, fromDate, true, rangeType);
                    });
                }
            });
        }
    }

}



let sentiParentDiv = 'sentiContentHA';
export const sentimentDistributionHA = (query = null, rangeType, fromDate = null, toDate = null, toTime = null, div, appendArg = false, filename = null) => {
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
        $('#' + sentiParentDiv).append('<div class=" mt-2 ' + appendedChartParentID + '"><div class="d-flex"> <div class="mr-auto closeGraph"    value="' + rangeType + '-senti-chart" title="close" > close <i class="fas fa-times"></i> </div> </div> <div class="row"><div class="col-sm-8"><div class="uaTab sentiDistChart  resultDiv-'+rangeType+' chartDiv border" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="sentiDistTweets resultDiv-'+rangeType+' border" id="' + chartTweetDivID + '"></div><div class="sentiDistSummary resultDiv-'+rangeType+' border d-flex pt-2"  id="' + summaryDivID + '" ></div></div></div></div>');
    } else {
        $('#' + div).html('<div><div class="row"><div class="col-sm-8"><div class="uaTab sentiDistChart resultDiv-'+rangeType+' chartDiv border" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="sentiDistTweets resultDiv-'+rangeType+' border" id="' + chartTweetDivID + '"></div><div class="sentiDistSummary resultDiv-'+rangeType+' border d-flex pt-2"  id="' + summaryDivID + '" ></div></div></div></div>');
    }
    //Loader...
    $('#' + chartDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>');
    $('#' + chartTweetDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>');
    if (rangeType == 'day') {
        if (filename) {
            getSentiDistDataForAdvanceHA(query, fromDate, toDate, rangeType, filename, userID).then(data => {
                generateSentiDistBarChart(data, query, rangeType, chartDivID, filename);
                generateSentimentSummary(data, summaryDivID, rangeType);
            });

            getTweetIDsForAdvanceHA(query, fromDate, toDate, rangeType, null, filename, userID).then(response => {
                // console.log(rangeType);
                TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
            });
        } else {
            getSentiDistDataForHA(query, fromDate, toDate, null, rangeType, 0).then(data => {
                if (data.data.length < 1) {
                    $('.resultDiv-'+rangeType).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
                } else {
                    generateSentiDistBarChart(data, query, rangeType, chartDivID);
                    generateSentimentSummary(data, summaryDivID, rangeType);
                    getTweetIDsForHA(query, fromDate, toDate, rangeType, null).then(response => {
                        TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
                    });
                }
            });
        }

    } else if (rangeType == 'hour') {
        if (filename) {
            getSentiDistDataForAdvanceHA(query, fromDate, toDate, rangeType, filename, userID).then(data => {
                generateSentiDistBarChart(data, query, rangeType, chartDivID, filename);
                generateSentimentSummary(data, summaryDivID, rangeType);
            });

            getTweetIDsForAdvanceHA(query, fromDate, toDate, rangeType, null, filename, userID).then(response => {
                // console.log(rangeType);
                TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
            });
        } else {
            getSentiDistDataForHA(query, fromDate, toDate, null, rangeType, 0).then(data => {
                if (data.data.length < 1) {
                    $('.resultDiv-'+rangeType).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
                } else {
                    generateSentiDistBarChart(data, query, rangeType, chartDivID);
                    generateSentimentSummary(data, summaryDivID, rangeType);
                    getTweetIDsForHA(query, fromDate, toDate, rangeType, null).then(response => {
                        TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
                    });
                }
            });
        }
    } else {
        if (filename) {
            getSentiDistDataForAdvanceHA(query, fromDate, toDate, rangeType, filename, userID).then(data => {
                generateSentiDistLineChart(query, data, rangeType, chartDivID, filename);
                generateSentimentSummary(data, summaryDivID, rangeType);
            });

            getTweetIDsForAdvanceHA(query, fromDate, toDate, rangeType, null, filename, userID).then(response => {
                // console.log(rangeType);
                TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
            });
        } else {
            getSentiDistDataForHA(query, fromDate, toDate, null, rangeType, 1).then(data => {
                if (data.data.length < 1) {
                    $('.resultDiv-'+rangeType).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
                } else {
                    generateSentiDistLineChart(query, data, rangeType, chartDivID);
                    generateSentimentSummary(data, summaryDivID, rangeType);
                    getTweetIDsForHA(query, fromDate, toDate, rangeType, null, 1).then(response => {
                        let fromDateTemp = fromDate.split(/[ ,]+/).filter(Boolean);
                        TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, fromDate, true, rangeType);
                    });
                }
            });
        }
    }
}





const plotDistributionGraphHA = (query, fromDate, toDate, option, uniqueID, userID, div, filename = null) => {
    //Loader...
    let chartDivID = option + '-chart';
    $('#' + div).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>');

    // $('#' + div).html('<div class="d-flex " ><span class="ml-auto mr-3"><p class="m-0 smat-box-title-large font-weight-bold text-dark" id="' + option + '-total">0</p><p class="pull-text-top smat-dash-title m-0 ">Total Nodes</p></span><button class="btn btn-primary mt-1  mr-3 analyzeNetworkButton smat-rounded"   value="' + query + '|' + toDate + '|' + fromDate + '|' + option + '|' + uniqueID + '|' + userID + '" > <span> Analyse network </span> </button></div><div class="px-5 co_occur_plot" id="' + chartDivID + '"></div>');

    // $('#' + chartDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>');
    if (filename) {
        // console.log("generate advance");
        getCooccurDataForAdvanceHA(query, fromDate, toDate, option, uniqueID, userID, filename).then(response => {
            // console.log(response);
            $('#' + div).html('<div class="d-flex " ><span class="ml-auto mr-3"><p class="m-0 smat-box-title-large font-weight-bold text-dark" id="' + option + '-total">0</p><p class="pull-text-top smat-dash-title m-0 ">Total Nodes</p></span><button class="btn btn-primary mt-1  mr-3 analyzeNetworkButton smat-rounded"   value="' + query + '?' + toDate + '?' + fromDate + '?' + option + '?' + uniqueID + '?' + userID + '" > <span> Analyse network </span> </button></div><div class="px-5 co_occur_plot" id="' + chartDivID + '"></div>');
            response[0].nodes == 0 ? $('#' + div).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>') : generateBarChartForCooccur(query, response[0]['data'], chartDivID, option, fromDate, toDate);
            $('#' + option + '-total').text(response[0]['nodes']);
        });
    } else {
        getCooccurDataForHA(query, fromDate, toDate, option, uniqueID, userID).then(response => {
            // console.log(response);
            let relType = getRelationType(query, option);
            $('#' + div).html('<div class="d-flex " ><span class="ml-auto mr-3"><p class="m-0 smat-box-title-large font-weight-bold text-dark" id="' + option + '-total">0</p><p class="pull-text-top smat-dash-title m-0 ">Total Nodes</p></span><button class="btn btn-primary mt-1  mr-3  analyzeNetworkButton  smat-rounded"   value="' + query + '?' + toDate + '?' + fromDate + '?' + relType + '?' + uniqueID + '?' + userID + '" > <span> Analyse network </span> </button></div><div class="px-5 co_occur_plot" id="' + chartDivID + '"></div>');
            response[0].nodes == 0 ? $('#' + div).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>') : generateBarChartForCooccur(query, response[0]['data'], chartDivID, option, fromDate, toDate);
            $('#' + option + '-total').text(response[0]['nodes']);
        });
    }
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

const showSuggestions = (data, div) => {
    $('#' + div).html('');
    data.forEach(element => {
        $('#' + div).append('<button type="button" class="btn btn-light m-1 suggHashtags" ><p class="hashtags m-0">' + element + '</p></button>');
    });
}
export const checkRecords = () => {
    let advCount = 0, normalCount = 0;
    Object.keys(searchRecords).forEach(function (key) {
        if (searchRecords[key][0]['searchType'] == 1)
            advCount += 1;
        else if (searchRecords[key][0]['searchType'] == 0)
            normalCount += 1
    });
    if (advCount == 0) {
        displayErrorMsg('tableInitialTitleAdv', 'normal', 'No recent advance searches found in records.', false);
    }
    if (normalCount == 0) {
        displayErrorMsg('tableInitialTitle', 'normal', 'No recent normal searches found in records.', false);
    }
}

const openSpecificTab = (tabID, tabClass) => {
    //This function expects a tab class to be provided in its neighbourhod tabs
    $('.recentSearchTab a').removeClass('active');
    $('.' + tabClass + 'Content').removeClass('active');
    $('.' + tabClass + 'Content').removeClass('show');

    $('#' + tabID).addClass('active');
    let tab = $('#' + tabID).attr('href');
    $(tab).addClass('active')
    $(tab).addClass('show')

}
