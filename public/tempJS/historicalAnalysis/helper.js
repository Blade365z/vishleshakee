/*
The Script contains all the http API targets for Historical Analysis(Authenticated) of the Social Media Analysis tool 
developed at OSINT LAB , IIT-G

-----------------------------
IMPORTANT NOTE
-----------------------------
1.Use camelCase notations:)
2.PLEASE NOTE that the range types are :: 1. day , 2.hour , 3.10sec
3.Avoid using synchronous requests as XML-http-requests has been deprecated already.

Script written by : Mala Das (maladas601@gmail.com), Amitabh Boruah(amitabhyo@gmail.com)
*/






//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};



export const getFreqDistDataForHA = async (query, from, to, toTime = null, rangeType, isDateTimeAlready = 0, pname=null) => {
    let dataArg;
    if (toTime) {
        dataArg = JSON.stringify({ query, toTime, rangeType, isDateTimeAlready,pname });
    } else {
        dataArg = JSON.stringify({ query, from, to, rangeType, isDateTimeAlready,pname });
    }
    let response = await fetch('HA/getFrequencyDataForHistorical', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArg
    }); 
    let data = await response.json()

    return data;
}



export const getTweetIDsForHA = async (query, from = null, to = null, rangeType, filter = null, isDateTimeAlready = 0, pname=null) => {
    let dataArgs;
    if (from != null && to != null && isDateTimeAlready == 0) {
        dataArgs = JSON.stringify({ from, to, query, rangeType, filter, isDateTimeAlready, pname});
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



export const getSentiDistDataForHA = async (query, from, to, toTime = null, rangeType, isDateTimeAlready = 0, pname=null) => {
    let dataArg;
    if (toTime) {
        dataArg = JSON.stringify({ query, toTime, rangeType, isDateTimeAlready, pname });
    } else {
        dataArg = JSON.stringify({ query, from, to, rangeType, isDateTimeAlready, pname });
    }
    let response = await fetch('HA/getSentimentDataForHistorical', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArg
    });
    let data = await response.json()

    return data;
}



export const getCooccurDataForHA = async (query, from, to, option, uniqueID, userID, pname=null) => {
   let dataArgs = JSON.stringify({
        query, from, to, option, uniqueID, userID, mode:'write', pname
    });
    let dataArrayTemp = [];
    let noOfNodes = 0;
    
    let dataArgsForRead=JSON.stringify({
        option, uniqueID, userID,limit:50,mode:'read'
    });
    // console.log(dataArgs)
    let response = await fetch('HA/getCooccurDataForHA', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
  
    let data = await response.json();
    if (data.status == "success") {
        noOfNodes = data['nodes'];
        let readResponse = await fetch('HA/getCooccurDataForHA', {
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



export const getTopDataHA = async (from, to, option, limit, pname=null) => {
    let dataArgs = JSON.stringify({
        from, to, option, limit, pname
    });
         let response = await fetch('TA/getTopTrending', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}

export const getQueryStatues = async (userID, mode) => {
    let response = await fetch('status/'+userID, {
        method: 'post',
        headers: HeadersForApi,
        body:JSON.stringify({
            mode
        })
    }) 
    let data = await response.json();
    return data;
}

export const removeFromStatusTable = async(id) => {
    let response = await fetch('status/'+id, {
        method: 'delete'
    })
}

export const removeFromStatusTableNormal = async(id)=>{
    let response = await fetch('normalStatus/'+id, {
        method: 'delete'
    })
                   
}