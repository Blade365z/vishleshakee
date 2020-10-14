/*
This scripts contains the logic for the Social Media Analysis Tool's configurations or  its enviroment  parameters mainly for the business logic paradigm of the tool.
Written by:
Amitabh Boruah , Mala Das
*/

//imports 
import { getDatabaseEnvParameters, getCrawlerList, addTrackToDb ,updateStatusToDB ,updateTrackWordInDb ,deletefromCrawlList} from './helper.js';

//globals
var dbNodes = [], dbUser, dbPass, dbKeyspace, appURL;
var changeFlag = 0, totalNodes = 0, lastIDofTrackWords;
//logic starts here
jQuery(function () {
    generateCrawlerList('track', 'hashtag');
    getDatabaseEnvParameters().then(response => {
        dbUser = response['dbUser'];
        dbPass = response['dbPass'];
        dbNodes = fromStringCommaSplit(response['dbNodes']);
        totalNodes = dbNodes.length - 1;
        dbKeyspace = fromStringCommaSplit(response['dbKeyspace']);
        appURL = response['appUrl'];
        updateFormValues(appURL, dbUser, dbPass, dbNodes, dbKeyspace);
    });
    $('body').on('click','div .crawlListRadio',function(){
        let type=$(this).attr('value');
        let option=$(this).attr('source');
        $('.crawlListRadio').prop('checked',false);
        $(this).prop('checked',true);
generateCrawlerList(type,option);
    });
    $('body').on('click', 'div #addTrackWordBtn', function () {
        $('#addTrackWordsModal').modal('show');
    });
    let currentlySelected = 'track';
    $('body').on('click', 'div .addToListCheck', function () {
        $('.addToListCheck').prop('checked', false);
        $(this).prop('checked', true);
        let type = $(this).attr('value');
        if (type === 'user') {
            currentlySelected = 'user';
            $('#trackWordHandle').css('display', 'block')
            $('#trackWordHandleInput').prop('required', true)
        } else {
            currentlySelected = 'track';
            $('#trackWordHandle').css('display', 'none')
            $('#trackWordHandleInput').prop('required', false)
        }
    });
    $('body').on('click', 'div #addTrackConfirm', function () {
        let handle = 'NULL', trackWord = '', type = '';
        trackWord = $('#trackWordID').val();
        currentlySelected === 'track' ? handle = 'NULL' : handle = $('#trackWordHandleInput').val();
        type = currentlySelected;
        addToCrawlerListTable(lastIDofTrackWords, trackWord, type, 0, handle);
        lastIDofTrackWords += 1;
        addTrackToDb(lastIDofTrackWords, trackWord, type, handle, 0);
        $('.modal').modal('hide');
    });
    $('body').on('click', 'div #addNodeBtn', function () {
        $('#addNodeModal').modal('show');
    });
    $('body').on('click', 'div .cancelBtn', function () {
        $('.configModalInput').val('');
        $('.modal').modal('hide');
    });
    $('body').on('click','div .istrackEnabled',function(){
        let arg='',source='';
        
        if($(this).prop('checked',true)){
            arg=$(this).attr('value');
            source = $(this).attr('source');
            source = source.split(/[|]/).filter(Boolean);
        }
        $('.statusRadio-'+source[0]).prop('checked',false);
        $(this).prop('checked',true);
        updateStatusToDB(source[0],arg);
    });
    $('body').on('click', 'div #AddConfirm', function () {
        let nodeIP = $('#nodeIP').val();
        $('#nodeIP').val('');
        totalNodes += 1;
        printNodes(nodeIP, totalNodes, '--')
        $('#addNodeModal').modal('hide');
        dbNodes[totalNodes] = nodeIP;
    });

    $('body').on('click', 'div .editNodeBtn', function () {
        $('#nodeIP-edit').val(dbNodes[$(this).attr('value')]);
        $('#nodeIP-edit').attr('value', $(this).attr('value'));
        $('#editNodeModal').modal('show');
    });

    $('body').on('click', 'div #editNodeConfirm', function () {
        let nodeTemp = $('#nodeIP-edit').val();
        dbNodes[$('#nodeIP-edit').attr('value')] = nodeTemp;
        $('#nodeIP-' + $('#nodeIP-edit').attr('value')).text(nodeTemp);
        $('#nodeStatus-' + $('#nodeIP-edit').attr('value')).text('--');
        $('#editNodeModal').modal('hide');
    });
    $('body').on('click', 'div .deleteNodeBtn', function () {
        delete dbNodes[$(this).attr('value')];
        updateIndexesInDOMelements($(this).attr('value'));
        dbNodes = dbNodes.filter(function (el) {
            return el != null;
        });
        console.log('After', dbNodes);
        $(this).parent().parent().remove();
    });

    $('#envConfForm').on('submit', function (e) {
        e.preventDefault();
        processFormDataForSaving(appURL, dbUser, dbPass, dbNodes, dbKeyspace);
    })
    $('body').on('click', 'div #addKeySpaceBtn', function () {
        $('#addKeySpaceModal').modal('show');
    });
    $('body').on('click','div .editCrawlListBtn',function(){
        let temp =$(this).attr('value');
        $('#trackWord-edit').val(temp);
        $('#trackWord-edit').attr('value',$(this).attr('source'));
        $('#trackWord-edit').attr('type',$(this).attr('type'));
        $('#trackWordHandleInput-edit').val('NULL')
             if($(this).attr('type')=='user'){
                $('#trackWordHandle-edit').css('display','block');
                $('#trackWordHandleInput-edit').val($(this).attr('handle'))
            }else{
                $('#trackWordHandle-edit').css('display','none');
            }
        $('#editCrawlList').modal('show');
    });
    $('body').on('click','div #editTrackWordConfirm',function(){
            let captured = $('#trackWord-edit').val();
            let idCaptured  = $('#trackWord-edit').attr('value');
            let typeTemp = $('#trackWord-edit').attr('type');
            let handleCaptured =  $('#trackWordHandleInput-edit').val();
            updateTrackWordInDb(idCaptured,captured,handleCaptured) ;
            $('#trackWord-'+idCaptured).text(captured);
            $('#editBtnCrawlList-'+idCaptured).attr('handle',handleCaptured);
            $('#trackWord-edit').val('');
            $('#trackWord-edit').attr('value','');
            $('#editCrawlList').modal('hide');

    });
    $('body').on('click','div .deleteCrawlListBtn',function(){
        let idCaptured = $(this).attr('value');
        $(this).parent().parent().remove();
        deletefromCrawlList(idCaptured);
    })

});

