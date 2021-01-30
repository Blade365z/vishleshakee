// /*jshint esversion: 6 */

// import {
//     createProjectAPI,
//     insertToNewKeyspace,
//     getAllProject,
//     setProjectNameOnClickOnSelect,
//     checkIfAnyKeySpaceCreatingAPI,
//     getProjectName,
//     deleteProjectFromRecords,
//     checkIfAnyAnalysisStoreGoingOn,
//     getAnalysisDetailsFromProjectActivitesAPI,
//     checkAnalysisExistorNot
// } from './helper.js';
// import {
//     getUserDetail,
//     actionLog,
//     toShowSelectedProject,
//     removeVariableFromLocalStorage,
//     displayErrorMsg,
//     getUserID
// } from '../utilitiesJS/smatExtras.js';
// import {
//     generateUniqueID
// } from '../utilitiesJS/uniqueIDGenerator.js';
// import {
//     getMe
// } from '../home/helper.js';


// var userIDForProject, project_id, projectName;
// var ProjectStatus;
// var isClearToMakeProject = 1,
//     projectPending = [],
//     analysisStorePending = [],
//     isClearToStoreAnalysis = 1,
//     isAnalysisLoggerAlreadyRunning = 0;


// // getMe().then(id => {
// //     userIDForProject = id;
// //     checkRecordsForProjects(id);
// //     analysisSaveLogger(id);
// // });




// const analysisSaveLogger = (id) => {
//     checkIfAnyAnalysisStoreGoingOn(id).then(response => {
//         // console.log('analysisStorePending:', analysisStorePending)
//         if (response.length < 1) {
//             // console.log('Logger for analysis NR!');
//         } else {
//             let fadeInDelay = 0;
//             response.forEach(element => {
//                 let unique = element.full_query;
//                 // let notifcationObj=[];
//                 // notifcationObj[unique]={'project_id':element.project_id,'analysis_name':element.analysis_name ,'from':element.from_date};
//                 updateNotificationToLocalStorage(unique);
//                 if (!analysisStorePending.includes(unique)) {
//                     fadeInDelay += 1
//                     analysisStorePending.push(unique);
//                     $('#notificationNav').append('<div class="d-flex bg-primary smat-rounded p-1 m-1 projectCreateLoader" id="' + unique + '-Loader" style="display:none;"><div id="' + unique + '-Spinner"><i class="fa fa-circle-o-notch donutSpinner  projectLoader " aria-hidden="true" ></i></div><div class="text-white smat-notification-text  ml-2 mr-3 pr-3" id="' + unique + '-LoaderText"><div class=" text-truncate" style="margin-top:5px;font-size:12px; opacity: 100%">Saving Analysis </div><div>Query: <b class="">' + element.analysis_name + '</b> </div></div></div>');
//                     $('#' + unique + '-Loader').fadeIn(fadeInDelay * 1000);
//                 } else {

//                 }
//             });
//             runLoggerToCheckAnalysisStats(id);
//         }
//     });

// }

// const runLoggerToCheckAnalysisStats = (userID) => {

