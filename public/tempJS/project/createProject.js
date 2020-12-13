/*jshint esversion: 6 */

import {createProjectAPI, insertToNewKeyspace, getAllProject, setProjectNameOnClickOnSelect} from './helper.js';
import {getUserDetail, actionLog, toShowSelectedProject} from '../utilitiesJS/smatExtras.js';
import { generateUniqueID } from '../utilitiesJS/uniqueIDGenerator.js';

var userIDForProject, project_id, projectName;

// to get userID
getUserDetail().then(response => {
    userIDForProject = response.id;
    console.log(userIDForProject);
});


$('body').on('click','div #openCreateProjectModal',function(){
    $('#createProjectModal').modal('show');
    console.log(userIDForProject);
});


$('body').on('click','div #createnewprojectbtnunderselectproject_id',function(){
    $('#selectProjectModal').modal('hide');
    $('#createProjectModal').modal('show');
    console.log(userIDForProject);
});



$('body').on('click','div #openSelectProjectModal',function(){
    userIDForProject = JSON.parse(localStorage.getItem('smat.me')).id;
    $('#selectProjectModal').modal('show');
    console.log(userIDForProject);
    $("#selectProjectModalBody").empty();
    getAllProject(userIDForProject).then(response => {
        console.log(response);
        if(response.length < 1){
            let div1 = `<div>Please Create one Project to save analysis
                            <button type="button" class="btn btn-primary" id="createnewprojectbtnunderselectproject_id">Create New Project</button>
                        </div>`;
            $("#selectProjectModalBody").append(div1);
        }else{
            response.forEach(element => {
                let pname = element.project_name;
                let pid = element.project_id;
                let div1 = `<div class="form-check">
                                <input class="form-check-input" type="radio" name="projectSelectRadios" id="`+pname+`" value="`+pid+`">
                                <label class="form-check-label" for="`+pname+`">
                                `+pname+`
                                </label>
                            </div>`;
                $("#selectProjectModalBody").append(div1);
            });
        }
    });
});



$('body').on('click','div #selectModalBtnId',function(){
    let pid = $('input[name="projectSelectRadios"]:checked').val();
    let pname = $('input[name="projectSelectRadios"]:checked').attr('id');
    localStorage.setItem("projectName", pname);
    localStorage.setItem("project_id", pid); 
    setProjectNameOnClickOnSelect(pname);
});



$('body').on('submit','#createProjectForm',function(e){
    e.preventDefault();
    projectName = $('#projectName').val().trim().toLowerCase();
    localStorage.setItem("projectName", projectName);
    $('#projectName').val('');
    $('.modal').modal('hide');
    // let response = createProjectAPI(projectName);
    project_id = generateUniqueID();  
    localStorage.setItem("project_id", project_id); 
    localStorage.setItem("u_id", userIDForProject); 
    console.log(userIDForProject);
    console.log("werwerwer");
    createProjectAPI(projectName, userIDForProject, project_id).then(response => {
        // alert(response.res);
        if(response.res == "success"){
            toShowSelectedProject();
        }
    });
});


// save analysis
$('body').on('click','#nav-save',function(e){
    e.preventDefault(); 
    let query, from_date, to_date, module_name;    
    let mainheadingname = $(".smat-mainHeading").text().trim();
    console.log(mainheadingname);
    if(mainheadingname == "Historical Analysis"){
        let t = document.getElementById('haNormalStatusTable');
        query = $(t.rows[0].cells[0]).text().trim();
        from_date = $(t.rows[0].cells[1]).text().trim();
        to_date = $(t.rows[0].cells[2]).text().trim();
        module_name = "ha";
    }
    userIDForProject = localStorage.getItem("u_id");
    if(localStorage.getItem('projectName')){
        projectName = localStorage.getItem("projectName");
        project_id = localStorage.getItem("project_id");

        insertToNewKeyspace(projectName, query, from_date, to_date,  module_name, userIDForProject, project_id).then(response => {
            alert(response.res);
        });
    
        //log
        actionLog(userIDForProject, "clicked on 'save_analysis' button to save analysis on "+query).then(response => {
            console.log(response);
        });
    }else{
        $( "#openSelectProjectModal" ).trigger( "click" );
    }
});