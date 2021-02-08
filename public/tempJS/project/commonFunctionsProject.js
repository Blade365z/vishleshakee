export const removeVariableFromLocalStorage = () =>{
    localStorage.removeItem("project_id");
    localStorage.removeItem("projectName");
    localStorage.removeItem('uid');
}



export const checkIfAnyProjectActive = () => {
    if (localStorage.getItem('projectMetaData')) {
        return 1;
    }else
        return 0;
}


export const getProjectDetailsFromLocalStorage = () => {
    if (localStorage.getItem('projectMetaData')) {
        return JSON.parse(localStorage.getItem('projectMetaData'));
    }else
        return null;   
}

export const madeFullQuery = (projectDetails, query, module_name, from_date, to_date) => {
    let full_query;
    let user_id = projectDetails.projectMetaData.user_id;
    let project_id = projectDetails.projectMetaData.project_id;
    if(query[0] == '#'){
        query = query.substring(1, query.length);
        full_query = user_id+project_id+'HASH'+query+from_date+to_date+module_name;
    }
    else
        full_query =  user_id+project_id+query+from_date+to_date+module_name;
    console.log('full_query');
    console.log(full_query);
    return full_query;
}