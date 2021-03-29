


import { getMe } from "../home/helper.js";
import { getCurrentDate } from "../utilitiesJS/smatDate.js";
import { displayErrorMsg } from "../utilitiesJS/smatExtras.js";
import { getStoryObjFromServer, getPlotsFromServer, uploadStoryToServer, getProjectName } from "./helper.js";


const storyMakerDiv = "storyMakerDiv";
var storyElements = [], storyNameInput, storyCreatedAt = getCurrentDate(), offsetCounter = 0;
var UserId = null;
let storyDescription = '';


jQuery(async () => {
    UserId = await getMe().then(id => id);
    setupStoryView();
    if (storyID !== 'null') {
        getStoryObjFromServer(projectID, storyID, UserId).then(res => {
            $('#storyTitle').html('<h5>Modify your story ' + res.storyName + '</h5>')
            if (res.error) {
                alert('Some error occured')
            } else {
                $('#storyName').val(res.storyName);
                $('#storyDescription').val(res.storyDescription);
                storyNameInput = res.storyName;
                storyElements = res.elements;   
                storyDescription = res.storyDescription;
                let i = 0
                $('#storyMakerDiv').html('');
                storyElements.map(element => {
                    renderElementsToStoryDiv(i, element.id, element.type, element.image, element.text, element.style);
                    i += 1;
                })
            }
        });
    } else {

    }

});

const setupStoryView = () => {
    getProjectName(projectID).then(res => {
        if (res[0]) {
            $('#projectName').html(res[0]["project_name"])
        }
    });
    getPlotsFromServer(projectID, UserId).then(res => {
        res.map(image => {
            $("#storyPictures").append(
                '<div class="p-2 text-center project-images"  value="image" style="overflow:hidden;"  imgName="' + image + '" ><img src="storage/' +
                UserId + "/" + projectID + "/plots/" + image + '" / ></div>'
            );
        });
    });
}

const AddItemToStoryEditor = (type, imgObj = null) => {
    offsetCounter = storyElements.length;
    const ID = offsetCounter + "-" + type + '-element';
    storyElements.push({
        type: type,
        text: null,
        style: {
            align: 'left',
            bold: false,
            height:null,
            width:null
        },
        id: ID,
        image: {
            src: imgObj ? imgObj.src : null,
            height: imgObj ? imgObj.height : null,
            width: imgObj ? imgObj.width : null
        }
    });
    renderElementsToStoryDiv(offsetCounter, ID, type, imgObj, null);
};

