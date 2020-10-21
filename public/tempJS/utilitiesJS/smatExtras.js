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
        $('#' + div).html('<div class="alert-danger p-1 text-center smat-rounded smatMsg">Some error occured!</div>');
    }
    else {
        $('#' + div).html('<div class="alert-success p-1 text-center smat-rounded smatMsg">' + msg + '</div>');
    }
    setTimeout(() => {
        $('.smatMsg').remove();
    }, 3000);
}


export const indexedDBStoreForSearch = (dbName,objName) => {
    var db;

    var request = indexedDB.open(dbName, 3);
    request.onerror = function (event) {
        console.log("There is some Error in Local DB (Indexed DB)");
    };
    request.onsuccess = function (event) {
        db = event.target.result;
        db.createObjectStrore(objName);
        console.log("success: " + db);
    };
 
   
}
export const addSearchToLocalDB = (dbName, ObjName, id, user, queryArg, from, to, statusArg, typeArg) => {
    const request = window.indexedDB.open(dbName,3);
    console.log("adding")
    request.onupgradeneeded = () => {
        let db = request.result;S
        let store = db.createObjectStore(ObjName, { keyPath: "userID" });

        store.put({ queryID: id, userID: user, query: queryArg, fromDate: from, toDate: to, status: statusArg, type: typeArg })
    }
    request.onsuccess = function (event) {
        if(request.readyState=="done"){
            console.log('done');
        }
    };
}

export const readSearchFromLocalDB = (db,Obj,userID)  => {
    var request = indexedDB.open(db);
    request.onerror = function (event) {
        alert("Unable to retrieve daa from database!");
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        db.transaction(Obj).objectStore(Obj).get(userID).onsuccess = function (event) {
            console.log(event.target.result);
        };
    };
}