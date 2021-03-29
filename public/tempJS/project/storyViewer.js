import { getMe } from "../home/helper.js";
import { getCurrentDate } from "../utilitiesJS/smatDate.js";
import { getStoryObjFromServer, getPlotsFromServer, uploadStoryToServer, getProjectName } from "./helper.js";

const storyMakerDiv = "storyViewer";
var storyElements = [], storyNameInput, storyCreatedAt = getCurrentDate(), offsetCounter = 0;
var UserId = null;
let storyDescription = '';



jQuery(async () => {
    UserId = await getMe().then(id => id);
    // setupStoryView();
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
                $('#storyViewer').html('');
                storyElements.map(element => {
                    renderElementsToStoryDiv(i, element.id, element.type, element.image, element.text, element.style);
                    i += 1;
                })
            }
        });
    } else {

    }

});

const renderElementsToStoryDiv = (offset, ID, type, imgObj = null, text = null, style = null) => {
    style = style === null ? {
        align: 'left',
        bold: false
    } : style
    const resizableDOM = type === 'image' ? '<div class="form-group m-2"><div class="row"><div class="col-md-3"><div><label class="m-0">Image Height</label></div><input class="imageSize"  type="number" placeholder="Enter height of the image"   value="' + imgObj.height + '" sizeType="height" /></div><div class="col-md-3"><div><label class="m-0">Image Width</label></div><input class="imageSize"  type="number" placeholder="Enter width of the image" value="' + imgObj.width + '" sizeType="width"/></div></div></div>' : '';


    if (text == null) {
        text = type.toUpperCase();
    }
    if (type === "title") {
        $("#" + storyMakerDiv).append(
            '<div class="smat-story-element-main bg-white"   value="' + offset + '" id="' + ID + '"   type="' + type + '"  style="margin-bottom:-8px"><div class="text-center  smat-story-element" ><input class="from-control  story-input titleStory text-' + style.align + '" value="' + text + '" readonly/></div></div>'
        );
        $('#' + ID + ' .story-input').focus();

    }
    if (type === "section") {
        $("#" + storyMakerDiv).append(
            '<div  class="smat-story-element-main bg-white  col-sm-10 p-0 offset-md-1 "  value="' + offset + '"  id="' + ID + '" type="' + type + '"   ><div  class="smat-story-element"  ><input class=" sectionStory  w-100  story-input  text-' + style.align + '"  value="' + text + '" readonly  /></div></div>'
        );
        $('#' + ID + ' .story-input').focus();

    }
    if (type === "description") {
        $("#" + storyMakerDiv).append(
            '<div  class="smat-story-element-main bg-white  col-sm-10 p-0 offset-md-1"  value="' + offset + '"  id="' + ID + '" type="' + type + '"   ><div  class="smat-story-element"  key="' + ID + '"  ><p class="m-0 story-description-view text-' + style.align + '"   id="' + ID + '-VIEW" key="' + ID + '">  ' + text + ' </p></div></div>'
        );
        $('#' + ID + ' .story-description-input').focus();
        let innerHeight = $('#' + ID + '-VIEW').height();
       
        $('#' + ID + '-EDIT').css('height', innerHeight + 'px');
    }

    if (type === 'image') {

        storyElements[offset]['image'] = imgObj;
        $("#" + storyMakerDiv).append(
            '<div class="smat-story-element-main bg-white" id="' + ID + '" value="' + offset + '" > <div  class= "smat-story-element   text-' + style.align + ' " > <div><img class="story-image"  src="storage/' + UserId + "/" + projectID + "/plots/" + imgObj.src + '"  id="' + ID + '-VIEW"  style="height:' + imgObj.height + 'px;width:' + imgObj.width + 'px;"></div><div class="  text-' + style.align + 'w-100  story-description-input  " value="Description"  id="' +
            projectID + "-" + type + "-" + offset + '-text">' + text + '</div></div></div></div > '
        );


    }
    if (type === "space") {
        $("#" + storyMakerDiv).append(
            '<div class="smat-story-element-main bg-white"   value="' + offset + '" id="' + ID + '"   type="' + type + '"><div class="space-element  smat-story-element" id="' + ID + '-SPACE"  style="height:'+style.height+'px"></div></div>'
        );
      
    }
}