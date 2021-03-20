/*
Helper or API calls for smatConfigurations
witten by:
Amitabh Boruah
*/
//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};



export const getDatabaseEnvParameters = async () => {
    let response = await fetch('configure/getConfigurations', {
        method: 'post',
        headers: HeadersForApi
    })
    let data = await response.json();
    return data;
}

export const getCrawlerList = async (type) => {
    let dataArgs = JSON.stringify({
        type
    })
    let response = await fetch('configure/GetAllTrackToken', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}
export const addTrackToDb = async (id = null, trackToken, type, handle, status) => {

    let dataArgs = '';
    if (id) {
        dataArgs =JSON.stringify({
            id, trackToken, type, handle, status
        });
    } else {
        dataArgs =JSON.stringify({
             trackToken, type, handle, status
        });
    }
    let response = await fetch('configure/saveCrawlerInfo', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}

export const updateStatusToDB = async (id, status) => {
    let dataArgs = JSON.stringify({
        id,
        status,
        option: 'status'
    });
    let response = await fetch('configure/updateTrackWordStatus', {
        method: 'put',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}

export const updateTrackWordInDb = async (id, trackWord, handle) => {
    let dataArgs = JSON.stringify({
        id,
        trackWord,
        handle,
        option: 'trackWord'
    });
    let response = await fetch('configure/updateTrackWordStatus', {
        method: 'put',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}
export const deletefromCrawlList = async (id) => {
    let dataArgs = JSON.stringify({
        id
    });
    let response = await fetch('configure/deletefromCrawlList', {
        method: 'delete',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}
export const saveConfigInfoToDb = async (id = null, appUrl, dbUser, dbPass, dbNodes, dbKeyspace, dbPort, sparkEngine,defaultKeyspace) => {
    console.log(dbKeyspace);
    let dataArgs = {};
    if (id) {
        dataArgs = JSON.stringify({
            id, appUrl, dbUser, dbPass, dbNodes, dbKeyspace, dbPort, sparkEngine,defaultKeyspace
        });
    } else {
        dataArgs = JSON.stringify({
            appUrl, dbUser, dbPass, dbNodes, dbKeyspace, dbPort, sparkEngine,defaultKeyspace
        });
    }

    let response = await fetch('configure/save', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}