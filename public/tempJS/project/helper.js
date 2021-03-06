/*jshint esversion: 6 */

//API Calls comes here for project
//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};

//Fetch Api calls
export const createProjectAPI = async (projectName, option, user_id, query, from_date, to_date, query_list, uniqueTimeStamp) => {
    let route = 'createKT'; //declare route here
    let response = await fetch(route, {
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            projectName, option, user_id, query, from_date, to_date, query_list, uniqueTimeStamp   //declare body to be parsed in server
        })
    });
    // return response; //return here
    let data = await response.json()
    console.log(data);
    return data;
};





//Fetch Api calls
export const insertToNewKeyspace = async (projectName, query, from_date, to_date, module_name, user_id, project_id) => {
    console.log('Insertion started : ', projectName);
    let route = 'insertKT'; //declare route here
    let response = await fetch(route, {
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            projectName, query, from_date, to_date, module_name, user_id, project_id   //declare body to be parsed in server
        })
    })
    // return response; //return here
    let data = await response.json()
    return data;

};




export const getAnalysisProject = async (userID) => {
    console.log(userID);
    let response = await fetch('showP/' + userID, {
        method: 'post',
        headers: HeadersForApi
    });
    let data = await response.json();
    return data;
};

export const checkIfAnyKeySpaceCreatingAPI = async (userID) => {
    let response = await fetch('checkIfAnyKeySpaceCreating/' + userID, {
        method: 'get',
        headers: HeadersForApi
    });
    let data = await response.json();
    return data;
}


export const getProjectName = async (project_id) => {

    let response = await fetch('getProjectName/' + project_id, {
        method: 'post',
        headers: HeadersForApi
    });
    let data = await response.json();
    return data;
};


export const getAllProject = async (userID) => {
    let response = await fetch('getAllProject/' + userID, {
        method: 'post',
        headers: HeadersForApi
    });
    let data = await response.json();
    return data;
};


export const checkIfAnyAnalysisStoreGoingOn = async (userID) => {
    let response = await fetch('checkIfAnyAnalysisStoreGoingOn/' + userID, {
        method: 'get',
        headers: HeadersForApi
    });
    let data = await response.json();
    return data;
}
export const setProjectNameOnClickOnSelect = (pname) => {
    let div1 = 'CP: <span style="color: #3490dc;">' + pname + '</span>';
    $("#selected_project_name_id").html(div1);
};




export const deleteProjectFromRecords = async (userID, projectID) => {
    let response = await fetch('deleteProjectFromRecords', {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({
            userID, projectID   //declare body to be parsed in server
        })
    });
    let data = await response.json();
    return data;
};


export const getAnalysisDetailsFromProjectActivitesAPI = async (userID, query) => {
    query = encodeURIComponent(query);
    let response = await fetch('getAnalysisDetails/' + userID + '/' + query, {
        method: 'get',
        headers: HeadersForApi
    });
    let data = await response.json();
    return data;
}





export const checkAnalysisExistorNot = async (full_query_id) => {
    let response = await fetch('checkAnalysisExistorNot/' + full_query_id, {
        method: 'get',
        headers: HeadersForApi
    });
    let data = await response.json();
    return data;
}

export const getRelatedSuggestions = async (query, from, to, limit) => {
    let response = await fetch('getRelatedWords', {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({
            query, from, to, limit //declare body to be parsed in server
        })
    });
    let data = await response.json();
    return data;
}

export const checkIfProjectExitsByName = async (name) => {
    let response = await fetch(`checkIfProjectExitsByName/${name}`, {
        method: 'get'
    });
    let data = await response.text();
    return data;
}



export const storeToProjectTable = async (projectName, user_id, project_id, project_description, from_date, to_date, seed_tokens) => {
    let route = 'storeToProjectTable'; //declare route here
    let response = await fetch(route, {
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            projectName, user_id, project_id, project_description, from_date, to_date, seed_tokens   //declare body to be parsed in server
        })
    });
    // return response; //return here
    let data = await response.json()
    return data;
};




export const getAnalysisForAProjectAPI = async (userID, projectID, module_name) => {
    let type = module_name;
    let response = await fetch('getAnalysisForUserUnderProject/' + userID + '/' + projectID + '/' + type, {
        method: 'get',
        headers: HeadersForApi
    });
    let data = await response.json();
    return data;
}



// export const getAnalysisForAProjectAPI = async (userID,projectID,type) => {
//     let response = await fetch('getAnalysisForUserUnderProject/' + userID + '/' + projectID + '/' + type, {
//         method: 'get',
//         headers: HeadersForApi
//     });
//     let data = await response.json();
//     return data;
// }


