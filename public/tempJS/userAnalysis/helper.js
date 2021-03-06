/*
The Script contains all the http API targets for User Analysis(Authenticated) of the Social Media Analysis tool 
developed at OSINT LAB , IIT-G

-----------------------------
IMPORTANT NOTE
-----------------------------
1.Use camelCase notations:)
2.PLEASE NOTE that the range types are :: 1. days , 2.hour , 3.10sec
3.Avoid using synchronous requests as XML-http-requests has been deprecated already.

Script written by : Mala Das (maladas601@gmail.com), Amitabh Boruah(amitabhyo@gmail.com)
*/

// import { isArray } from "lodash";






//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};


export const getSuggestionsForUA = (userIDArray) => {
    let userSuggestionRes;
    $.ajax({
        type: "GET",
        url: 'UA/getSuggestedUsers',
        contentType: "application/json",
        data: { userIDArray },
        dataType: "json",
        async: false,
        success: function (response) {
            userSuggestionRes = response;
        }
    });
    return userSuggestionRes;

}

//FETCH API Request for getting user details 
/*
Input----> UserID as string;
Output----> User Details (json)
*/
export const getUserDetails = async (idList) => {
    let data = isArray(idList) ? JSON.stringify({
        userIDList : idList
    }) : JSON.stringify({
        userID:idList
    })
    let response = await fetch('UA/getUserDetailsTemp', {
        method: 'post',
        headers: HeadersForApi,
        body: data
    });
    response= await response.json()
    return response;
}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
//FETCH API Request for Frequency Distribution data 
/*
Input----> IF(Day,Hour):query,fromDate,toDate,rangeType ELSE : Time 
Output----> Freq. Data(json)
*/
export const getFreqDistDataForUA = async (query, from, to, toTime = null, rangeType, isDateTimeAlready = 0, pname=null) => {
    let dataArg;
    if (toTime) {
        dataArg = JSON.stringify({ query, toTime, rangeType, isDateTimeAlready, pname });
    } else {
        dataArg = JSON.stringify({ query, from, to, rangeType, isDateTimeAlready, pname });
    }
    // console.log(dataArg);
    let response = await fetch('UA/getFrequencyDataForUser', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArg
    });
    let data = await response.json()

    return data;

}



export const getSentiDistDataForUA = async (query, from, to, toTime = null, rangeType, isDateTimeAlready = 0, pname=null) => {
    let dataArg;
    if (toTime) {
        dataArg = JSON.stringify({ query, toTime, rangeType, isDateTimeAlready, pname });
    } else {
        dataArg = JSON.stringify({ query, from, to, rangeType, isDateTimeAlready, pname });
    }
    let response = await fetch('UA/getSentimentDataForUser', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArg
    });
    let data = await response.json()

    return data;

}
export const getTweetIDsForUA = async (query, from = null, to = null, rangeType, filter = null, isDateTimeAlready = 0, pname=null) => {
    let dataArgs;
    if (from != null && to != null && isDateTimeAlready == 0) {
        dataArgs = JSON.stringify({ from, to, query, rangeType, filter, isDateTimeAlready, pname });
    } else if (isDateTimeAlready == 1) {
        dataArgs = JSON.stringify({ from, to, query, rangeType, filter, isDateTimeAlready, pname });
    }
    let response = await fetch('UA/getTweetIDs', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}
export const getCooccurDataForUA = async (query, from, to, option, uniqueID, userID, pname=null) => {
    //TODO::REMOVE THE HARDCODE!!
    let dataArrayTemp=[],noOfNodes=0;
    let dataArgs = JSON.stringify({
        query, from, to, option, uniqueID, userID, mode: 'write', pname
    });
    let dataArgsForRead = JSON.stringify({
        option, uniqueID, userID, limit: 50, mode: 'read'
    });
    let response = await fetch('UA/getCooccurDataForUser', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    if (data.status == "success") {
        noOfNodes = data['nodes'];
        let readResponse = await fetch('UA/getCooccurDataForUser', {
            method: 'post',
            headers: HeadersForApi,
            body: dataArgsForRead
        })
        let readData = await readResponse.json();
        dataArrayTemp.push({ 'data': readData, 'nodes': noOfNodes});
        // console.log(dataArrayTemp)
        return dataArrayTemp;
    }
} 


export const addNormalSearchToDB  = async (queryID,userID,query,fromDate,toDate,status,module_type,hashtagID,mentionID) => {
    let dataArgs=JSON.stringify({
        queryID,userID,query,fromDate,toDate,status,module_type,hashtagID,mentionID
    });

    let response = await fetch('normalStatus', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    });
    let data = await response.json()
    if(data.message){
        console.log(data.message);
    }    
}




export const populateRecentSearches = async( userID,type,mode) => {
    let response = await fetch('normalStatus/'+userID, {
        method: 'post',
        headers: HeadersForApi,
        body:JSON.stringify({
            type,mode
        })
    });
    let data = await response.json()
    if(data.message){
        console.log(data.message);
    }else{
        return data;
    } 
}


export const getUsersFromCrawlerList = async() =>{
    let response =  await fetch('UA/getUsersFromCrawlerList', {
        method: 'get',
        headers: HeadersForApi,
    });
    let data = await response.json()
    return data;
}