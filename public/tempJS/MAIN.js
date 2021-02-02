import { getMe } from "./home/helper.js";
import { checkIfNotificationSeen } from "./project/smatProject.js";
import { getCurrentDate } from "./utilitiesJS/smatDate.js";
import { displayErrorMsg } from "./utilitiesJS/smatExtras.js";
var _PROJECTID = null;

getMe();
checkIfNotificationSeen();



if (_MODE !== 'HOME') {
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
var base64URL = null, STORYID = localStorage.getItem('smatStoryID') ? localStorage.getItem('smatStoryID') : null, STORYNAME;
$('body').on('click', '.addToStory', function () {
    let value = $(this).attr('value');

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
    });
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
    $('#storyPlot').html('')
    populateStories();
    $('#storyAnalysisDiv').css('display','block');
    $('#addToStoryModal').modal('show');
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

const _APICALLFORSTORYUPLOAD = (storyID, storyName, analysisName, analysisDesc, base64URL) => {
    $.ajax({
        url: 'uploadStoryContent',
        type: 'post',
        data: { storyID, storyName, analysisName, analysisDesc, image: base64URL },
        success: function (response) {
            if (response.error) {
                displayErrorMsg('storyMsgDiv', 'error', response.error);
                alert(response.error);
            } else {
                alert('Saved successfully!')
                base64URL = null;
                $('#storyAnalysisDiv').css('display','none');
                displayErrorMsg('storyMsgDiv', 'success', response.data);
            }
        }
    });
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