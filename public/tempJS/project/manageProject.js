import { tweetResults} from '../utilitiesJS/getMap.js';
import { getMe } from "../home/helper.js";
import { TweetsGenerator } from "../utilitiesJS/TweetGenerator.js";
import { generateBarChartForCooccur, renderProjectWordCloud, createUserStatsForProject, plotDonutForStats, generateFreqDistBarChart, generateSentiDistBarChart } from "./chartHelper.js";
import { getLocationForProject,getAllTagsForSHOW, getProjectName, getStoriesOfUserFromServer, getTokenCountForProject, getTweetFrequencyData, getTweetSentimentData, getTweetsForProject } from "./helper.js"
import { getProjectDetailsFromLocalStorage} from '../project/commonFunctionsProject.js';
import { forwardToUserAnalysis } from '../utilitiesJS/redirectionScripts.js';

const tweetTypeDict = { 'Tweet': 'Source Tweet', 'retweet': 'Re Tweet', 'QuotedTweet': 'Quoted Tweet', 'Reply': 'Reply Tweet' };

_MODE = 'PROJECT';
var projectName = null;
var userID = null;
var from, to;
var projectDetails;


if (!projectID) {
    $('#project-main').html('<h3>No Project ID Found.</h3>')
} else {
    projectDetails = getProjectDetailsFromLocalStorage();

    getProjectName(projectID).then(async (projectMetaData) => {
        projectMetaData = projectMetaData[0];

        if (projectMetaData) {
            localStorage.setItem("projectMetaData", JSON.stringify({ projectMetaData }));
            from = projectMetaData.from_date;
            to = projectMetaData.to_date;
            $('#fromDate').text(projectMetaData.from_date);
            $('#toDate').text(projectMetaData.to_date);
            $('.project-name').html(projectMetaData.project_name);
            projectName = projectMetaData.project_name;
            $('#project-description').html(projectMetaData.project_description);
            $('#project-created-date').html(projectMetaData.project_creation_date);

            userID = await getMe();
            fetchStoriesOfProject(projectID, 'storyCards', userID);
            getAllTagsForSHOW(projectID, userID, 'hashtag').then(response => {
                response = response.slice(0, 150);
                renderProjectWordCloud(response, 'project-stat-hashtags',from,to,projectName)
            });
            getAllTagsForSHOW(projectID, userID, 'mention').then(response => {
                response = response.slice(0, 150);
                renderProjectWordCloud(response, 'project-stat-mentions',from,to,projectName)
            });
            getAllTagsForSHOW(projectID, userID, 'user').then(response => {
                response = response.slice(0, 150);
                createUserStatsForProject(response, 'project-stat-users')
            });
            getAllTagsForSHOW(projectID, userID, 'location').then(response => {
             
            });
            getTokenCountForProject(projectID, userID, 'token').then(res => {
                $('.hashtag-count').text(res.hashtag);
                $('.user-count').text(res.user);
                $('.mention-count').text(res.mentions);
                $('.location-count').text(res.location);
                $('.keyword-count').text(res.keyword);
            });
            getTokenCountForProject(projectID, userID, 'tweet').then(res => {
                // mala
                // $('#pos').text(res['1']);
                // $('#neg').text(res['2']);
                // $('#neu').text(res['3']);
                $('#com-pos').text(res['11']);
                $('#com-neg').text(res['12']);
                $('#com-neu').text(res['13']);
                $('#sec-pos').text(res['101']);
                $('#sec-neg').text(res['102']);
                $('#sec-neu').text(res['103']);
                $('#comSecCount-pos').text(res['111']);
                $('#comSecCount-neg').text(res['112']);
                $('#comSecCount-neu').text(res['113']);
                let sum = 0;
                // mala
                let total_pos = 0;
                let total_neg = 0;
                let total_neu = 0;
                for (let key in res) {
                    sum += res[key];
                    // mala
                    if(key%10 == 1)
                        total_pos += res[key];
                    else if(key%10 == 2)
                        total_neg += res[key];
                    else if(key%10 == 3)
                        total_neu += res[key];
                }
                $('#totalTweets').text(sum)
                // mala
                $('#pos').text(total_pos);
                $('#neg').text(total_neg);
                $('#neu').text(total_neu);
                let total_sentiment_data = {1:total_pos, 2: total_neg, 3:total_neu};
                // plotDonutForStats(res, 'tweetStatsChart')
                // mala
                plotDonutForStats(total_sentiment_data, 'tweetStatsChart');

            });
            $('#tweets-project').html('<div class="text-center  smat-loader"  id="alertBoxLoader"><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
            getTweetsForProject(projectID, userID, 'retweet').then(res => {
                $('#tweet-count-project-title').text(res.tweetid_list.length);
                $('#tweet-type-project-title').text(tweetTypeDict['retweet']);
                TweetsGenerator(res.tweetid_list, 6, 'tweets-project', null, null, false, null, projectName, res.tweet_count_hashmap)
            });

    
        }
        else {
            $('#project-main').html('<h3>No Project Active.</h3>')
        }
    });
}
$('#locationProjectTab').on('click',function(){
    console.log("hit");

    let pid = projectDetails.projectMetaData.project_id;
    let pname = projectDetails.projectMetaData.project_name;
    let uid = projectDetails.projectMetaData.user_id;

    getLocationForProject(pid,uid).then(response=>{
        console.log(response);
        $('#project-stat-locations').html(`<div id="result-div-map" style="height:500px;"></div>
                                        <div class="modal_lm">
                                            <div class="modal-content">
                                                <span class="close-button">&times;</span>
                                                <ul id="markersList"></ul>
                                            </div>
                                        </div>`);
        
        console.log(pname);
        console.log(projectDetails.projectMetaData.project_id);
        tweetResults(response,"result-div-map",pname);
    });
});
$('#tweet-stats-tab-btn').on('click',function(){
    $('#project-stat-tweet-frequency-chart').html('<div class="text-center  smat-loader"  id="alertBoxLoader"><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
    getTweetFrequencyData(projectName,from,to).then(res=>{
        generateFreqDistBarChart(null,res,'day','project-stat-tweet-frequency-chart')
    });
});
$('#tweet-stats-sentiment-tab-btn').on('click',function(){
    $('#project-stat-tweet-sentiment-tab').html('<div class="text-center  smat-loader"  id="alertBoxLoader"><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
    getTweetSentimentData(projectName,from,to).then(res=>{
        generateSentiDistBarChart(res,null,'day','project-stat-tweet-sentiment-tab');
    })
})
var STORIES = null;
function fetchStoriesOfProject(projectID, div, userID) {
    getStoriesOfUserFromServer(projectID, userID).then(stories => {
        STORIES = stories;
        $('#numberOfStories').html(stories.length);
        let i = 0;
        if (stories.length >= 1) {
            stories.map(story => {
                viewStories('storyCards', story.storyName, story.storyDescription, story.createdOn, projectID, story.storyID)

            })
        } else {
            $('#' + div).append('<div>No stories created. <div><div></div>')

        }
    })
}
const viewStories = (div, storyName, storyDesc, date, projectID, storyID) => {
    $('#' + div).append(`<div class="card card-body projectBtn storyBtn mr-2 shadow" style="max-width:200px;" value="${projectID}|${storyID.replace(/\s+/g, '')}"><div><h3 class="m-0">${storyName}</h3></div><div><h6>${storyDesc}</h6></div><div><h6>${date}</h6></div></div>`)
}
const storyViewer = async (projectID, storyName = null) => {
    window.open(`story?projectID=${projectID}&storyID=${storyName}`);
}
$('body').on('click', '.storyBtn', function () {
    let value = $(this).attr("value").split(/[|]/).filter(Boolean);
    storyViewer(value[0], value[1]);
})

$('body').on('click', '.createStoryBtn', function () {
    storyViewer(projectID);
});



const printUserStats = (data, div) => {
    data.map(user => {
        $('#userStats').append('<div><div class="profilePictureDiv p-1 text-center mr-2"> <img src=' + user.author_profile_picture + ' / style="height:33px;border-radius:50%;"></div></div>')
    })
}


$('body').on('click','.userCard',function(){
    let uID = $(this).attr('value');
    forwardToUserAnalysis(uID,from,to)
})

$('#searchStoryInput').on('input', function (e) {
    let value = e.target.value;
    let count = 0;
    if (value) {
        $('#storyCards').html('');
        STORIES.map(story => {
            if (story.storyName.toLowerCase().includes(value.toLowerCase())) {
                count += 1;
                viewStories('storyCards', story.storyName, story.storyDescription, story.createdOn, projectID, story.storyID);
            }
        })
        if (count === 0) {
            $('#storyCards').html('<div class="text-center">Not Found.</div>')
        }
    } else {
        $('#storyCards').html('');
        STORIES.map(story => {
            count += 1;
            viewStories('storyCards', story.storyName, story.storyDescription, story.createdOn, projectID, story.storyID);
        });
        if (count === 0) {
            $('#storyCards').html('<div class="text-center">No Stories Found.</div>')
        }
    }

});

$('#tweets-project-select').on('change', function (e) {

    $('#tweets-project').html('<div class="text-center  smat-loader"  id="alertBoxLoader"><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
    getTweetsForProject(projectID, userID, e.target.value).then(res => {
        $('#tweet-count-project-title').text(res.tweetid_list.length);
        $('#tweet-type-project-title').text(e.target.value);
        TweetsGenerator(res.tweetid_list, 6, 'tweets-project', null, null, false, null, projectName, res.tweet_count_hashmap)
    });

})