//     if (isAnalysisLoggerAlreadyRunning == 0) {
//         isAnalysisLoggerAlreadyRunning = 1;
//         const CheckAnalysisStatsInterval = setInterval(() => {
//             console.log('checking if any analysis save in progress... with flag=', isAnalysisLoggerAlreadyRunning);
//             console.log('AND analysisStorePending:', analysisStorePending)
//             if (analysisStorePending.length > 0) {
//                 analysisStorePending.forEach(element => {
//                     console.log('Pending: ', analysisStorePending.length);
//                     getAnalysisDetailsFromProjectActivitesAPI(userID, element).then(async res => {
//                         if (res[0].insertion_successful_flag === -1) {
//                             const projName = await getProjectName(res[0].project_id);
//                             $('#' + element + '-Loader').removeClass('bg-primary')
//                             $('#' + element + '-Loader').addClass('bg-danger')
//                             $('#' + element + '-Spinner').html('<i class="far fa-times-circle fa-2x closeProjectLoader  m-1 text-white " style="cursor:pointer;" title="close" value="' + element + '" ></i>')
//                             $('#' + element + '-LoaderText').html('<div class="smat-notification-text  text-truncate" style="margin-top:10px;font-size:12px; opacity: 100%">Some error occured,while saving in <b class="">' + projName[0]['project_name'] + '</b> </div><div class="smat-notification-text"> Query: <b>' + res[0].analysis_name + '</b>, from: ' + res[0].from_date + ' to: ' + res[0].to_date + '   </div>')
//                             analysisStorePending = analysisStorePending.filter(item => item !== element);
//                         } else if (res[0].insertion_successful_flag === 1) {
//                             getListOfProjects();
//                             const projName = await getProjectName(res[0].project_id);
//                             $('#' + element + '-Loader').removeClass('bg-primary')
//                             $('#' + element + '-Loader').addClass('bg-success')
//                             $('#' + element + '-Spinner').html('<i class="far fa-times-circle fa-2x closeProjectLoader  m-1 text-white " style="cursor:pointer;" title="close" value="' + element + '" ></i>')
//                             $('#' + element + '-LoaderText').html('<div class="smat-notification-text  text-truncate" style="margin-top:5px;font-size:12px; opacity: 100%">Analysis saved in <b class="">' + projName[0]['project_name'] + '</b>  successfully!</div><div class="smat-notification-text"> Query: <b>' + res[0].analysis_name + '</b>, from: ' + res[0].from_date + ' to: ' + res[0].to_date + '</div>')
//                             analysisStorePending = analysisStorePending.filter(item => item !== element);

//                             location.reload();
//                         }
//                     });
//                 });
//             } else {
//                 console.log('clearningInterval For Analysis Logger.')
//                 isAnalysisLoggerAlreadyRunning = 0;

//                 clearInterval(CheckAnalysisStatsInterval);
//             }
//         }, 3000);
//     }
// }



// const checkRecordsForProjects = (id) => {
//     console.log('checking projects')
//     checkIfAnyKeySpaceCreatingAPI(id).then(response => {
//         if (response.length < 1) {
//             isClearToMakeProject = 1;
//         } else {
//             isClearToMakeProject = 0;
//             runLoggerToCheckStats(id)
//             let fadeInDelay = 0;
//             response.forEach(element => {
//                 fadeInDelay += 1
//                 projectPending.push(element.project_id);
//                 $('#notificationNav').append('<div class="d-flex bg-primary smat-rounded p-1 m-1 projectCreateLoader" id="' + element.project_id + '-Loader" style="display:none;"><div id="' + element.project_id + '-Spinner"><i class="fa fa-circle-o-notch donutSpinner mx-2 mt-2" aria-hidden="true"></i></div><div class="text-white smat-notification-text" id="' + element.project_id + '-LoaderText"><div class="mx-1 text-truncate" style="margin-top:10px;font-size:12px; opacity: 100%">Creating Project <b class="">' + element.project_name + '</b>...</div></div></div>');
//                 $('#' + element.project_id + '-Loader').fadeIn(fadeInDelay * 1000);
//             });
//         }
//     });
// }




// $('body').on('click', '.closeProjectLoader', function () {
//     let value = $(this).attr('value');
//     $('#' + value + '-Loader').remove();
//     updateNotificationToLocalStorage(value, true);

// });




// $('body').on('click', '.projDeleteBtn', function () {
//     let value = $(this).attr('value');
//     $('#' + value + '-projSelection').remove();
//     displayErrorMsg('projectMessgaes', 'success', 'Deleted successfully');

//     deleteProjectFromRecords(userIDForProject, value);
// });




// const runLoggerToCheckStats = (userID) => setInterval(() => {
//     if (projectPending.length < 1) {
//         isClearToMakeProject = 1;
//         clearInterval(runLoggerToCheckStats);
//     }
//     projectPending.forEach(element => {
//         getProjectName(element).then(res => {
//             if (res[0].status === 1) {
//                 getListOfProjects();
//                 displayErrorMsg('projectMessgaes', 'success', '<b>' + res[0].project_name + '</b> project created successfully!', false);
//                 $('#' + element + '-Loader').removeClass('bg-primary')
//                 $('#' + element + '-Loader').addClass('bg-success')
//                 $('#' + element + '-Spinner').html('<i class="far fa-times-circle fa-2x closeProjectLoader  m-1 text-white " style="cursor:pointer;" title="close" value="' + element + '" ></i>')
//                 $('#' + element + '-LoaderText').html('<div class="mx-2 text-truncate" style="margin-top:10px;font-size:12px; opacity: 100%">Project <b class="">' + res[0].project_name + '</b> created.</div>')
//                 projectPending = projectPending.filter(item => item !== element);
//             } else {
//                 //DO NOTHING
//             }
//         })
//     })