export const removeFromProjectActivityTable = async (full_query_id) => {
    let response = await fetch('deleteFromProjectActivityTable', {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({
            full_query_id   //declare body to be parsed in server
        })
    });
    let data = await response.json();
    return data;
};



export const storeToProjectActivityTable = async (user_id, project_id, analysis_name, from_date, to_date, module_name, full_query) => {
    let route = 'storeToProjectActivityTable'; //declare route here
    let response = await fetch(route, {
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            user_id, project_id, analysis_name, from_date, to_date, module_name, full_query //declare body to be parsed in server
        })
    });
    // return response; //return here
    let data = await response.json()
    return data;
};



export const getAllStoriesFromProject = async (projectID) => {
    let response = await fetch(`getStories/${projectID}`, {
        method: 'get',
    });
    let data = await response.json();
    return data;
}


export const getAllAnalysisUnderStory = async (storyID) => {
    let response = await fetch(`getAllAnalysisUnderStory/${storyID}`, {
        method: 'get',
    });
    let data = await response.json();
    return data;
}
export const getStoryInfo = async (storyID) => {
    let response = await fetch(`getStoryInfo/${storyID}`, {
        method: 'get',
    });
    let data = await response.json();
    return data;
}

export const getBaseURL = async () => {
    let response = await fetch(`getBaseUrl`, {
        method: 'get',
    });
    let data = await response.text();
    return data;
}


export const updateStoryAnalysis = async (id, name, desc) => {
    let route = 'updateStoryAnalysis'; //declare route here
    let response = await fetch(route, {
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            id, name, desc
        })
    });
    let data = await response.json()
    return data;
}

export const getPlotsFromServer = async (projectID, userID) => {
    let route = 'ReadPlotsFromDir'; //declare route here
    let response = await fetch(route, {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({
            projectID, userID
        })
    });
    let data = await response.json()
    return data;
}


export const uploadStoryToServer = async (projectID, StoryName,storyDescription ,StoryObj, userID ,key) => {
    let route = 'SaveStoryElementsJSON'; //declare route here
    let data = key!=='null' && key ? JSON.stringify({
        projectID, StoryName, StoryObj, userID,storyDescription ,key
    })  : 
    JSON.stringify({
        projectID, StoryName, StoryObj, userID,storyDescription
    })
    let response = await fetch(route, {
        method: 'post', //http method
        headers: HeadersForApi,
        body: data
    });
     response  = await response.json()
    return response;
}

export const getStoriesOfUserFromServer = async (projectID, userID) => {
    let route = 'readStories'; //declare route here
    let response = await fetch(route, {
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            projectID, userID
        })
    });
    let data = await response.json()
    return data;
}

export const getStoryObjFromServer = async (projectID, filename, userID) => {
    let route = 'getStoryData'; //declare route here
    let response = await fetch(route, {
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            projectID, filename, userID
        })
    });
    let data = await response.json()
    return data;
}


export const activateProjectAPI = async (projectName) => {
    let route = 'activateProject'; //declare route here
    let response = await fetch(route, {
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            projectName
        })
    });
    let data = await response.json()
    return data;
}



export const getAllTagsForSHOW = async (projectID, userID, type) => {
    let route = 'getAllTagsForSHOW'; //declare route here
    let response = await fetch(route, {
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            projectID, userID, type
        })
    });
    let data = await response.json();
    return data;
}


export const getTokenCountForProject = async (projectID, userID,type) => {
    let response = await fetch('readTokenCountProject',{
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            projectID, userID,type
        })
    });
    let data = await response.json();
    return data;
}


export const getTweetsForProject = async (projectID,userID,tweetType) =>{
    let response = await fetch('getTweetidListOrderByTweetTypeCount',{
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            projectID,userID,tweetType
        })
    });
    let data = await response.json();
    return data;
}


export const getTweetFrequencyData =  async (pname,from,to) =>{
    let response = await fetch('getProjectFrequencyDistributionData',{
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            pname,from,to
        })
    });
    let data = await response.json();
    return data;
}

export const getTweetSentimentData =  async (pname,from,to) =>{
    let response = await fetch('getProjectSentimentDistributionData',{
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            pname,from,to
        })
    });
    let data = await response.json();
    return data;
}

export const getLocationForProject =  async (projectID,userID) =>{
    let response = await fetch('getTweetIDListHavingLocation',{
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            projectID,userID
        })
    });
    let data = await response.json();
    return data;
}


export const getTweetsForFreq =  async (from,to,pname,filter_type) => {
    let response = await fetch('getTweetidListProject',{
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            from,to,pname,filter_type
        })
    });
    let data = await response.json();
    return data;
}