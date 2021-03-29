import { getMe } from "./home/helper.js";
import { getAllProject, getProjectName } from "./project/helper.js";
import { getCurrentDate } from "./utilitiesJS/smatDate.js";
import { displayErrorMsg } from "./utilitiesJS/smatExtras.js";
var _PROJECTID = null;

getMe().then(id => {
    populateProjectsForUser(id)
});

if (localStorage.getItem('sideBarState')) {
    let state = localStorage.getItem('sideBarState');
    if (state === 'show')
        $('#wrapper').toggleClass('toggled');
} else {
    localStorage.setItem('sideBarState', 'show')
}


const projectReadyNotification = (id, name) => {
    $("#" + id + "-Loader").remove();
    $("#notificationNav").append(
        '<div class="d-flex bg-success smat-rounded pl-1 pr-3  m-1 projectCreateLoader" id="' +
        id +
        '-Loader" style="display:none;"><div id="' +
        id +
        '-Spinner"><i class="far fa-times-circle fa-2x closeProjectLoader  my-2 mx-1 text-white " style="cursor:pointer;" title="close" value="' +
        id +
        '" ></i></div><div class="text-white smat-notification-text" id="' +
        id +
        '-LoaderText"><div class="mx-1 text-truncate" style="margin-top:5px;font-size:12px; opacity: 100%">Created project suceessfully<p class="m-0"> <b class="">' +
        name +
        "</b></p></div></div></div>"
    );
};
const checkIfNotificationSeen = () => {
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

if (!window.location.pathname.includes('home') && !window.location.pathname.includes('story')) {
    if (localStorage.getItem('projectMetaData')) {
        let metaData = JSON.parse(localStorage.getItem('projectMetaData'));
        $('#projNav').fadeIn('slow')
        _PROJECTID = metaData['projectMetaData']['project_id'];
        $('#ProjectNameStory').text(metaData['projectMetaData']['project_name']);
        $('#projNavName').text(metaData['projectMetaData']['project_name']);
        $('#projNavCreatedOn').text(metaData['projectMetaData']['project_creation_date']);
        $('#projNavDescription').text(metaData['projectMetaData']['project_description']);
    }
}
// $('#addToStoryModal').modal('show');
//  STORYID = localStorage.getItem('smatStoryID') ? localStorage.getItem('smatStoryID') : null, STORYNAME;
$('body').on('click', '.addToStory', function () {
    let value = $(this).attr('value');
    var base64URL = null;
    window.scrollTo(0, 0)
    let offset = 30, zoomLevel;
    var screenCssPixelRatio = (window.outerWidth - 8) / window.innerWidth;
    if (screenCssPixelRatio >= .46 && screenCssPixelRatio <= .54) {
        zoomLevel = "-4";
        offset = 40;
    } else if (screenCssPixelRatio <= .64) {
        zoomLevel = "-3";
        offset = 18;
    } else if (screenCssPixelRatio <= .76) {
        zoomLevel = "-2";
        offset = 15;
    } else if (screenCssPixelRatio <= .92) {
        zoomLevel = "-1";
        offset = 10;
    } else if (screenCssPixelRatio <= 1.10) {
        zoomLevel = "0";
        offset = 15;
    } else if (screenCssPixelRatio <= 1.32) {
        zoomLevel = "1";
    } else if (screenCssPixelRatio <= 1.58) {
        zoomLevel = "2";
    } else if (screenCssPixelRatio <= 1.90) {
        zoomLevel = "3";
    } else if (screenCssPixelRatio <= 2.28) {
        zoomLevel = "4";
    } else if (screenCssPixelRatio <= 2.70) {
        zoomLevel = "5";
    } else {
        zoomLevel = "unknown";
    }
    html2canvas(document.getElementById(value), {
        allowTaint: true,
        useCORS: true,
        logging: false,
        height: $("#" + value).height() + offset,
        width: $("#" + value).innerWidth() + 100,
        windowHeight: $("#" + value).parent().parent().height(),
        scrollY: -window.scrollY
    }).then(canvas => {
        document
            .getElementById('storyPlot')
            .appendChild(canvas);
        base64URL = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        _APICALLFORCAPTURE(_PROJECTID, base64URL).then(res => {
            if (res.error) {
                alert('Some error occured!');
            } else {
                alert('Uploaded SuccessFully!')
            }
        });
    });

    // $('#storyPlot').html('')
    // populateStories();
    // $('#storyAnalysisDiv').css('display','block');
    // $('#addToStoryModal').modal('show');
})
$('#createStory').on('click', function () {
    $('#createStoryFormDIV').toggle();
})


$('#storyUploadForm').on('submit', function (e) {
    e.preventDefault();
    let analysisName = $('#analysisNameInput').val();
    let analysisDescription = $('#analysisDescription').val().trim();
    if (STORYID && STORYNAME) {
        _APICALLFORSTORYUPLOAD(STORYID, STORYNAME, analysisName, analysisDescription, base64URL);

    } else {
        displayErrorMsg('storyMsgDiv', 'error', 'Please select a story');
    }
});

var isClearToMakeStory = 0;
$('#createStoryForm').on('submit', function (e) {
    e.preventDefault();
    let storyName = $('#storyNameInput').val().trim();
    let projectID = _PROJECTID;
    if (isClearToMakeStory === 0) {
        _CREATESTORYAPI(storyName, projectID, $('#createStoryDescription').val().trim(), getCurrentDate()).then(res => {
            if (res.data) {
                displayErrorMsg('storyMsgDiv', 'success', res.data);
                populateStories();
                $('#storyNameInput').val('');
            }
        });
    } else {
        displayErrorMsg('storyMsgDiv', 'error', 'Please use a different name for your story.');
    }

});
$('body').on('click', '.storySelRadio', function () {
    let arr = $(this).attr('value').split(/[|]/).filter(Boolean);
    STORYID = arr[0];
    STORYNAME = arr[1];
    localStorage.setItem('smatStoryID', STORYID);
});

$('#storyNameInput').on('input', function () {
    _CHECK_IF_STORY_ALREADY_EXISTS($(this).val().trim(), _PROJECTID).then(res => {
        if (res == '1') {
            isClearToMakeStory = 1;
            displayErrorMsg('storyMsgDiv', 'error', 'Name already exists.Please use a different name');
        } else {
            isClearToMakeStory = 0;
        }
    })
})



const _CHECK_IF_STORY_ALREADY_EXISTS = async (storyName, projectID) => {
    let response = await fetch(`checkIfStoryExists/${projectID}/${storyName}`, {
        method: 'get',
    });
    let data = await response.text();
    return data;
}

const _CREATESTORYAPI = async (storyName, projectID, storyDescription, createdOn) => {
    let response = await fetch('createNewStory', {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        body: JSON.stringify({
            storyName, projectID, storyDescription, createdOn
        })
    });
    let data = await response.json();
    return data;
}



const _APICALLFORCAPTURE = async (projectID, base64URL) => {
    const userID = await getMe();
    let response = await fetch('uploadStoryContent', {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        body: JSON.stringify({
            projectID, image: base64URL, userID
        })
    });
    let data = await response.json();
    return data;
}
const _getAllStoriesFromProject = async (projectID) => {
    let response = await fetch(`getStories/${projectID}`, {
        method: 'get',
    });
    let data = await response.json();
    return data;
}
const populateStories = () => {
    console.log('populating stories...')
    $("#listOfStories").html('');
    _getAllStoriesFromProject(_PROJECTID).then(response => {
        if (response.length < 1) {
            $("#listOfStories").html('Please create a story to add.');
        } else {
            response.forEach(element => {
                let checked = ''
                let storyNametemp = element.storyName;
                let storyIDtemp = element.storyID;
                if (STORYID == storyIDtemp) {
                    STORYNAME = storyNametemp;
                    checked = 'checked'
                }
                let projectID = element.projectID;
                let div1 = `<div class="border m-1 p-1" id="` + storyIDtemp + `-projSelection"><div class="custom-control custom-radio">
            <input type="radio"  name="storySelectRadios" class="custom-control-input storySelRadio"  id="` + storyIDtemp + `-radio" value="` + storyIDtemp + `|` + storyNametemp + `|` + projectID + `" ` + checked + `>
            <label class="custom-control-label" for="` + storyIDtemp + `-radio" ><b>` + storyNametemp + `</b></label>
          </div><div class="d-flex"><div class="mr-2"> created on: ` + element.createdOn + `</div> | <div class="ml-2 projDeleteBtn text-danger clickable" value=` + storyIDtemp + ` > Delete </div></div></div>`;
                $("#listOfStories").append(div1);
            });
        }
    });
}
$("#toggleSideBar , .toggleSideBar").on('click', function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    if (localStorage.getItem('sideBarState')) {
        let state = localStorage.getItem('sideBarState');
        if (state === 'hide') {
            localStorage.setItem('sideBarState', 'show')
        } else {
            localStorage.setItem('sideBarState', 'hide')
        }
    } else {
        localStorage.setItem('sideBarState', 'show')
    }
});

$('body').on('click', '#deactivateProject', async function () {
    localStorage.removeItem('projectMetaData');
    location.reload();
});



function populateProjectsForUser(userID) {
    let projectID = null;
    if (localStorage.getItem('projectMetaData')) {
        let metaData = JSON.parse(localStorage.getItem('projectMetaData'));
        projectID = metaData['projectMetaData']['project_id'];
    }
    let createStoryBtnDOM = ''
    getAllProject(userID).then(res => {
        $('#numOfProjects').text(res.length)
        if (!res) {
            $('#projectsDiv').css('display', 'none');
            $("#projects-created").html('<div class="mx-3">No projects created</div>')
        }
        else {
            res.map(project => {
                $('#smat-project-list').append(`<div class="p-2 border-bottom project-list-item" title="Click to switch project" value="${project.project_id}"><h6 class="font-weight-bold m-0" > ${project.project_name} </h6><div class="text-muted">created on: ${project.project_creation_date}</div>${projectID === project.project_id ? 'Active <i class="fas fa-circle text-success"></i>' : ''}</div>`)
            })
        }
    });
}



$('body').on('click', '.project-list-item', function () {
    let id = $(this).attr('value');
    window.location.href = `project?projectID=${id}`;
})