// }, 3000);




// if (localStorage.getItem('smat.projectStatus')) {
//     if (localStorage.getItem('smat.projectStatus') == null) {
//         ProjectStatus;
//     }
// } else {
//     localStorage.setItem('smat.projectStatus', null)
// }



// $('body').on('click', 'div #openCreateProjectModal', function () {
//     $('#createProjectModal').modal('show');
//     getListOfProjects()
// });



// $('body').on('click', 'div #selectModalBtnId', function () {
//     let pid = $('input[name="projectSelectRadios"]:checked').val();
//     let pname = $('input[name="projectSelectRadios"]:checked').attr('id');
//     localStorage.setItem("projectName", pname);
//     localStorage.setItem("project_id", pid);
//     checkifProjectStroingOn();
//     $('.modal').modal('hide');
//     setProjectNameOnClickOnSelect(pname);
// });






// $('body').on('submit', '#createProjectForm', function (e) {
//     e.preventDefault();
//     projectName = $('#projectName').val().trim().toLowerCase();
//     localStorage.setItem("projectName", projectName);
//     $('#projectName').val('');
//     $('.modal').modal('hide');
//     // let response = createProjectAPI(projectName);
//     project_id = generateUniqueID();
//     localStorage.setItem("project_id", project_id);
//     localStorage.setItem("u_id", userIDForProject);
//     console.log(userIDForProject);
//     console.log("werwerwer");
//     createProjectAPI(projectName, userIDForProject, project_id).then(response => {
//         // alert(response.res);
//         $("#smatProjectSlider").prop('checked', true);
//         if (response.res == "success") {
//             toShowSelectedProject();
//         }
//     });
// });





// // save analysis
// $('body').on('click', '#save_analysis_project_id', function (e) {
//     e.preventDefault();
//     let query, from_date, to_date, module_name;
//     let mainheadingname = $(".smat-mainHeading").text().trim().split(" ")[0];
//     console.log(mainheadingname);
//     let value = $(this).attr('value');
//     if (value) {
//         if (value.includes('?')) {
//             value = value.split(/[?]/).filter(Boolean);
//             query = value[0];
//             from_date = value[1];
//             to_date = value[2];
//         }
//     }

//     if (mainheadingname == "Historical") {
//         module_name = "ha";
//     }
//     getUserDetail().then(response => {
//         let userIDForProject = response.id;
//         console.log(response.id);
//         if (localStorage.getItem('projectName')) {
//             let projectName = localStorage.getItem("projectName");
//             let project_id = localStorage.getItem("project_id");
//             console.log(projectName, query, from_date, to_date, module_name, userIDForProject, project_id);
//             insertToNewKeyspace(projectName, query, from_date, to_date, module_name, userIDForProject, project_id).then(response => {

//                 let unique = response.full_query;
//                 console.log('isAnalysisLoggerAlreadyRunning--->', isAnalysisLoggerAlreadyRunning)
//                 // analysisStorePending.push(unique);

//                 analysisSaveLogger(userIDForProject);

//                 $('#' + unique + '-Loader').fadeIn(1000);
//                 $("html, body").animate({
//                     scrollTop: 0
//                 }, "slow");
//             });
//         } else {
//             $("#openSelectProjectModal").trigger("click");
//         }

//     });
// });




// const checkifProjectStroingOn = () => {
//     if (localStorage.getItem('project_id')) {
//         $('#nav-repoSwitch').fadeIn('slow')
//         $("#smatProjectSlider").prop('checked', true);
//         $('#projectInfoSlider').text(localStorage.getItem('projectName'))
//         $('#projectStatIcon').html('<i class="fa fa-circle   text-success" aria-hidden="true" ></i>');
//         $('.projErrorMsg').remove();
//         return true;
//     }
//     return false;
// }



// checkifProjectStroingOn();


