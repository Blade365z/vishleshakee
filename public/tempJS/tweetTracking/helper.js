//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};

// for project
import { checkIfAnyProjectActive, getProjectDetailsFromLocalStorage, madeFullQuery } from '../project/commonFunctionsProject.js';
var projectDetails;//for project
var pname=null, proj_id=null;


// check if any project is active
if (checkIfAnyProjectActive()){
    // if yes
    projectDetails = getProjectDetailsFromLocalStorage();
    console.log(projectDetails);
    pname = projectDetails.projectMetaData.project_name;
    proj_id = projectDetails.projectMetaData.project_id;
    console.log(pname, proj_id);
}else{
    pname=null;
    proj_id=null;
}





export const getTweetInfo = async (id) => {
    let response = await fetch('track/getTweetInfo', {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({
            id, pname
        })
    });
    // console.log('ID',id);
    let data = await response.json()
    return data;
}


export const getFreqDataForTweets = async (id, from, to, type) => {
    let dataArgs = JSON.stringify({
        id, from, to, type, pname
    })
    // console.log(dataArgs);
    let response = await fetch('track/getFrequencyDistributionTweet', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    });
    let data = await response.json()
    return data;
}

export const getDatesDist = async (id, from, to, type) => {
    let dataArgs = JSON.stringify({
        id, from, to, type:'all', pname
    })
    // console.log(dataArgs);
    let response = await fetch('track/getDatesDist', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    });
    let data = await response.json()
    return data;
}

export const getTweetsForSource = async (id, to, from = null, type) => {
    let dataArgs = '';
    if (from) {
        dataArgs = JSON.stringify({
            sid: id,
            to, from,
            tweet_id_list_type: type,
            pname
        });
    } else {
        dataArgs = JSON.stringify({
            sid: id,
            to,
            tweet_id_list_type: type,
            pname
        });
    }
    // console.log(dataArgs)
    let response = await fetch('track/getTweetIDsForSource', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    });
    let data = await response.json()
    return data.data;
}


export const getTweetsPlotDataForMap = async (arr) => {
    let response = await fetch('LM/tweet_info_for_tracking', {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({arr})
    });
    let data = await response.json()
    return data;
}


export const getNetworkForSource = async (userID,id,dateArr) => {
    let response = await fetch('track/generate_tweet_network_', {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({id,dateArr,userID, pname})
    });
    let data = await response.text();
    //TODO :: check if success 
    let readResponse = await fetch('na/graph_view_data_formator', {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({dir_name:userID,input:id})
    });
    data = await readResponse.json();
    return data;
    //TODO::hit another rote;
}