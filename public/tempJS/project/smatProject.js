import { getRelatedSuggestions, storeToProjectTable, createProjectAPI, checkIfAnyKeySpaceCreatingAPI, getProjectName, checkIfProjectExitsByName, getAllProject, getAllStoriesFromProject, getAllAnalysisUnderStory, getStoryInfo, getBaseURL, updateStoryAnalysis, getPlotsFromServer } from "./helper.js";
import { displayErrorMsg, getUserDetail } from "../utilitiesJS/smatExtras.js";
import { generateUniqueID } from "../utilitiesJS/uniqueIDGenerator.js";

import { getMe } from "../home/helper.js";

import { getDateRange } from "../utilitiesJS/smatDate.js";

var projeToBeCreated = "sars_2020", tagsArr = [], projectAlreadyExists = 0;
var confirmedDataSetToBeCreated;
var tempProjToBeCreated = [];
var projectCurrentlyCreatingFlag = 0;
var projectPending = [];
var currentlySelected = null;

var reportElements = [];

getMe().then(id => {
    checkRecordsForProjects(id);
    $("#listOfProjects").html("");
    getAllProject(id).then(res => {
        $("#numberOfProjectsCreatedByYou").text(res.length);

        res.map(project => {
            if (project.status == "1") {
                $("#listOfProjects").append(
                    '<button class="btn btn-light mr-3 my-2 projectBtn border text-dark" value="' + project.project_id + "|" + project.project_name + '" id="' + project.project_id + '-btn"><div><h5 class="m-0">' + project.project_name + '<h5></div><div class="text-left">Created on: ' + project.project_creation_date + "</div></button>"
                );
            }
        });
    });
});

var isFormOpen = 0;
$("#openProjectFormBtn").on("click", function () {
    if (isFormOpen === 0) {
        $("#projectCreationForm").removeClass("confirmPanelCollapse");
        $("#projectCreationForm").addClass("confirmPanelExpand");
        $("#openProjectFormBtn").css("display", "none");
    }
});

$("#closeCreateProjectDiv").on("click", function () {
    $("#projectCreationForm").removeClass("confirmPanelExpand");
    $("#projectCreationForm").addClass("confirmPanelCollapse");
    $("#openProjectFormBtn").css("display", "block");
});
$('[data-toggle="popover"]').popover(); //Initalizing popovers

$("body").on("click", ".projecstBtn", function () {
    $("#openProjectDiv").removeClass("confirmPanelExpand");
    $("#openProjectDiv").addClass("");

    $("#storyContentDiv").removeClass("confirmPanelExpand");
    $("#storyContentDiv").addClass("confirmPanelCollapse");

    $(".projectBtn").removeClass("active");
    $(this).addClass("active");
    let value = $(this).attr("value").split(/[|]/).filter(Boolean);
    currentlySelected = value;
    $("#listOfStoriesOFProjectDiv").html("");
    getAllStoriesFromProject(currentlySelected[0]).then(res => {
        $("#numberOfStories").text(res.length);
        res.map(story => {
            $("#listOfStoriesOFProjectDiv").append(
                '<button class="btn btn-light smat-rounded border mr-3 storyBtnProj" value="' + story.storyID + '">' + story.storyName + "</button>"
            );
        });
    });
    getProjectName(value[0]).then(res => {
        $("#modifyDivProjName").text(res[0]["project_name"]);
        $("#modifyDivProjCreatedOn").text(res[0]["project_creation_date"]);
        $("#modifyDivProjDescription").text(res[0]["project_description"]);
        setTimeout(() => {
            $("#openProjectDiv").removeClass("confirmPanelCollapse");
            $("#openProjectDiv").addClass("confirmPanelExpand");
        }, 100);
    });
    // openProjectModifyDiv(value[0],value[1]);
});