const renderElementsToStoryDiv = (offset, ID, type, imgObj = null, text = null, style = null) => {
    style = style === null ? {
        align: 'left',
        bold: false
    } : style
    const resizableDOM = type === 'image' ? '<div class="form-group m-2"><div class="row"><div class="col-md-3"><div><label class="m-0">Image Height</label></div><input class="imageSize"  type="number" placeholder="Enter height of the image"   value="' + imgObj.height + '" sizeType="height" /></div><div class="col-md-3"><div><label class="m-0">Image Width</label></div><input class="imageSize"  type="number" placeholder="Enter width of the image" value="' + imgObj.width + '" sizeType="width"/></div></div></div>' : '';

    const storyBoradOptions = '<div class=" p-1 my-2 storyBoardOptions" id="' + offset + "-" + type + '-options" style="display:none; "><div class="py-1 px-2 storyOptions btn bg-danger  mx-1 text-white deleteElement " title="Delete Element"><i class="fas fa-trash-alt"></i></div><div class="py-1 px-2 storyOptions btn bg-dark  mx-1 text-white alignTextStory" value="left" title="Algin Left"><i class="fas fa-align-left"></i></div><div class="py-1 px-2 storyOptions btn bg-dark  mx-1 text-white alignTextStory" value="center" title="Algin Center"><i class="fas fa-align-center"></i></div><div class="py-1 px-2 storyOptions btn bg-dark  mx-1 text-white alignTextStory" value="right" title="Algin Right"><i class="fas fa-align-right"></i></div><div class="py-1 px-2 storyOptions btn bg-dark  mx-1 text-white alignTextStory" value="justify" title="Align Justify"><i class="fas fa-align-justify"></i></div><div></div> ' + resizableDOM + '</div>  ';
    if (text == null) {
        text = type.toUpperCase();
    }
    if (type === "title") {
        $("#" + storyMakerDiv).append(
            '<div class="smat-story-element-main bg-white "   value="' + offset + '" id="' + ID + '"   type="' + type + '"  style="margin-bottom:-8px">' + storyBoradOptions + '<div class="text-center  smat-story-element" ><input class="from-control  story-input titleStory text-' + style.align + '" value="' + text + '"/></div></div>'
        );
        $('#' + ID + ' .story-input').focus();

    }
    if (type === "section") {
        $("#storyMakerDiv").append(
            '<div  class="smat-story-element-main bg-white col-sm-10 p-0 offset-md-1"  value="' + offset + '"  id="' + ID + '" type="' + type + '"   >' + storyBoradOptions + '<div  class="smat-story-element"  ><input class=" sectionStory  w-100  story-input  text-' + style.align + '"  value="' + text + '"  /></div></div>'
        );
        $('#' + ID + ' .story-input').focus();

    }
    if (type === "description") {
        $("#storyMakerDiv").append(
            '<div  class="smat-story-element-main bg-white col-sm-10 p-0 offset-md-1"  value="' + offset + '"  id="' + ID + '" type="' + type + '"   >' + storyBoradOptions + '<div  class="smat-story-element"  key="' + ID + '"  ><p class="m-0 story-description-view  text-' + style.align + '"   id="' + ID + '-VIEW" key="' + ID + '">  ' + text + ' </p><textarea class="w-100  story-description-input  text-justify   " value="Description"  id="' + ID + '-EDIT" key="' + ID + '" style="display:none;min-height:30px;"  >' + text + '</textarea></div></div>'
        );
        $('#' + ID + ' .story-description-input').focus();
        let innerHeight = $('#' + ID + '-VIEW').height();
        console.log(innerHeight)
        $('#' + ID + '-EDIT').css('height', innerHeight + 'px');
    }

    if (type === 'image') {

        storyElements[offset]['image'] = imgObj;
        $("#storyMakerDiv").append(
            '<div class="smat-story-element-main bg-white" id="' + ID + '" value="' + offset + '" > ' + storyBoradOptions + '<div  class= "smat-story-element   text-' + style.align + ' " > <div><img class="story-image"  src="storage/' + UserId + "/" + projectID + "/plots/" + imgObj.src + '"  id="' + ID + '-VIEW"  style="height:' + imgObj.height + 'px;width:' + imgObj.width + 'px;"></div><textarea class="  text-' + style.align + ' w-100  story-description-input  " value="Description"  id="' +
            projectID + "-" + type + "-" + offset + '-text">' + text + '</textarea></div></div></div > '
        );


    }
    if (type === "space") {
        $("#" + storyMakerDiv).append(
            '<div class="smat-story-element-main bg-white"   value="' + offset + '" id="' + ID + '"   type="' + type + '">' + storyBoradOptions + '<div class="space-element  smat-story-element" id="' + ID + '-SPACE"  style="height:'+style.height+'px"></div></div>'
        );
        $('.space-element').resizable({
            resize:function(ev,ui){
                        let offset = ui.element[0].parentElement.attributes[1].nodeValue
                        storyElements[offset]['style']['height'] = ui.element[0].scrollHeight
                    }
        });
    }
}
$('body').on('click', '#insertSpaceBtn', function () {
    AddItemToStoryEditor('space')
})
$('body').on('click', '.textElementStory', function () {
    let type = $(this).attr('value');
    AddItemToStoryEditor(type);
})


$('body').on('click', '.deleteElement', function () {
    let offset = $(this).parent().parent().attr("value");
    $(this).parent().parent().remove();
    storyElements = storyElements.filter(element => element !== storyElements[offset]);
});
var recentlySelected = null;
$(document).on("click", function (event) {
    if (!$(event.target).closest("#storyMakerDiv").length) {
        $(".storyBoardOptions").css("display", "none");
        $(".smat-story-element-main").removeClass("border-story-active");
        if (recentlySelected !== null) {
            $('#' + recentlySelected + '-VIEW').css('display', 'block');
            $('#' + recentlySelected + '-EDIT').css('display', 'none');
        }
    }
});

