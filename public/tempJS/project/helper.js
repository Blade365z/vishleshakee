/*jshint esversion: 6 */
//API Calls comes here for project

//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};

//Fetch Api calls
export const createProjectAPI = async (projectName, user_id, project_id)=>{
    console.log('New project created : ' , projectName);
    let route='createKT'; //declare route here
    let response = await fetch(route, {
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            projectName, user_id, project_id   //declare body to be parsed in server
        })
    });
    // return response; //return here
    let data = await response.json()
    console.log(data);
    return data;
};


//Fetch Api calls
export const insertToNewKeyspace = async (projectName, query, from_date, to_date,  module_name, user_id, project_id)=>{
    console.log('Insertion started : ' , projectName);
    let route='insertKT'; //declare route here
    let response = await fetch(route, {
        method: 'post', //http method
        headers: HeadersForApi,
        body: JSON.stringify({
            projectName, query, from_date, to_date,  module_name, user_id, project_id   //declare body to be parsed in server
        })
    });
    // return response; //return here
    let data = await response.json()
    console.log(data);
    return data;
};




export const getAnalysisProject = async (userID) => {
    console.log(userID);
    let response = await fetch('showP/'+userID, {
        method: 'post',
        headers: HeadersForApi
    });
    let data = await response.json();
    return data;
};



export const getProjectName = async (project_id) => {
    console.log(project_id);
    let response = await fetch('getProjectName/'+project_id, {
        method: 'post',
        headers: HeadersForApi
    });
    let data = await response.json();
    return data;
};


export const getAllProject = async (userID) => {
    let response = await fetch('getAllProject/'+userID, {
        method: 'post',
        headers: HeadersForApi
    });
    let data = await response.json();
    return data;
};


export const setProjectNameOnClickOnSelect = (pname) => {
    let div1 = 'CP: <span style="color: #3490dc;">'+pname+'</span>';
    $("#selected_project_name_id").html(div1);
};