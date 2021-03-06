var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};


export const get_current_time = (time) =>{
    var from_to_datetime;
    $.ajax({
        type: "GET",
        url: 'LM/getTime',
        data : {interval: time},
        async: false,
        success: function (response) {
            from_to_datetime = response;
            

                
        }
    });
    return from_to_datetime;
}


export const tweetChunkInfo = async (tweetid_list_array,pname) => {
    let dataArg;
    dataArg = JSON.stringify({ tweetid_list_array,pname });

    let response = await fetch('LM/tweet_info', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArg
    });

    let data = await response.json();
    // return data;
    return new Promise((resolve, reject)=>{
        resolve(data);
    });
}

export const findLocation = async (location) => {
    let dataArg;
    dataArg = JSON.stringify({ location });

    let response = await fetch('LM/getcityState', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArg
    });

    let data = await response.json();
    return data;
}

export const AllLocationNames = async () => {
    let dataArg;
    dataArg = JSON.stringify({});

    let response = await fetch('LM/getLocationNames', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArg
    });

    let data = await response.json();
    return data;
}

export const checkLocation = async (place) => {
    let dataArg;
    dataArg = JSON.stringify({ place });

    let response = await fetch('LM/checkLocation', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArg
    });

    let data = await response.json();
    return data;
}


export const getTweetIdList = async (from,to,query,option,pname=null) => {
    let dataArg;
    dataArg = JSON.stringify({ from, to, query, option,pname });

    let response = await fetch('LM/getTweetId', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArg
    });

    let data = await response.json();
    return data;
    
}

export const getHashtag = async (from,to,query,type) => {
    let dataArg;
    var hashtagInfo;
    dataArg = JSON.stringify({ from, to, query,type });

    let response = await fetch('LM/getHashtag', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArg
    });

    let data = await response.json();
    return data;    
}

export const getTopHashtag = async (from,to,query,type) => {
    let dataArg;
    var hashtagInfo;
    dataArg = JSON.stringify({ from, to, query,type });

    let response = await fetch('LM/getTopHashtag', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArg
    });

    let data = await response.json();
    
    return data;
}