$("body").on("click", ".smat-story-element", function (e) {
    $(".storyBoardOptions").css("display", "none");
    $('div').removeClass("border-story-active");
    if (recentlySelected !== null) {
        $('#' + recentlySelected + '-VIEW').css('display', 'block');
        $('#' + recentlySelected + '-EDIT').css('display', 'none');
    }
    let key = $(this).attr('key');
    recentlySelected = key;
    $('#' + key + '-VIEW').css('display', 'none');
    $('#' + key + '-EDIT').css('display', 'block');


    $(this).parent().addClass("border-story-active");
    $(this).parent().find(".storyBoardOptions").css("display", "block");
});
$('body').on('input', '.imageSize', function () {
    let offset = $(this).parent().parent().parent().parent().parent().attr("value");
    let originalID = storyElements[offset]['id'];
    let type = $(this).attr('sizeType');
    if (type === 'width') {
        storyElements[offset]['image']['width'] = $(this).val();
        $('#' + originalID + '-VIEW').css('width', $(this).val());
    }
    else if (type === 'height') {
        storyElements[offset]['image']['height'] = $(this).val();
        $('#' + originalID + '-VIEW').css('height', $(this).val());
    }
});


$('body').on('click', '.alignTextStory', function () {
    let alignType = $(this).attr('value');
    let offset = $(this).parent().parent().attr("value");
    let originalID = storyElements[offset]['id'];
    let elementType = storyElements[offset]['type'];
    storyElements[offset]['style']['align'] = alignType;
    if (elementType === 'title' || elementType === 'section') {
        $('#' + originalID).find('.story-input').removeClass('text-center text-left text-right');
        $('#' + originalID).find('.story-input').addClass('text-' + alignType);
    }
    else if (elementType === 'description') {
        $('#' + originalID).find('.story-description-input').removeClass('text-center text-left text-right text-justify');
        $('#' + originalID).find('.story-description-view').removeClass('text-center text-left text-right text-justify');
        $('#' + originalID).find('.story-description-view').addClass('text-' + alignType);
        $('#' + originalID).find('.story-description-input').addClass('text-' + alignType);
    } else if (elementType === 'image') {
        $('#' + originalID).find('.smat-story-element').removeClass('text-center text-left text-right');
        $('#' + originalID).find('.smat-story-element').addClass('text-' + alignType);
        $('#' + originalID).find('.story-description-input').removeClass('text-center text-left text-right');
        $('#' + originalID).find('.story-description-input').addClass('text-' + alignType);
    }

});


$("body").on('input', '#storyName', function () {
    storyNameInput = $(this).val().trim();

});


const getMeta = (url, callback) => {
    var img = new Image();
    img.src = url;
    img.onload = function () { callback(this.width, this.height); }
}
$("body").on("click", ".project-images", async function () {
    let imgName = $(this).attr('imgName') ? $(this).attr('imgName') : null;
    let height = 0;
    let width = 0;
    var img = new Image();
    img.src = 'storage/' + UserId + "/" + projectID + "/plots/" + imgName;
    img.onload = function () { return this.width }
    let imgObj = {
        src: imgName,
        height: img.height,
        width: img.width
    }
    $('#storyImagesModal').modal('hide');
    AddItemToStoryEditor($(this).attr("value"), imgObj);
});

$('body').on('input', '#storyDescription', function () {

    storyDescription = $(this).val().trim();
})

$("body").on("click", "#saveStorybtnStory", function () {

    if (storyNameInput) {
        if (storyElements.length > 0) {
            let storyObj = {
                storyName: storyNameInput,
                createdAt: storyCreatedAt,
                storyDescription: storyDescription,
                elements: storyElements
            }
            saveStoryToServer(projectID, storyNameInput, storyObj, storyDescription, storyID);
        } else {
            alert('Please enter some elements');

        }
    } else {
        alert('Please enter story name.');
    }
});
const saveStoryToServer = (projectID, storyNameInput, storyObj, storyDescription, key) => {
    getMe().then(id => {
        uploadStoryToServer(projectID, storyNameInput, storyDescription, storyObj, id, key).then(res => {
            if (res.error) {
                displayErrorMsg('storyCreateErrorMsg', 'error', 'Some error occured!');
            } else {
                storyID = res.key;
                displayErrorMsg('storyCreateErrorMsg', 'success', 'Saved successfully!');

            }
        });
    })
}
$("body").on("input", ".story-input", function () {
    let offset = $(this).parent().parent().attr("value");
    storyElements[offset]["text"] = $(this).val();
});

