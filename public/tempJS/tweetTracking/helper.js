//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};


export const getTweetInfo = async (id) => {
    let response = await fetch('track/getTweetInfo', {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({
            id
        })
    });
    // console.log('ID',id);
    let data = await response.json()
    return data;
}


export const getFreqDataForTweets = async (id, from, to, type) => {
    let dataArgs = JSON.stringify({
        id, from, to, type
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
        id, from, to, type:'all'
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
            tweet_id_list_type: type
        });
    } else {
        dataArgs = JSON.stringify({
            sid: id,
            to,
            tweet_id_list_type: type
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
    let response = await fetch('LM/generate_tweet_network_', {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({id,dateArr,userID})
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