// $('body').on('change', 'div #smatProjectSlider', function () {
//     if (checkifProjectStroingOn()) {
//         removeVariableFromLocalStorage();
//         $(this).prop('checked', false);
//         $('#projectStatIcon').html('<i class="fa fa-circle   text-danger" aria-hidden="true" ></i>');
//         $('#projectStatIcon').after('<div class="projErrorMsg"> project exiting...</div>');
//         $("#ProjectStatusTable").empty();
//         checkIfAnyProjActive();
//         $('#nav-repoSwitch').fadeOut(2000);
//         return false;
//     }
// });


// $('body').on('submit', '#createNewProjectForm', function (e) {
//     e.preventDefault();
//     if (isClearToMakeProject === 1) {
//         // let newProject = $('#addNewProjectInput').val().trim();

//         projectName = $('#addNewProjectInput').val().trim().toLowerCase();
//         $('#projectName').val('');
//         // let response = createProjectAPI(projectName);
//         project_id = generateUniqueID();
//         // localStorage.setItem("project_id", project_id);
//         // localStorage.setItem("u_id", userIDForProject);
//         displayErrorMsg('projectMessgaes', 'error', 'Creating repository.Please wait as this may take few moment.', false);
//         projectPending.push(project_id);
//         $('#notificationNav').append('<div class="d-flex bg-primary smat-rounded p-1 m-1 projectCreateLoader" id="' + project_id + '-Loader" style="display:none;"><div id="' + project_id + '-Spinner"><i class="fa fa-circle-o-notch donutSpinner mx-2 mt-2" aria-hidden="true"></i></div><div class="text-white" id="' + project_id + '-LoaderText"><div class="mx-1 text-truncate" style="margin-top:10px;font-size:12px; opacity: 100%">Creating Project <b class="">' + projectName + '</b>...</div></div></div>');
//         $('#' + project_id + '-Loader').fadeIn(1000);
//         runLoggerToCheckStats(userIDForProject)

//         createProjectAPI(projectName, userIDForProject, project_id).then(response => {
//             // displayErrorMsg('projectMessgaes', 'success', projectName + ' project created successfully', false);
//         });

//     } else {
//         displayErrorMsg('projectMessgaes', 'error', 'Please wait as another project is being created.', false);
//     }
// });



// $('body').on('click', '.projSelRadio', function () {
//     let currentlySelected = $(this).attr('value').split(/[|]/).filter(Boolean);
//     localStorage.setItem("project_id", currentlySelected[0]);
//     localStorage.setItem("projectName", currentlySelected[1]);
//     checkifProjectStroingOn();

//     // $('.modal').modal('hide');
//     $('#currentlySelectedProj').html('<h5 class="text-dark mb-3"><span class="text-normal font-weight-bold">' + localStorage.getItem('projectName') + ' </span> repository currently selected.</h5>')
//     checkIfAnyProjActive();
//     location.reload();
// });



// const getListOfProjects = () => {
//     userIDForProject = JSON.parse(localStorage.getItem('smat.me')).id;

//     let currentProject = localStorage.getItem('project_id') ? localStorage.getItem('project_id') :
//         null;
//     getAllProject(userIDForProject).then(response => {
//         $("#selectProjectModalBody").html('<form id="projectsUser"></form>');
//         if (response.length < 1) {
//             let div1 = `<div>Please Create one Project to save analysis
//                         </div>`;
//             $("#selectProjectModalBody").append(div1);
//         } else {
//             response.forEach(element => {
//                 if (element.status === 1) {
//                     let pname = element.project_name;
//                     let pid = element.project_id;
//                     let div1 = `<div class="border m-1 p-1" id="` + pid + `-projSelection"><div class="custom-control custom-radio">
//                 <input type="radio"  name="projectSelectRadios" class="custom-control-input projSelRadio"  id="` + pid + `-radio" value="` + pid + `|` + pname + `">
//                 <label class="custom-control-label" for="` + pid + `-radio" ><b>` + pname + `</b></label>
//               </div><div class="d-flex"><div class="mr-2"> created on: ` + element.project_creation_date + `</div> | <div class="ml-2 projDeleteBtn text-danger clickable" value=` + pid + ` > Delete </div></div></div>`;

//                     $("#projectsUser").append(div1);
//                 }
//             });
//         }
//         if (currentProject) {
//             $('#' + currentProject + '-radio').prop('checked', true);
//             $('#currentlySelectedProj').html('<h5 class="text-dark mb-3"><span class="text-normal font-weight-bold">' + localStorage.getItem('projectName') + ' </span> repository currently selected.</h5>')
//         } else {
//             $('#currentlySelectedProj').html('<p class="text-dark font-weight-bold">No project repository selected.</p>')
//         }
//     });
// }


