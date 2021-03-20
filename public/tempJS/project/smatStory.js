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
            console.log(res);
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
                    renderElementsToStoryDiv(i, element.id, element.type, element.image, element.text,element.style);
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
            $(".story-images").append(
                '<div class="p-2 text-center   textElementStory"  value="image" style="overflow:hidden;"  imgName="' + image + '" ><img src="storage/' +
                7 + "/" + projectID + "/plots/" + image + '" / style="width:300px;"></div>'
            );
        });
    });
}

const AddItemToStoryEditor = (type, imgName = null) => {
    offsetCounter = storyElements.length;
    const ID = offsetCounter + "-" + type + '-element';
    storyElements.push({
        type: type,
        text: null,
        style: {
            align: 'left',
            bold: false
        },
        id: ID,
        image: null
    });
    renderElementsToStoryDiv(offsetCounter, ID, type, imgName, null);
};

const renderElementsToStoryDiv = (offset, ID, type, imgName = null, text = null,style=null) => {
    style = style === null ? { 
        align : 'left',
        bold :false
    } : style
    const storyBoradOptions = '<div class=" p-1 my-2 storyBoardOptions" id="' + offset + "-" + type + '-options" style="display:none; "><div class="py-1 px-2 storyOptions btn bg-danger  mx-1 text-white deleteElement " title="Delete Element"><i class="fas fa-trash-alt"></i></div><div class="py-1 px-2 storyOptions btn bg-dark  mx-1 text-white alignTextStory" value="left" title="Algin Left"><i class="fas fa-align-left"></i></div><div class="py-1 px-2 storyOptions btn bg-dark  mx-1 text-white alignTextStory" value="center" title="Algin Center"><i class="fas fa-align-center"></i></div><div class="py-1 px-2 storyOptions btn bg-dark  mx-1 text-white alignTextStory" value="right" title="Algin Right"><i class="fas fa-align-right"></i></div><div></div></div>';
    if (text == null) {
        text = type.toUpperCase();
    }
    if (type === "title") {
        $("#" + storyMakerDiv).append(
            '<div class="smat-story-element-main bg-white"   value="' + offset + '" id="' + ID + '"   type="' + type + '"  >' + storyBoradOptions + '<div class="text-center  smat-story-element" ><input class="from-control  story-input titleStory text-'+style.align+'" value="' + text + '"/></div></div>'
        );
        $('#' + ID + ' .story-input').focus();

    }
    if (type === "section") {
        $("#storyMakerDiv").append(
            '<div  class="smat-story-element-main bg-white"  value="' + offset + '"  id="' + ID + '" type="' + type + '"   >' + storyBoradOptions + '<div  class="smat-story-element"  ><input class=" sectionStory  w-100  story-input  text-'+style.align+'"  value="' + text + '"  /></div></div>'
        );
        $('#' + ID + ' .story-input').focus();

    }
    if (type === "description") {
        $("#storyMakerDiv").append(
            '<div  class="smat-story-element-main bg-white"  value="' + offset + '"  id="' + ID + '" type="' + type + '"   >' + storyBoradOptions + '<div  class="smat-story-element"   ><textarea class="   w-100  story-description-input  text-'+style.align+'" value="Description"  id="' +
            projectID + "-" + type + "-" + offset + '-text"> ' + text + '</textarea></div></div>'
        );
        $('#' + ID + ' .story-description-input').focus();
        let innerHeight =  document.getElementById(ID).getElementsByClassName( 'story-description-input')[0].scrollHeight;
        $('#' + ID).find('textarea').css('height',innerHeight+'px');
    }
    if (type === 'image') {
        storyElements[offset]['image'] = imgName;
        $("#storyMakerDiv").append(
            '<div class="smat-story-element-main bg-white" id="' + ID + '" value="' + offset + '" > ' + storyBoradOptions + '<div  class= "smat-story-element   text-'+style.align+' " > <img  src="storage/' + UserId + "/" + projectID + "/plots/" + imgName + '" >  <textarea class="  text-'+style.align+'   w-100  story-description-input  " value="Description"  id="' +
            projectID + "-" + type + "-" + offset + '-text"> ' + text + '</textarea></div></div></div > '
        );
    }
}
$('body').on('click', '.deleteElement', function () {
    let offset = $(this).parent().parent().attr("value");
    $(this).parent().parent().remove();
    storyElements = storyElements.filter(element => element !== storyElements[offset]);
});


$("body").on("click", ".smat-story-element", function (e) {
    $(".storyBoardOptions").css("display", "none");
    $('div').removeClass("border-story-active");
    $(this).parent().addClass("border-story-active");
    $(this).parent().find(".storyBoardOptions").css("display", "flex");
});

$('body').on('click', '.alignTextStory', function () {
    let alignType = $(this).attr('value');
    let offset = $(this).parent().parent().attr("value");
    let originalID = storyElements[offset]['id'];
    let elementType = storyElements[offset]['type'];
    storyElements[offset]['style']['align'] = alignType;
    if(elementType==='title' || elementType==='section'){
        $('#'+originalID).find('.story-input').removeClass('text-center text-left text-right');
        $('#'+originalID).find('.story-input').addClass('text-'+alignType);
    }
    else if(elementType==='description'){
        $('#'+originalID).find('.story-description-input').removeClass('text-center text-left text-right');
        $('#'+originalID).find('.story-description-input').addClass('text-'+alignType);
    }else if(elementType==='image'){
        $('#'+originalID).find('.smat-story-element').removeClass('text-center text-left text-right');
        $('#'+originalID).find('.smat-story-element').addClass('text-'+alignType);
        $('#'+originalID).find('.story-description-input').removeClass('text-center text-left text-right');
        $('#'+originalID).find('.story-description-input').addClass('text-'+alignType);
    }
    
});


$("body").on('input', '#storyName', function () {
    storyNameInput = $(this).val().trim();
});

$(document).on("click", function (event) {
    if (!$(event.target).closest("#storyMakerDiv").length) {
        $(".storyBoardOptions").css("display", "none");
        $(".smat-story-element-main").removeClass("border-story-active");
    }
});

$("body").on("click", ".textElementStory", function () {
    let imgName = $(this).attr('imgName') ? $(this).attr('imgName') : null
    AddItemToStoryEditor($(this).attr("value"), imgName);
});

$('body').on('input','#storyDescription',function(){
    storyDescription = $(this).val().trim();
})

$("body").on("click", "#saveStorybtnStory", function () {

    if (storyNameInput) {
        if (storyElements.length > 0) {
            let storyObj = {
                storyName: storyNameInput,
                createdAt: storyCreatedAt,
                storyDescription : storyDescription,
                elements: storyElements
            }
            saveStoryToServer(projectID, storyNameInput, storyObj,storyDescription,storyID);
        } else {
            alert('Please enter some elements');

        }
    } else {
        alert('Please enter story name.');
    }
});
const saveStoryToServer = (projectID, storyNameInput, storyObj ,storyDescription ,key ) => {
    getMe().then(id => {
        uploadStoryToServer(projectID, storyNameInput,storyDescription, storyObj, id ,key).then(res => {
            if (res.error) {
                displayErrorMsg('storyCreateErrorMsg', 'error', 'Some error occured!');
            } else {
                storyID=res.key;
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