import {
    getRelatedSuggestions,
    storeToProjectTable,
    createProjectAPI,
    checkIfAnyKeySpaceCreatingAPI,
    getProjectName,
    checkIfProjectExitsByName,
    getAllProject
} from "./helper.js";
import {
    displayErrorMsg,
    getUserDetail
} from "../utilitiesJS/smatExtras.js";
import {
    generateUniqueID
} from "../utilitiesJS/uniqueIDGenerator.js";
import {
    getMe
} from '../home/helper.js';

var projeToBeCreated = "sars_2020",
    tagsArr = [],
    projectAlreadyExists = 0;
var confirmedDataSetToBeCreated;
var tempProjToBeCreated = [];
var projectCurrentlyCreatingFlag = 0;
var projectPending = [];
var currentlySelected=null;

getMe().then(id => {
    checkRecordsForProjects(id);
    $('#listOfProjects').html('');
    getAllProject(id).then(res => {
        res.map(project => {
            if(project.status=='1'){
            $('#listOfProjects').append('<button class="btn btn-light mr-3 my-2 projectBtn border text-dark" value="' + project.project_id + '|' + project.project_name + '" id="' + project.project_id + '-btn"><div><h5 class="m-0">' + project.project_name + '<h5></div><div class="text-left">Created on: ' + project.project_creation_date + '</div></button>')
            }
        })
    });
});



$('[data-toggle="popover"]').popover(); //Initalizing popovers

$("body").on('click', '.projectBtn', function () {
    $('#openProjectDiv').removeClass('confirmPanelExpand')
    $('#openProjectDiv').addClass('confirmPanelCollapse')
    $('.projectBtn').removeClass('active')
    $(this).addClass('active');
    let value = $(this).attr('value').split(/[|]/).filter(Boolean);
    currentlySelected=value;
    getProjectName(value[0]).then(res => {
        $('#modifyDivProjName').text(res[0]['project_name'])
        $('#modifyDivProjCreatedOn').text(res[0]['project_creation_date'])
        $('#modifyDivProjDescription').text(res[0]['project_description'])
        setTimeout(() => {
            $('#openProjectDiv').removeClass('confirmPanelCollapse')
            $('#openProjectDiv').addClass('confirmPanelExpand')
        }, 100);
    })

    $('body').on('click', '#closeModifyProjectDiv', function () {
        $('#openProjectDiv').removeClass('confirmPanelExpand')
        $('#openProjectDiv').addClass('confirmPanelCollapse')
    })
    // openProjectModifyDiv(value[0],value[1]);
});

$('body').on('click','#activeProject',function(){
    getProjectName(currentlySelected[0]).then(res => {
            let projectMetaData = res[0];
            localStorage.setItem('projectMetaData',JSON.stringify({projectMetaData}))
            location.reload();
    });
  });


$("body").on("input", "#projectName", function () {
    projeToBeCreated = $(this).val().toLowerCase();
    $(this).val(projeToBeCreated);
    $(".projectName").text(projeToBeCreated);
    if (projeToBeCreated) {
        checkIfProjectExitsByName(projeToBeCreated).then(flag => {
            if (flag === '0') {
                projectAlreadyExists = 0;
                $('#ifProjectNameAlreadyExits').text('');
            } else {
                $('#ifProjectNameAlreadyExits').text('Project already exits.Please use a different name.');
                projectAlreadyExists = 1;
            }
        })
    }
});




$("body").on("click", "#addProjectKeyboard", function () {
    let tagTemp = $("#projectTagInput").val();
    document.getElementById("projectTagInput").value = "";
    if (tagTemp) {
        $("#projectDivPool").append(
            '<div class="d-flex border m-1 p-2 smat-rounded projectTag" ><div>' +
            tagTemp +
            '</div><div class="ml-2 removeTag" value="' +
            tagTemp +
            '"><i class="fas fa-times"></i></div></div>'
        );
        if (tagsArr.includes(tagTemp)) {} else {
            tagsArr.push(tagTemp);
        }
    }
});




$("body").on("click", ".removeTag", function () {
    let temp = $(this)
        .attr("value")
        .trim();
    delete tagsArr[temp];
    $(this)
        .parent()
        .remove();
    tagsArr = tagsArr.filter(item => item !== temp);
});




