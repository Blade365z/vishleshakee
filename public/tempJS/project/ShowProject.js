import { getAnalysisProject, getProjectName, getAllProject, getAnalysisDetailsFromProjectActivitesAPI, getAnalysisForAProjectAPI, createProjectAPI } from './helper.js';
import { displayErrorMsg, getUserDetail, actionLog } from '../utilitiesJS/smatExtras.js'
import { forwardToHistoricalAnalysis, forwardToNetworkAnalysis, forwardToUserAnalysis } from '../utilitiesJS/redirectionScripts.js';

var userIDGlobal;

// to get userID


jQuery(() => {
    getUserDetail().then(async response => {
        userIDGlobal = response.id;
        const projects = await getAllProject(userIDGlobal);
        $('#numberOfProjectsCreated').text(projects.length);
        projects.map(element => {
            console.log(element);
            if (element.status === 1) {
                $('#projecBlocks').append('<div><button type="button" class="btn btn-outline-secondary m-3 projectSelBtn py-3" id="' + element.project_id + '-ProjectSelBtn"  value="' + element.project_id + '?' + element.project_name + '"><div><h4 class="m-0 font-weight-bold">' + element.project_name + '</h4></div><div>Created on: '+element.project_creation_date+'</div></button></div>')
            }
        });
        $('#' + projects[0]['project_id'] + '-ProjectSelBtn').addClass('active');
        generateDataForAProject(userIDGlobal, projects[0].project_id, projects[0].project_name)
    });


    $('body').on('click', '.projectSelBtn', function () {
        let value = $(this).attr('value');
        value = value.split(/[?]/).filter(Boolean);
        $('.projectSelBtn').removeClass('active');
        $(this).addClass('active');
        generateDataForAProject(userIDGlobal, value[0], value[1]);

        //
        localStorage.setItem("project_id", value[0]);
        localStorage.setItem("projectName", value[1]);
        checkifProjectStroingOn();
    });


    $('body').on('click', '.showBtn', function () {
        console.log($(this).closest("tr"));
        let value = $(this).attr('value');
        value = value.split(/[?]/).filter(Boolean);
        let ks_name = value[0];
        let query = value[1];
        let from_date = value[2];
        let to_date = value[3];
        let module_name = value[4];
        console.log(ks_name, query, from_date, to_date, module_name);
        if(module_name == 'ha')
            forwardToHistoricalAnalysis(query,from_date,to_date,ks_name);
    });
});



const checkifProjectStroingOn = () => {
    if (localStorage.getItem('project_id')) {
        $('#nav-repoSwitch').fadeIn('slow')
        $("#smatProjectSlider").prop('checked', true);
        $('#projectInfoSlider').text(localStorage.getItem('projectName'))
        $('#projectStatIcon').html('<i class="fa fa-circle   text-success" aria-hidden="true" ></i>');
        $('.projErrorMsg').remove();
        return true;
    }
    return false;
}


const generateDataForAProject = async (userID, projID, projName = null) => {
    const analysisRecords = await getAnalysisForAProjectAPI(userID, projID, 'all');
    let counter = 1;
    $('#ProjectTable').html('')
    $('#currentlySelectedProjtext').text(projName);
    if (analysisRecords < 1) {
        $('#showingProj').css('display', 'none');
        $('#searchTable').css('display', 'none');
        $('#errorMsgsShowProj').fadeIn('slow');
        displayErrorMsg('errorMsgsShowProj', 'error', 'No analysis performed/saved yet.', false);
    } else {
        $('#showingProj').fadeIn("slow");
        $('#searchTable').fadeIn("slow");
        $('#errorMsgsShowProj').css('display', 'none');
        analysisRecords.map(element => {
            let value_str = projName+'?'+element.analysis_name+'?'+element.from_date+'?'+element.to_date+'?'+element.module_name;
            
            $('<tr id="projTableRow-' + counter + '"><td><div class="font-weight-bold">' + element.analysis_name + '</div><div> from: ' + element.from_date + '  to: ' + element.to_date + ' </div></td><td>' + element.analysis_datetime + '</td></tr>').prependTo("#ProjectTable");

            // $('<tr id="projTableRow-' + counter + '"><td><div class="font-weight-bold">' + element.analysis_name + '</div><div> from: ' + element.from_date + '  to: ' + element.to_date + ' </div></td><td>' + element.analysis_datetime + '</td><td><button class="btn btn-primary smat-rounded mx-1 showBtn" value='+value_str+'> Show </button><button class="btn btn-danger mx-1  smat-rounded deleteBtn" > Delete </button></td></tr>').prependTo("#ProjectTable");
            // $('#projTableRow-'+counter).fadeIn(10*counter);
            counter += 1;

        })
    }
}