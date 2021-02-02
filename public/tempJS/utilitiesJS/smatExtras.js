import { smatFeedbackMain } from './smatFeedback.js';
import { getTopDataHA } from '../historicalAnalysis/helper.js';
import { getCurrentDate } from '../utilitiesJS/smatDate.js';


//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};


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


export const displayErrorMsg = (div, type, msg = null,hideFlag=true) => {
    if (type == 'error') {
        if(msg!=null){
            $('#' + div).html('<div class="alert-danger p-2 text-center smat-rounded smatMsg ">' + msg + '</div>');
        }else{
            $('#' + div).html('<div class="alert-danger p-2 text-center smat-rounded smatMsg  ">Some error occured!</div>');
        }
      
    }else if(type=='normal'){
        $('#' + div).html('<div class="alert-info p-2 text-center smat-rounded smatMsg ">' + msg + '</div>');
    }
    else {
        $('#' + div).html('<div class="alert-success p-2 text-center smat-rounded smatMsg">' + msg + '</div>');
    }
    if(hideFlag){
        setTimeout(() => {
            $('.smatMsg').remove();
        }, 5000);
    }
}


export const getUserID = () => {
    let userID;
    if (localStorage.getItem('smat.me')) {
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        userID = userInfoTemp['id'];
    } else {
        window.location.href = 'login';
    }
    return userID;
}



export const getUserDetail = async () => {
    let response = await fetch('smat/getme', {
        method: 'get'
    });
    let data = await response.json()
    return data;
}




export const actionLog = async (user_id, action_msg) => {
    console.log(user_id);
    let response = await fetch('log', {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({
            user_id, action_msg
        })
    });
    let data = await response.json()
    return data;
}


export const makeAddToStoryDiv = (div,toAppendBtnInsomeOtherDiv=null) => {
    let toBeCapturedDiv=div;
    let whereToAppendDiv=div
    if(toAppendBtnInsomeOtherDiv){
        whereToAppendDiv=toAppendBtnInsomeOtherDiv
    }
    let uid=whereToAppendDiv+'-'+'-addToStoryBtn';
$('#'+uid).remove();
    $('#'+whereToAppendDiv).after('<div class="clickable font-weight-bold mt-2  addToStory mb-3" value="'+toBeCapturedDiv+'" id="'+uid+'"> <i class="fas fa-bookmark mr-1"></i> Add to story</div>')
}