$("body").on("submit", "#projCreateForm", function (e) {
    e.preventDefault();
    let queryStringTemp = "";
    let flag = 0;
    if (tagsArr.length < 1) {
        alert("Please add few suggestions!");
    } else {
        tagsArr.map(tag => {
            if (tag) {
                if (flag == 0) {
                    queryStringTemp = tag;
                    flag = 1;
                } else {
                    queryStringTemp = queryStringTemp + "|" + tag;
                }
            }
        });
        let from = $("#fromDateProj").val();
        let to = $("#toDateProj").val();
        let description = $("#projectFormTextarea_id").val();
        if (projectAlreadyExists === 0) {
            confirmedDataSetToBeCreated = [];
            getRelatedSuggestions(queryStringTemp, from, to).then(response => {
                tempProjToBeCreated["projName"] = projeToBeCreated;
                tempProjToBeCreated["from"] = from;
                tempProjToBeCreated["to"] = to;
                tempProjToBeCreated["queryStringTemp"] = queryStringTemp;
                tempProjToBeCreated["description"] = description;
                openConfirmANDSuggestionBoxProject(
                    projeToBeCreated,
                    from,
                    to,
                    description,
                    response
                );
            });
        } else {
            alert('Project already exits.Please use a different name.');
        }
    }
});





$('body').on('click', '.closeProjectLoader', function () {
    let value = $(this).attr('value');
    $('#' + value + '-Loader').remove();
    updateNotificationToLocalStorage(value, true);
});




const openConfirmANDSuggestionBoxProject = (projName, from, to, description, suggestionsArr) => {
    $("#projNameConfirm").text(projName);
    $("#fromDateConfirm").text(from);
    $("#toDateConfirm").text(to);
    $("#descConfirm").text(description);
    let counter = 0;
    $('#projectConfirmDiv').removeClass('confirmPanelCollapse');
    $('#projectConfirmDiv').addClass('confirmPanelExpand');
    $("#suggestionsConfirm").html("");
    tagsArr.forEach(tag => {
        confirmedDataSetToBeCreated.push(tag)
        $("#suggestionsConfirm").append(
            '<div class="m-1"  ><button class="btn btn-primary border smat-rounded confirmTags" value="' +
            tag +
            '">' +
            tag +
            "</button></div>"
        );
    })
    for (const [key, value] of Object.entries(suggestionsArr)) {
        $("#suggestionsConfirm").append(
            '<div class="m-1"  ><button class="btn border smat-rounded confirmTags" value="' +
            key +
            '">' +
            key +
            "</button></div>"
        );
        if (counter > 10) {
            break;
        }
        counter += 1;
    }
};





$("body").on("click", "div .confirmTags", function () {
    if (confirmedDataSetToBeCreated.includes($(this).attr("value"))) {
        $(this).removeClass("btn-primary");
        confirmedDataSetToBeCreated = confirmedDataSetToBeCreated.filter(
            item => item !== $(this).attr("value")
        );
    } else {
        if (confirmedDataSetToBeCreated.length > 2) {
            displayErrorMsg(
                "errorMsgForConfirm",
                "error",
                "Please select not more than 3 topics"
            );
        } else {
            $(this).addClass("btn-primary");
            confirmedDataSetToBeCreated.push($(this).attr("value"));
        }
    }
});


$("body").on("click", "div #confirmBtnProj", function () {
    let queryStringConfirm = "";
    if (confirmedDataSetToBeCreated.length < 1) {
        displayErrorMsg(
            "errorMsgForConfirm",
            "error",
            "Please select atleast 1 sugesstion."
        );
    } else {
        let flag = 0;
        confirmedDataSetToBeCreated.map(tag => {
            if (flag == 0) {
                queryStringConfirm = tag;
                flag = 1;
            } else {
                queryStringConfirm = queryStringConfirm + "|" + tag;
            }
        });
    }
    console.log("MetaDataProj-->", tempProjToBeCreated);
    console.log("QueryString-->", queryStringConfirm);


    //MALA Baa
    createProject(
        tempProjToBeCreated["projName"],
        tempProjToBeCreated["description"],
        queryStringConfirm,
        tempProjToBeCreated["from"],
        tempProjToBeCreated["to"],
        'baseDataset'
    );

    // if (projectCurrentlyCreatingFlag == 0) {
    //     projectCurrentlyCreatingFlag = 1;
    // }

});




$("body").on("click", "div #cancelBtnProj", function () {
    confirmedDataSetToBeCreated = [];

    $('#projectConfirmDiv').removeClass('confirmPanelExpand');
    $('#projectConfirmDiv').addClass('confirmPanelCollapse');
});




const createProject = (proj_name, proj_description, query, from_date, to_date, option = null) => {

    $('#projectConfirmDiv').removeClass('confirmPanelExpand');
    $('#projectConfirmDiv').addClass('confirmPanelCollapse')
    console.log(proj_name, proj_description, option);
    let project_id = generateUniqueID();
    getUserDetail().then(response => {
        let userIDForProject = response.id;
        // 1 store to project table
        storeToProjectTable(
            proj_name,
            userIDForProject,
            project_id,
            proj_description
        ).then(response => {
            console.log(response);
            displayErrorMsg('creatingProject', 'success', `Please wait your project <b>${proj_name}</b> is being created. In the meantime you can do other activities.`, false);
            $('#creatingProject').fadeIn('slow')
            checkRecordsForProjects(userIDForProject)
            // 2 create to keyspace and tables
            createProjectAPI(
                proj_name,
                option,
                userIDForProject,
                query,
                from_date,
                to_date
            ).then(response => {
                console.log(response);
            });
        });
    });
};