$("body").on("click", ".projectBtn", async function () {
    $("#openProjectDiv").removeClass("confirmPanelExpand");
    $("#openProjectDiv").addClass("");

    $("#storyContentDiv").removeClass("confirmPanelExpand");
    $("#storyContentDiv").addClass("confirmPanelCollapse");

    $(".projectBtn").removeClass("active");
    $(this).addClass("active");
    let value = $(this).attr("value").split(/[|]/).filter(Boolean);
    currentlySelected = value;
    $("#listOfStoriesOFProjectDiv").html("");
    getAllStoriesFromProject(currentlySelected[0]).then(res => {
        $("#numberOfStories").text(res.length);
        res.map(story => {
            $("#listOfStoriesOFProjectDiv").append('<button class="btn btn-light smat-rounded border mr-3 storyBtnProj" value="' + story.storyID + '">' + story.storyName + "</button>"
            );
        });
    });
    getProjectName(value[0]).then(res => {
        $("#modifyDivProjName").text(res[0]["project_name"]);
        $("#modifyDivProjCreatedOn").text(res[0]["project_creation_date"]);
        $("#modifyDivProjDescription").text(res[0]["project_description"]);
        setTimeout(() => {
            $("#openProjectDiv").removeClass("confirmPanelCollapse");
            $("#openProjectDiv").addClass("confirmPanelExpand");
        }, 100);
    });

    const baseURL = await getBaseURL();
    const userID = await getMe();
    //value[0] is the story ID
    // openProjectModifyDiv(value[0],value[1]);
});
$("body").on("click", "#closeModifyProjectDiv", function () {
    $("#openProjectDiv").removeClass("confirmPanelExpand");
    $("#openProjectDiv").addClass("confirmPanelCollapse");
});
$("body").on("click", "#activeProject", function () {
    getProjectName(currentlySelected[0]).then(res => {
        let projectMetaData = res[0];
        localStorage.setItem("projectMetaData", JSON.stringify({ projectMetaData }));
        location.reload();
    });
});

$("body").on("input", "#projectName", function () {
    projeToBeCreated = $(this).val().toLowerCase();
    $(this).val(projeToBeCreated);
    $(".projectName").text(projeToBeCreated);
    if (projeToBeCreated) {
        checkIfProjectExitsByName(projeToBeCreated).then(flag => {
            if (flag === "0") {
                projectAlreadyExists = 0;
                $("#ifProjectNameAlreadyExits").text("");
            } else {
                $("#ifProjectNameAlreadyExits").text(
                    "Project already exits.Please use a different name."
                );
                projectAlreadyExists = 1;
            }
        });
    }
});

$("body").on("click", "#addProjectKeyboard", function () {
    let tagTemp = $("#projectTagInput").val();
    document.getElementById("projectTagInput").value = "";
    if (tagTemp) {
        $("#projectDivPool").append('<div class="d-flex border m-1 p-2 smat-rounded projectTag" ><div>' + tagTemp + '</div><div class="ml-2 removeTag" value="' + tagTemp + '"><i class="fas fa-times"></i></div></div>');
        if (tagsArr.includes(tagTemp)) {
        } else {
            tagsArr.push(tagTemp);
        }
    }
});

$("body").on("click", ".removeTag", function () {
    let temp = $(this).attr("value").trim();
    delete tagsArr[temp];
    $(this).parent().remove();
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
                openConfirmANDSuggestionBoxProject(projeToBeCreated, from, to, description, response);
            });
        } else {
            alert("Project already exits.Please use a different name.");
        }
    }
});

$("body").on("click", ".closeProjectLoader", function () {
    let value = $(this).attr("value");
    $("#" + value + "-Loader").remove();
    updateNotificationToLocalStorage(value, true);
});