const updateFormValues = (appURL, dbUser, dbPass, dbNodes, dbKeyspace) => {
    $('#appUrlInput').val(appURL);
    $('#dbUserInput').val(dbUser);
    $('#dbPassInput').val(dbPass);
    for (let i = 0; i < dbNodes.length; i++) {
        printNodes(dbNodes[i], i, 'Active');
    }
    dbKeyspace.forEach(element => {
        printKeySpaces(element)
    });

}

const fromStringCommaSplit = (str) => {
    let args = str.split(/[,]/).filter(Boolean);
    return args;
}
const fromArrayToString = (arr) => {
    let tempString = '', delimiter = ',';
    arr = arr.filter(function (el) {
        return el != null;
    });
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
            if (i == arr.length - 1) {
                delimiter = '';
            }
            tempString = tempString + arr[i] + delimiter;
        }
    }
    return tempString;
}

const printNodes = (nodeIP, index, status) => {
    $('#dbNodesRecord').append('<tr><td id="nodeIP-' + index + '">' + nodeIP + '</td><td id="nodeStatus-' + index + '" > ' + status + ' </td><td><button class="btn btn-secondary smat-rounded  btn-sm  editNodeBtn configElement"  onclick="return false"   value=' + index + '><span><i class="fa fa-edit mr-1"></i>Edit</span></button><button onclick="return false"  class="btn btn-neg smat-rounded  btn-sm mx-2  deleteNodeBtn " value=' + index + ' id="nodeDelete-' + index + '"  ><span><i class="fa fa-trash mr-1"></i>Delete</span></button></td></tr>');
}

const printKeySpaces = (keySpace) => {
    $('#configKeyspaces').append('<div class="form-check"><input class="form-check-input keyspaceCheck" type="radio" id="' + keySpace + '" checked><label class="form-check-label" for="gridRadios1">' + keySpace + '</label></div>');
}

const processFormDataForSaving = (appURL, dbUser, dbPass, dbNodes, dbKeyspace) => {
    let NodesTemp = fromArrayToString(dbNodes);
    console.log(NodesTemp)
}

const updateIndexesInDOMelements = (currentIndex) => {
    for (let i = currentIndex; i < totalNodes; i++) {
        let j = parseInt(i) + 1;
        $('#nodeDelete-' + j).attr('value', i);
        $('#nodeDelete-' + j).attr('id', '#nodeDelete-' + i);
    }

}

const addToCrawlerListTable = (id, trackWord, type, status, handle="NULL") => {
    let enabled = '', disabled = '';
    if (status == "1") {
        enabled = 'checked';
        disabled = '';
    } else {
        enabled = '';
        disabled = 'checked';
    }

    $('#crawlerList').append('<tr id="track-' + id + '"><th scope="row">' + id + '</th><td id="trackWord-' + id + '">' + trackWord + '</td><td id="trackWordType-' + id + '">' + type + '</td><td><div class="d-flex"><div class="form-check"><input class="form-check-input  statusRadio-'+id+' istrackEnabled" type="radio" id="trackEnabled-' + id + '" value="1"  source="' + id + '|' + trackWord + '"  ' + enabled + '><label class="form-check-label" for="trackEnabled-' + id + '">Enable</label></div><div class="form-check mx-3"><input class="form-check-input statusRadio-'+id+' istrackEnabled"  type="radio"  id="trackDisabled-' + id + '" value="0"  source="' + id + '|' + trackWord + '"  ' + disabled + '><label class="form-check-label" for="trackDisabled-' + id + '">Disable</label></div></div></td><td><button class="btn btn-secondary smat-rounded  btn-sm editCrawlListBtn editCrawlbtn " id="editBtnCrawlList-'+id+'"  value="'+trackWord+'"  source="'+id+'"  type="'+type+'" handle="'+handle+'"><span><i class="fa fa-edit mr-1"></i>Edit</span></button><button class="btn btn-neg smat-rounded  btn-sm mx-2 deleteCrawlListBtn"    value="'+id+'"  ><span><i class="fa fa-trash mr-1"></i>Delete</span></button></td></tr>');
}

const generateCrawlerList = (type, option = null) => {
    getCrawlerList(type).then(response => {
        $('#crawlerList').html('');
        for (let i = 0; i < response.length; i++) {
            if (i == response.length - 1) {
                lastIDofTrackWords = parseInt(response[i].id) + 1;
            }
            if (option == 'hashtag' && !response[i]['track'].includes('#')) {
                continue;
            } else if ( (option == 'keyword' || option =='user') && response[i]['track'].includes('#')) {
                continue;
            }

            addToCrawlerListTable(response[i].id, response[i].track, response[i].type, response[i].status,response[i].handle);
        }
    });
}