$("body").on("input", ".story-description-input", function () {
    this.style.height = "";
    this.style.height = this.scrollHeight + "px";
    let key = $(this).attr('key');
    $('#' + key + '-VIEW').html($(this).val())
    let offset = $(this).parent().parent().attr("value");
    storyElements[offset]["text"] = $(this).val();
});


const swapStoryElements = (current = null, prevElement = null, nextElement = null) => {
    let tempArr = [];
    let cloneOriginal = storyElements;
    var target = null;
    if (prevElement === null) {
        tempArr[0] = storyElements[current];
        storyElements.map(element => element !== storyElements[current] && tempArr.push(element))
    } else if (nextElement === null) {
        storyElements.map(element => element !== storyElements[current] && tempArr.push(element))
        tempArr[storyElements.length - 1] = storyElements[current];
    } else {
        target = prevElement + 1;
        var tempL = cloneOriginal.slice(0, target)
        var tempR = cloneOriginal.slice(target);
        tempL.map(element => element !== storyElements[current] && tempArr.push(element));
        tempArr.push(storyElements[current]);
        tempR.map(element => element !== storyElements[current] && tempArr.push(element));
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
        var currentSelected = parseInt(ui.item.attr("value"));
        var nextElementToWhereDragged = ui.item[0].nextElementSibling ? parseInt(ui.item[0].nextElementSibling.getAttribute("value")) : null
        var prevElementToWhereDragged = ui.item[0].previousElementSibling ? parseInt(ui.item[0].previousElementSibling.getAttribute("value")) : null
        swapStoryElements(currentSelected, prevElementToWhereDragged, nextElementToWhereDragged);
    }
});


const updateStoryDomElements = () => {
    let counter = 0
    var allDiv = document.querySelectorAll('storyMakerDiv');
    allDiv.forEach(function (item, i) {
        item.setAttribute('value', 'FCV');
    });
    storyElements.map(async element => {
        if (element) {
            let newID = counter + '-' + element.type + '-element';
            let targetID = '#' + element.id;
            $(targetID).attr("value", counter);
            counter += 1;
        }
    })
}




$('body').on('click', '#download-pdf', function () {
    var w = $("#storyMakerDiv").innerWidth();
    var h = $("#storyMakerDiv").innerHeight();
    document.getElementById("storyMakerDiv").style.height = "auto";
    var doc = new jsPDF('p', 'px', [w, h]);
    html2canvas(document.getElementById("storyMakerDiv"), {
        dpi: 300, // Set to 300 DPI
        scale: 3
    }).then(function (canvas) {
        var img = canvas.toDataURL("image/jpeg", 1);
        doc.addImage(img, 'JPEG', 0, 0, w * 0.5, h * 0.5, "a", "FAST");
        doc.save('f.pdf');
    });
});


$('body').on('click', '#insertImageBtn', function () {
    $('#storyImagesModal').modal('show');
});

$('body').on('click', '#upload-image-btn', function () {
    $('#image-upload').click();
});

$('#image-upload').on('change', function () {
    if (this.files && this.files[0]) {
        var img = document.querySelector('img');
        img.onload = () => {
            URL.revokeObjectURL(img.src);  // no longer needed, free memory
        }
        var reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        reader.onloadend = function () {
            var base64data = reader.result;
            _APICALLFORCAPTURE(projectID, base64data).then(res => {
                if (res.error) {
                    alert('Some error occured!');
                } else {
                    alert('Uploaded SuccessFully!');
                    $("#storyPictures").html('');
                    getPlotsFromServer(projectID, UserId).then(res => {
                        res.map(image => {
                            $("#storyPictures").append(
                                '<div class="p-2 text-center project-images"  value="image" style="overflow:hidden;"  imgName="' + image + '" ><img src="storage/' +
                                UserId + "/" + projectID + "/plots/" + image + '" / ></div>'
                            );
                        });
                    });
                }
            });

        }
    }
});

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


$('#seeResultBtn').on('click',function(){
    window.open('storyViewer?projectID='+projectID+'&storyID='+storyID);
})