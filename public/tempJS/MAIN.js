import { getMe } from "./home/helper.js";
import { checkIfNotificationSeen } from "./project/smatProject.js";


getMe();
checkIfNotificationSeen();
if(_MODE!=='HOME'){
    if(localStorage.getItem('projectMetaData')){
        let metaData = JSON.parse(localStorage.getItem('projectMetaData'));
        $('#projNav').fadeIn('slow')
         $('#projNavName').text(metaData['projectMetaData']['project_name']);
         $('#projNavCreatedOn').text(metaData['projectMetaData']['project_creation_date']);
         $('#projNavDescription').text(metaData['projectMetaData']['project_description']);
    }
}