// getListOfProjects();


// const updateNotificationToLocalStorage = (id, toDelete = false) => {
//     let temp = JSON.parse(localStorage.getItem('smat-proj-stats'));
//     if (toDelete == false) {
//         if (temp) {
//             if (!temp.includes(id))
//                 localStorage.setItem('smat-proj-stats', JSON.stringify([...temp, id]));
//         } else {
//             localStorage.setItem('smat-proj-stats', JSON.stringify([id]));
//         }
//     } else {
//         temp = temp.filter(item => item !== id);
//         localStorage.setItem('smat-proj-stats', JSON.stringify(temp));
//     }

// }


// const checkIfNotificationSeen = () => {
//     if (localStorage.getItem('smat-proj-stats')) {
//         let tempArr = JSON.parse(localStorage.getItem('smat-proj-stats'));
//         tempArr.map(el => {
//             getAnalysisDetailsFromProjectActivitesAPI(userIDForProject, el).then(async response => {

//                 response = response[0];
//                 if (response.insertion_successful_flag === 1) {
//                     const projName = await getProjectName(response.project_id);

//                     $('#notificationNav').append('<div class="d-flex smat-rounded p-1 m-1 projectCreateLoader bg-success" id="' + response.full_query + '-Loader" style=""><div id="7' + response.full_query + '-Spinner"><i class="far fa-times-circle fa-2x closeProjectLoader  ml-2 mt-2 text-white" style="cursor:pointer;" title="close" value="' + response.full_query + '"></i></div><div class="text-white ml-1 mr-3 pr-3" id="' + response.full_query + '-LoaderText"><div class=" smat-notification-text text-truncate" style="margin-top:5px;opacity: 100%">Analysis saved in <b class="">' + projName[0]['project_name'] + '</b>  successfully!</div><div class="smat-notification-text"> Query: <b>' + response.analysis_name + '</b>, from: ' + response.from_date + ' to: ' + response.to_date + ' </div></div></div>')
//                 }
//             })
//         })
//     }
// }

// checkIfNotificationSeen();



// export const checkIfAnyProjActive = () => {
//     if (localStorage.getItem('projectName')) {
//         $('.projContent').css('display', 'block')
//         let projectName = localStorage.getItem('projectName');
//         let projectID = localStorage.getItem('project_id');
//         $('#save_analysis_project_id').addClass('smat-btn');
//         $('.projName').text(projectName);
//         $("#save_analysis_project_id").html("<span>Save to " + projectName + "</span>");

//     } else {
//         $('.projContent').fadeOut('slow')
//         $("#save_analysis_project_id").removeClass('smat-btn')
//         $("#save_analysis_project_id").html("<span>No Project Active to save!</span>");
//     }
// };



// export const checkAnalysisExistorNotFunction = (user_id, query, from_date, to_date, module_name) => {
//     let insertedFlag = 0;
//     let projectName = localStorage.getItem('projectName');
//     let projectID = localStorage.getItem('project_id');
//     let orig_query = query;
//     if (query[0] == '#')
//         query = 'HASH' + query.slice(1);
//     let full_query = user_id + projectID + query + from_date + to_date + module_name

//     //set value for save button..
//     $("#save_analysis_project_id").attr("value", orig_query + '?' + from_date + '?' + to_date);

//     checkAnalysisExistorNot(full_query).then(response => {
//         response.forEach(element => {
//             // console.log(element);
//             if (element.insertion_successful_flag === 1) {
//                 insertedFlag = 1;
//             }
//         });
//         if (insertedFlag) {
//             $("#save_analysis_project_id").attr("disabled", "disabled");
//             // $("#save_analysis_project_id").removeClass('smat-btn')
//             $("#save_analysis_project_id").html("<span>Saved to " + projectName + "</span>");
//         } else {
//             $("#save_analysis_project_id").removeAttr("disabled");
//             // $('#save_analysis_project_id').addClass('smat-btn');
//             $("#save_analysis_project_id").html("<span>Save to " + projectName + "</span>");
//         }
//     });
// }


// const CheckForValidationOfProject = (project_name) => {


// }