const openConfirmANDSuggestionBoxProject = (projName, from, to, description, suggestionsArr) => {
    $("#projNameConfirm").text(projName);
    $("#fromDateConfirm").text(from);
    $("#toDateConfirm").text(to);
    $("#descConfirm").text(description);
    let counter = 0;
    $("#projectConfirmDiv").removeClass("confirmPanelCollapse");
    $("#projectConfirmDiv").addClass("confirmPanelExpand");
    $("#suggestionsConfirm").html("");

    // $('#projectCreationForm').removeClass('confirmPanelExpand')
    // $('#projectCreationForm').addClass('confirmPanelCollapse')
    // $('#openProjectFormBtn').css('display','block');

    $("html, body").animate({ scrollTop: $("#projNameConfirm").offset().top }, 1000);
    tagsArr.forEach(tag => {
        confirmedDataSetToBeCreated.push(tag);
        $("#suggestionsConfirm").append('<div class="m-1"  ><button class="btn btn-primary border smat-rounded confirmTags" value="' + tag + '">' + tag + "</button></div>");
    });
    for (const [key, value] of Object.entries(suggestionsArr)) {
        $("#suggestionsConfirm").append('<div class="m-1"  ><button class="btn border smat-rounded confirmTags" value="' + key + '">' + key + "</button></div>");
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
            displayErrorMsg("errorMsgForConfirm", "error", "Please select not more than 3 topics");
        } else {
            $(this).addClass("btn-primary");
            confirmedDataSetToBeCreated.push($(this).attr("value"));
        }
    }
});

