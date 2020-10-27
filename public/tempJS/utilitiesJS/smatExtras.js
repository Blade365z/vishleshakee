import { smatFeedbackMain } from './smatFeedback.js';
import { getTopDataHA } from '../historicalAnalysis/helper.js';
import { getCurrentDate } from '../utilitiesJS/smatDate.js';

export const makeSmatReady = () => {
    // $('body').on('click', 'div .closeGraph', function () {
    //     let graphCaptured = $(this).attr('value');
    //     $('.' + graphCaptured).remove();
    // });
    //For Feedback Please execute this function
    smatFeedbackMain();

}




export const makeSuggestionsReady = async (div, limit) => {
    let date = getCurrentDate(); //TODO::Take current day here
    let gloabalArr;
    var suggestionsArr = [];
    gloabalArr = await getTopDataHA(date, date, 'top_hashtag', limit).then(response => {
        response = response.data;
        for (const [key, value] of Object.entries(response)) {
            suggestionsArr.push(key);
        }
        return suggestionsArr;
    });
    // gloabalArr = await getTopDataHA(date, date, 'top_mention', limit).then(response => {
    makeDropDownReady(gloabalArr, div, 'suggestions');
    return gloabalArr;
}


export const makeDropDownReady = (array, div, name) => {
    // constructs the suggestion engine
    var suggestions = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        // `states` is an array of state names defined in "The Basics"
        local: array
    });
    let divTemp = '#' + div + '  ' + '.typeahead';
    $(divTemp).typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
        {
            name: name,
            source: suggestions
        });
}


export const getRelationType = (query, type) => {
    let relationType = '';
    if (query.includes('#')) {
        if (type == 'hashtag')
            relationType = 'Hashtag-Hashtag';
        else if (type == 'mention')
            relationType = 'Hashtag-Mention';
        else if (type == 'user')
            relationType = 'Hashtag-User';
    } else if (query.includes('@')) {
        if (type == 'hashtag')
            relationType = 'Mention-Hashtag';
        else if (type == 'mention')
            relationType = 'Mention-Mention';
        else if (type == 'user')
            relationType = 'Hashtag-User';
    } else if (query.includes('$')) {
        if (type == 'hashtag')
            relationType = 'User-Hashtag';
        else if (type == 'mention')
            relationType = 'User-Mention';
    }

    return relationType;
}


export const displayErrorMsg = (div, type, msg = null) => {
    if (type == 'error') {
        if(msg!=null){
            $('#' + div).html('<div class="alert-danger p-2 text-center smat-rounded smatMsg">' + msg + '</div>');
        }else{
            $('#' + div).html('<div class="alert-danger p-2 text-center smat-rounded smatMsg">Some error occured!</div>');
        }
      
    }
    else {
        $('#' + div).html('<div class="alert-success p-2 text-center smat-rounded smatMsg">' + msg + '</div>');
    }
    setTimeout(() => {
        $('.smatMsg').remove();
    }, 10000);
}


// const retriveRecordsFromIDB = () => {

//     var dbRetriveReq = window.indexedDB.open("UAsearchRec");
//     dbRetriveReq.onsuccess = function (event) {
//         db = dbRetriveReq.result;
//         retrive();
//     }
//     function retrive() {
//         db.transaction(userID).objectStore(userID).getAll().onsuccess = function (event) {
//             retrivedFromLocal = event.target.result;
//             $('#uaStatusTable').html('');
//             let counter = 0;
//             retrivedFromLocal.forEach(element => {
//                 let recordTemp = [{ 'query': element.query, 'from': element.fromDate, 'to': element.toDate, 'mentionUniqueID': element.mentionUniqueID, 'hashtagUniqueID': element.hashtagsUniqueID, 'searchType': 0, "filename": element.queryID }];
//                 searchRecords[element.queryID] = recordTemp

//                 getUserDetails(element['query']).then(data => {
//                     counter = counter + 1;
//                     $('#uaStatusTable').prepend('<tr id="row-' + counter + '"><td>@' + data.author_screen_name + '</td><td>' + element.fromDate + '</td><td>' + element.toDate + '</td><td id="' + element.queryID + 'Status">' + element.status + '</td><td><button class="btn btn-primary smat-rounded mx-1 showBtn" value="' + element.queryID + '" id="' + element.queryID + 'ShowBtn" > Show </button><button class="btn btn-danger mx-1  smat-rounded deleteBtn" value="' + element.queryID + '" id="' + element.queryID + 'DeleteBtn"  type="1"> Delete </button></td></tr>');
//                 });
//             });

//         }

//     }
//     console.log(searchRecords);
// }

// const cleanUpLocalDB = (arr = null, db, rowID = null) => {
//     var transaction = db.transaction([userID], "readwrite");
//     var objectStore = transaction.objectStore(userID);
//     let dbSize = 0;
//     dbSize = objectStore.count();
//     dbSize.onsuccess = function (event) {
//         console.log('DB SIZE :', event.target.result);
//         dbSize = event.target.result;
//         if (event.target.result > 4) {
//             $('#row-' + RowdeleteOffset).remove();
//             RowdeleteOffset += 1;

//             arr = arr.slice(1, retrivedFromLocal.length);
//             var objectStoreRequest = objectStore.clear();
//             objectStoreRequest.onsuccess = function (event) {

//             };
//             var objectStorePrev = transaction.objectStore(userID);
//             for (let i = 0; i <= arr.length - 1; i++) {
//                 var objectStorePrevRequest = objectStorePrev.add(arr[i]);
//                 objectStorePrevRequest.onsuccess = function (event) {

//                 };
//             }
//         }
//     }

// }