const checkRecordsForProjects = (id) => {
    console.log('checking projects')
    checkIfAnyKeySpaceCreatingAPI(id).then(response => {
        if (response.length < 1) {
            projectCurrentlyCreatingFlag = 1;
        } else {
            projectCurrentlyCreatingFlag = 0;
            runLoggerToCheckStats(id)
            let fadeInDelay = 0;
            response.forEach(element => {
                fadeInDelay += 1
        
                projectPending.push(element.project_id);
                makeRunningNotifcationForProject(element.project_id, element.project_name)
                $('#' + element.project_id + '-Loader').fadeIn(fadeInDelay * 1000);
            });
        }
    });
}

const runLoggerToCheckStats = (userID) => setInterval(() => {
    if (projectPending.length < 1) {
        // projectCurrentlyCreatingFlag = 1;
        clearInterval(runLoggerToCheckStats);
    }
    projectPending.forEach(element => {
        getProjectName(element).then(res => {
            if (res[0].status === 1) {
                displayErrorMsg('creatingProject', 'success', `Your project <b>${res[0].project_name}</b> has been created successfully.`);
                $('#creatingProject').fadeIn('slow')
                $('#listOfProjects').html('');
                getAllProject(res[0]['user_id']).then(res => {
                    res.map(project => {
                        if(project.status=='1'){
                            $('#listOfProjects').append('<button class="btn btn-light mr-3 my-2 projectBtn border text-dark" value="' + project.project_id + '|' + project.project_name + '" id="' + project.project_id + '-btn"><div><h5 class="m-0">' + project.project_name + '<h5></div><div class="text-left">Created on: ' + project.project_creation_date + '</div></button>')
                            }
                    })
                });
                updateNotificationToLocalStorage(res[0].project_name)
                projectReadyNotification(element, res[0].project_name)
                projectPending = projectPending.filter(item => item !== element);
            } else {
                //DO NOTHING
            }
        })
    })

}, 2000);


const updateNotificationToLocalStorage = (id, toDelete = false) => {
    let temp = JSON.parse(localStorage.getItem('smat-proj-stats'));
    if (toDelete == false) {
        if (temp) {
            if (!temp.includes(id))
                localStorage.setItem('smat-proj-stats', JSON.stringify([...temp, id]));
        } else {
            localStorage.setItem('smat-proj-stats', JSON.stringify([id]));
        }
    } else {
        temp = temp.filter(item => item !== id);
        localStorage.setItem('smat-proj-stats', JSON.stringify(temp));
    }
}




export const checkIfNotificationSeen = () => {
    if (localStorage.getItem('smat-proj-stats')) {
        let tempArr = JSON.parse(localStorage.getItem('smat-proj-stats'));
        tempArr.map(el => {
            getProjectName(el).then(res => {
                if (res[0]) {
                    projectReadyNotification(el, res[0]['project_name'])
                }
            });
        })
    }
}





checkIfNotificationSeen();
const makeRunningNotifcationForProject = (id, name) => {
    $('#notificationNav').append('<div class="d-flex bg-primary smat-rounded pl-1 pr-3  m-1 projectCreateLoader" id="' + id + '-Loader" style="display:none;"><div id="' + id + '-Spinner"><i class="fa fa-circle-o-notch donutSpinner mx-1 " aria-hidden="true" style="margin-top:7px;"></i></div><div class="text-white smat-notification-text" id="' + id + '-LoaderText"><div class="mx-1 text-truncate" style="margin-top:5px;font-size:12px; opacity: 100%">Creating Project <p class="m-0"> <b class="">' + name + '</b></p></div></div></div>');
}

const projectReadyNotification = (id, name) => {
    $('#' + id + '-Loader').remove();
    $('#notificationNav').append('<div class="d-flex bg-success smat-rounded pl-1 pr-3  m-1 projectCreateLoader" id="' + id + '-Loader" style="display:none;"><div id="' + id + '-Spinner"><i class="far fa-times-circle fa-2x closeProjectLoader  my-2 mx-1 text-white " style="cursor:pointer;" title="close" value="' + id + '" ></i></div><div class="text-white smat-notification-text" id="' + id + '-LoaderText"><div class="mx-1 text-truncate" style="margin-top:5px;font-size:12px; opacity: 100%">Created project suceessfully<p class="m-0"> <b class="">' + name + '</b></p></div></div></div>');
}