$("body").on("click", "div #confirmBtnProj", function () {
    let queryStringConfirm = "";
    if (confirmedDataSetToBeCreated.length < 1) {
        displayErrorMsg("errorMsgForConfirm", "error", "Please select atleast 1 sugesstion.");
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
    console.log("QueryString-->", "(" + queryStringConfirm + ")");

    //MALA
    createProject(tempProjToBeCreated["projName"], tempProjToBeCreated["description"], "(" + queryStringConfirm + ")", tempProjToBeCreated["from"], tempProjToBeCreated["to"], "baseDataset");

    // if (projectCurrentlyCreatingFlag == 0) {
    //     projectCurrentlyCreatingFlag = 1;
    // }
});

$("body").on("click", "div #cancelBtnProj", function () {
    confirmedDataSetToBeCreated = [];

    $("#projectConfirmDiv").removeClass("confirmPanelExpand");
    $("#projectConfirmDiv").addClass("confirmPanelCollapse");
});




const createProject = (proj_name, proj_description, query, from_date, to_date, option = null) => {
    $("#projectCreationForm").removeClass("confirmPanelExpand");
    $("#projectCreationForm").addClass("confirmPanelCollapse");
    $("#openProjectFormBtn").css("display", "block");

    $("#projectConfirmDiv").removeClass("confirmPanelExpand");
    $("#projectConfirmDiv").addClass("confirmPanelCollapse");

    $(".projField").val("");

    tagsArr = [];
    $("#projectDivPool").html("");

    // build query to submit on spark
    let queries = [query, from_date, to_date];
    let query_list = get_tokens_wrt_pattern(queries); // get token
    console.log(query_list);

    console.log(proj_name, proj_description, option);
    let project_id = generateUniqueID();
    getUserDetail().then(response => {
        let userIDForProject = response.id;
        // 1 store to project table
        storeToProjectTable(proj_name, userIDForProject, project_id, proj_description).then(response => {
            console.log(response);
            displayErrorMsg('creatingProject', 'success', `Please wait your project <b>${proj_name}</b> is being created. In the meantime you can do other activities.`, false);
            $('#creatingProject').fadeIn('slow')
            checkRecordsForProjects(userIDForProject);
            // 2 create to keyspace and tables
            createProjectAPI(proj_name, option, userIDForProject, query, from_date, to_date, query_list).then(response => {
                console.log(response);
            });
        });
    });
};

const checkRecordsForProjects = id => {
    checkIfAnyKeySpaceCreatingAPI(id).then(response => {
        if (response.length < 1) {
            projectCurrentlyCreatingFlag = 1;
        } else {
            projectCurrentlyCreatingFlag = 0;
            runLoggerToCheckStats(id);
            let fadeInDelay = 0;
            response.forEach(element => {
                fadeInDelay += 1;
                if (!projectPending.includes(element.project_id)) {
                    projectPending.push(element.project_id);
                    makeRunningNotifcationForProject(
                        element.project_id,
                        element.project_name
                    );
                    $("#" + element.project_id + "-Loader").fadeIn(
                        fadeInDelay * 1000
                    );
                }
            });
        }
    });
};
// $('#numberOfStories').text(res)
const runLoggerToCheckStats = userID =>
    setInterval(() => {
        if (projectPending.length < 1) {
            // projectCurrentlyCreatingFlag = 1;
            clearInterval(runLoggerToCheckStats);
        }
        projectPending.forEach(element => {
            getProjectName(element).then(res => {
                if (res[0].status === 1) {
                    displayErrorMsg("creatingProject", "success", `Your project <b>${res[0].project_name}</b> has been created successfully.`
                    );
                    $("#creatingProject").fadeIn("slow");
                    $("#listOfProjects").html("");
                    getAllProject(res[0]["user_id"]).then(res => {
                        res.map(project => {
                            if (project.status == "1") {
                                $("#listOfProjects").append(
                                    '<button class="btn btn-light mr-3 my-2 projectBtn border text-dark" value="' + project.project_id + "|" + project.project_name + '" id="' + project.project_id + '-btn"><div><h5 class="m-0">' + project.project_name + '<h5></div><div class="text-left">Created on: ' + project.project_creation_date + "</div></button>");
                            }
                        });
                    });
                    updateNotificationToLocalStorage(res[0].project_name);
                    projectReadyNotification(element, res[0].project_name);
                    projectPending = projectPending.filter(
                        item => item !== element
                    );
                } else {
                    //DO NOTHING
                }
            });
        });
    }, 2000);

const updateNotificationToLocalStorage = (id, toDelete = false) => {
    let temp = JSON.parse(localStorage.getItem("smat-proj-stats"));
    if (toDelete == false) {
        if (temp) {
            if (!temp.includes(id))
                localStorage.setItem("smat-proj-stats", JSON.stringify([...temp, id]));
        } else {
            localStorage.setItem("smat-proj-stats", JSON.stringify([id]));
        }
    } else {
        temp = temp.filter(item => item !== id);
        localStorage.setItem("smat-proj-stats", JSON.stringify(temp));
    }
};
const projectReadyNotification = (id, name) => {
    $("#" + id + "-Loader").remove();
    $("#notificationNav").append('<div class="d-flex bg-success smat-rounded pl-1 pr-3  m-1 projectCreateLoader" id="' + id + '-Loader" style="display:none;"><div id="' + id + '-Spinner"><i class="far fa-times-circle fa-2x closeProjectLoader  my-2 mx-1 text-white " style="cursor:pointer;" title="close" value="' + id + '" ></i></div><div class="text-white smat-notification-text" id="' + id + '-LoaderText"><div class="mx-1 text-truncate" style="margin-top:5px;font-size:12px; opacity: 100%">Created project suceessfully<p class="m-0"> <b class="">' + name + "</b></p></div></div></div>");
};
export const checkIfNotificationSeen = () => {
    if (localStorage.getItem("smat-proj-stats")) {
        let tempArr = JSON.parse(localStorage.getItem("smat-proj-stats"));
        tempArr.map(el => {
            getProjectName(el).then(res => {
                if (res[0]) {
                    projectReadyNotification(el, res[0]["project_name"]);
                }
            });
        });
    }
};

checkIfNotificationSeen();
const makeRunningNotifcationForProject = (id, name) => {
    $("#notificationNav").append('<div class="d-flex bg-primary smat-rounded pl-1 pr-3  m-1 projectCreateLoader" id="' + id + '-Loader" style="display:none;"><div id="' + id + '-Spinner"><i class="fa fa-circle-o-notch donutSpinner mx-1 " aria-hidden="true" style="margin-top:7px;"></i></div><div class="text-white smat-notification-text" id="' + id + '-LoaderText"><div class="mx-1 text-truncate" style="margin-top:5px;font-size:12px; opacity: 100%">Creating Project <p class="m-0"> <b class="">' + name + "</b></p></div></div></div>");
};



$("body").on(
    "click",
    ".editBtnStoryAnalysis , .cancelEditAnalysisBtn ",
    function () {
        let editID = $(this).attr("value");
        $("#" + editID + "-edit").toggle();
        $("#" + editID + "-storyAnalysisMetadata").toggle();
    }
);

$("body").on("click", ".updateStoryAnalysisBtn", function () {
    let ID = $(this).attr("value");
    let updatedName = $("#" + ID + "-editableAnalysisName").val().trim();
    let updatedDesc = $("#" + ID + "-editableAnalysisDescription").val().trim();
    updateStoryAnalysis(ID, updatedName, updatedDesc).then(res => {
        if (res.error) {
            displayErrorMsg(ID + "-errorMsg", "error", res.error);
        } else {
            console.log(res);
            printStory(res.data[0].analysisID, res.data[0].analysisName, res.data[0].analysisDescription, baseUrl, res.data[0].created_at, ID + "-storyAnalysis", true).then(() => {
                displayErrorMsg(ID + "-errorMsg", "success", res.status);
            });
        }
    });
});

$("body").on("click", ".storyBtnProj", function () {
    let value = $(this).val();
    $("#storyContent").html("");

    $("#storyContentDiv").removeClass("confirmPanelCollapse");
    $("#storyContentDiv").addClass("confirmPanelExpand");
    let contentDiv = "storyContent";
    getStoryInfo(value).then(res => {
        $("#storyMetaDataName").text(res[0].storyName);
        $("#storyMetaDataCreatedOn").text(res[0].createdOn);
        $("#storyMetaDataDescription").text(res[0].storyDescription);
        getAllAnalysisUnderStory(value).then(response => {
            response.map(story => {
                printStory(story.analysisID, story.analysisName, story.analysisDescription, baseUrl, story.created_at, contentDiv);
            });
        });
    });
});

const printStory = async (analysisID, analysisName, analysisDescription, baseUrl, createdAt, div, toReplace = false) => {
    let editTableForm = null;
    let StoryOptionsBtns = null;
    editTableForm = '<div class="my-2" id="' + analysisID + '-edit" style="display:none;"><h3 class="m-0"><span class="text-dark">Edit</span><span>' + analysisName + '</span></h3><form class="analysisEditableForm"><div class="form-group" style="width:60%"><label class="font-weight-bold m-0 text-dark "for="' + analysisID + '-editableInput">AnalysisName</label><input class="form-controlborder" id="' + analysisID + '-editableAnalysisName" value="' + analysisName + '"/></div><div class="form-group" style="width:60%"><label class="font-weight-bold m-0 text-dark" for="' + analysisID + '-editableInput">AnalysisDescription</label><textarea class="form-control border" id="' + analysisID + '-editableAnalysisDescription" value="' + analysisDescription + '">' + analysisDescription + '</textarea></div></form><div><button class="btn btn-primary smat-rounded updateStoryAnalysisBtn" value="' + analysisID + '">Update</button><button class="btn btn-danger smat-rounded cancelEditAnalysisBtn" value="' + analysisID + '">Cancel</button></div></div>';
    StoryOptionsBtns = '<div class="ml-auto d-flex pt-2"><div class="mx-2 clickable editBtnStoryAnalysis" value="' + analysisID + '" title="Editanalysis"><i class="fas fa-edit"></i></div><div class="mx-2 clickable DeleteBtnStoryAnalysis" value="' + analysisID + '"title="Deleteanalysis"><i class="fas fa-trash-alt"></i></div></div>';
    let STORYDOM = '<div  class="border-top border-bottom" id="' + analysisID + '-storyAnalysis"><div class="p-2"id="' + analysisID + '-errorMsg"></div>' + editTableForm + '<div class="storyAnalysisMetadata" id="' + analysisID + '-storyAnalysisMetadata"><div class="d-flex" ><div><h5 class="font-weight-bold mb-0 mt-2">' + analysisName + "</h5></div>" + StoryOptionsBtns + '</div><div><p class="m-0">Created at:<span>' + createdAt + '</span></p></div><div><p class="m-0">' + analysisDescription + '</p></div></div><div class="storyAnalysisContent" style="overflow-x:hidden;"><img width="900"src="' + baseUrl + "/storage/plots/" + analysisID + '-plot.png"/></div></div>';
    if (toReplace) {
        $("#" + div).html(STORYDOM);
    } else {
        $("#" + div).append(STORYDOM);
    }
};
//_---------------------------------------------REPORT SCRIPT-------------------------------------//

const storyMakerDiv = "storyMakerDiv";
var isOptionOpenFor = null;
var storyElements = [],
    storyID = "58162b9d",
    offsetCounter = 0; //TODO::makeDYTNAMIC
const AddItemToStoryEditor = type => {
    offsetCounter = storyElements.length;
    const ID = offsetCounter + "-" + type + '-element';
    storyElements.push({
        type: type,
        text: null,
        style: null,
        id: ID,
        childrens: []
    });
    const storyBoradOptions = '<div class=" p-1 my-2 storyBoardOptions" id="' + offsetCounter + "-" + type + '-options" style="display:none; "><div class="py-1 px-2 storyOptions btn bg-danger  mx-1 text-white " title="Delete Element"><i class="fas fa-trash-alt"></i></div><div class="py-1 px-2 mx-1 storyOptions  addDescriptionToElement btn bg-dark text-white "   title="Add description" value="' + offsetCounter + '" type="description" parentType="' + type + '"><i class="fas fa-file-alt" ></i></div><div class="py-1 px-2 mx-1 storyOptions  addImageToElement btn bg-dark text-white "   title="Add Image" value="' + offsetCounter + '" type="image" parentType="' + type + '"><i class="fas fa-image"></i></div><div></div></div>';
    if (type === "title") {
        $("#" + storyMakerDiv).append(
            '<div class="smat-story-element-main bg-white"   value="' + offsetCounter + '" id="' + ID + '">' + storyBoradOptions + '<div class="text-center  smat-story-element" id="' + storyID + "-" + type + "-" + offsetCounter + '-input"  value="' + offsetCounter + '"type="' + type + '" ><input class="from-control  story-input titleStory text-center" value="Title" /></div></div>'
        );
    }
    if (type === "section") {
        $("#storyMakerDiv").append(
            '<div  class="smat-story-element-main bg-white"  value="' + offsetCounter + '"  id="' + ID + '" >' + storyBoradOptions + '<div  class="smat-story-element"   value="' + offsetCounter + '" type="' + type + '"  id="' + storyID + "-" + type +
            "-" + offsetCounter + '-input" ><input class=" sectionStory  w-100  story-input  text-left" value="Section"  id="' +
            storyID + "-" + type + "-" + offsetCounter + '-text"/></div></div>'
        );
    }
};
$("body").on("click", ".smat-story-element", function (e) {
    $(".storyBoardOptions").css("display", "none");
    $(".smat-story-element-main").removeClass("border-story-active");
    // $(this).parent().addClass('border-story-active')
    let id = $(this).attr("value") + "-" + $(this).attr("type") + "-options";
    $("#" + $(this).attr("value") + "-" + $(this).attr("type") + "-element").addClass("border-story-active");
    $("#" + id).css("display", "flex");
});
$(document).on("click", function (event) {
    if (!$(event.target).closest("#storyMakerDiv").length) {
        $(".storyBoardOptions").css("display", "none");
        $(".smat-story-element-main").removeClass("border-story-active");
    }
});

$("body").on("click", ".textElementStory", function () {
    AddItemToStoryEditor($(this).attr("value"));
});

$("body").on("click", "#saveStorybtnStory", function () {
    console.log("Story Buffer-->", storyElements);
});

$("body").on("input", ".story-input", function () {
    let offset = $(this).parent().attr("value");
    console.log(offset)
    storyElements[offset]["text"] = $(this).val();
});
$("body").on("input", ".story-description-input", function () {
    this.style.height = "";
    this.style.height = this.scrollHeight + "px";
    let offset = $(this).parent().attr("value");
    storyElements[offset]["text"] = $(this).val();
});
$("body").on("click", ".addDescriptionToElement", function () {
    const parentOffset = $(this).attr("value");
    const parentType = $(this).attr("parentType");
    const childType = $(this).attr("type");

    addChildrenToElement(parentOffset, childType, parentType);
});

$("body").on("click", ".addImageToElement", function () {
    let offset = $(this).attr("value");
    let type = $(this).attr("parenttype");
    showImages(storyID, offset, type);
});

const addChildrenToElement = async (parentOffset, childrenType, parentType = null, imageID) => {
    let length = 0;
    var AppendTo_ID = null;
    let offset, ID, object = {};

    if (parentType === "description" || parentType === "image") {
        let offset = parentOffset.split(/[-]/).filter(Boolean);
        length = storyElements[offset[0]]["childrens"].length;
        AppendTo_ID = offset[0] + "-" + offset[1] + "-" + parentType + "-element";
        offset = parentOffset + "-" + length;
        ID = offset + "-" + childrenType + '-element';
        object = {
            type: childrenType,
            text: null,
            style: null,
            id: ID,
            childrens: []
        };
        storyElements[offset[0]]["childrens"][offset[1]]["childrens"].push({
            ...object
        });
    } else {
        length = storyElements[parentOffset]["childrens"].length;
        AppendTo_ID = +parentOffset + "-" + parentType + "-element";
        offset = parentOffset + "-" + length;
        ID = offset + "-" + childrenType + '-element';
        object = {
            type: childrenType,
            text: null,
            style: null,
            id: ID,
            childrens: []
        };
        storyElements[parentOffset]["childrens"].push({
            ...object
        });
    }
    const userID = await getMe();

    const options = '<div class=" p-1 storyBoardOptions" id="' +
        offset + "-" + childrenType + '-options" style="display:none; "><div class=" px-2 storyOptions btn bg-danger text-white " title="Delete Element"><i class="fas fa-trash-alt"></i></div><div class="py-1 px-2 mx-1 storyOptions  addImageToElement btn bg-dark text-white "   title="Add Image" value="' + offset + '" type="image" parentType="' + childrenType +
        '"><i class="fas fa-image"></i></div><div></div></div>';
    if (childrenType === "description") {
        $("#" + AppendTo_ID).append(
            '<div class="smat-story-element-main bg-white"    id="' + ID + '"  value="' +
            offset + '">' + options + ' <div  class="smat-story-element d-flex"    value="' + offset + '" type="' + childrenType + '"    id="' + storyID + "-" + childrenType + "-" + offset + '" ><textarea class="story-description-input  w-100  text-left" value="' + offset + '"  id="' + storyID + "-" + childrenType + "-" + offset + '-text">Description</textarea></div><div>'
        );
    }
    if (childrenType === "image") {
        $("#" + AppendTo_ID).append(
            '<div class="smat-story-element-main bg-white" id="' + ID + '" value="' + offset + '" > ' + options + ' < div  class= "smat-story-element d-flex "    value = "' + offset + '" type = "' + childrenType + '"    id = "' + storyID + " - " + childrenType + " - " + offset + '" > <img ="storage/' + userID + " / " + storyID + " / plots / " + imageID + '" ></div ></div > '
        );
    }
};

const showImages = async (storyID, offset, type) => {
    const userID = await getMe();
    getPlotsFromServer(storyID, userID).then(res => {
        $("#storyImagesModal").modal("show");
        $("#storyPictures").html("");
        res.map(image => {
            $("#storyPictures").append(
                '<div class="p-2 text-center plotsDivStory"><img src="storage/' +
                userID + "/" + storyID + "/plots/" + image + '" /><div class="d-flex"><button class="btn btn-link addToStoryImageConfirm" value="' + offset + '" parentType="' + type + '" type="image"  imgID="' +
                image + '">Add to Story</button><button class="btn btn-link">View Picture</button></div></div>'
            );
        });
    });
};
const swapStoryElements = (current = null, prevElement = null, nextElement = null) => {

    nextElement = parseInt(nextElement);
    prevElement = parseInt(prevElement);
    let target = null
    current = parseInt(current);
    console.log(target, current);
    var tempArr = [];

    if (prevElement < current) {
        target = nextElement;
        console.log('Target:', target)
        for (let i = 0; i < storyElements.length; i++) {
            if (i <= current && i > target) {
                tempArr[i] = storyElements[i - 1];
            } else if (i == target) {
                tempArr[i] = storyElements[current];
            } else if (i <= current && i < target) {
                tempArr[i] = storyElements[i];
            }
            else {
                tempArr[i] = storyElements[i];
            }
        }
    } else {
        target = prevElement;
        for (let i = 0; i < storyElements.length; i++) {
            if (i >= current && i < target) {
                tempArr[i] = storyElements[i + 1];
            } else if (i == target) {
                tempArr[i] = storyElements[current];
            } else if (i >= current && i > target) {
                tempArr[i] = storyElements[i];
            }
            else {
                tempArr[i] = storyElements[i];
            }
        }
    }
    storyElements = tempArr;
    updateStoryDomElements();
};

$("#storyMakerDiv").sortable({
    containment: "parent",
    cursor: "grabbing",
    change: function (event, ui) {
        ui.placeholder.css({
            visibility: "visible",
            border: "3px solid #297EB4"
        });
    },
    update: function (ev, ui) {
        var currentSelected = ui.item.attr("value");
        var nextElementToWhereDragged = ui.item[0].nextElementSibling.getAttribute(
            "value"
        );
        var prevElementToWhereDragged = ui.item[0].previousElementSibling.getAttribute(
            "value"
        );
        swapStoryElements(currentSelected, prevElementToWhereDragged, nextElementToWhereDragged);
    }
});

$("body").on("click", ".addToStoryImageConfirm", function () {
    let offset = $(this).attr("value");
    let parentType = $(this).attr("parentType");
    let imgID = $(this).attr("imgID");
    let tempObj = { type: "image", text: null, style: null, image: imgID };
    addChildrenToElement(offset, tempObj, "image", parentType, imgID);
});

const get_tokens_wrt_pattern = (queries, pattern = null) => {
    var final_query_list = [];
    final_query_list = getDateRange(queries[1], queries[2]);
    final_query_list.push("i");
    if (pattern) {
        var query_list = queries[0].trim().match(pattern);
    } else {
        // var pattern = /#(\w+)|@(\w+)|\*(\w+)|\&|\||\!|\(|\)/g;
        var pattern = /#(\w+)|@(\w+)|\^(\w+)|\*(\w+)|\&|\||\!|\(|\)/g;
        var query_list = queries[0].trim().match(pattern);
    }
    return final_query_list.concat(query_list);
};


const updateStoryDomElements = () => {
    let counter = 0
    storyElements.forEach(element => {
        $('#' + element.id).attr('value', counter);
        counter += 1;
    })
}