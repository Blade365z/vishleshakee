import { getMe } from "../home/helper.js";
import { TweetsGenerator } from "../utilitiesJS/TweetGenerator.js";
import { generateBarChartForCooccur, renderProjectWordCloud, createUserStatsForProject, plotDonutForStats } from "./chartHelper.js";
import { getAllTagsForSHOW, getProjectName, getStoriesOfUserFromServer, getTokenCountForProject, getTweetsForProject } from "./helper.js"
const tweetTypeDict = { 'Tweet': 'Source Tweet', 'retweet': 'Re Tweet', 'QuotedTweet': 'Quoted Tweet', 'Reply': 'Reply Tweet' };

_MODE = 'PROJECT';
var projectName = null;
var userID = null;

if (!projectID) {
    $('#project-main').html('<h3>No Project ID Found.</h3>')
} else {
    getProjectName(projectID).then(async (projectMetaData) => {
        projectMetaData = projectMetaData[0];

        if (projectMetaData) {
            localStorage.setItem("projectMetaData", JSON.stringify({ projectMetaData }));
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
                renderProjectWordCloud(response, 'project-stat-hashtags')
            });
            getAllTagsForSHOW(projectID, userID, 'mention').then(response => {
                response = response.slice(0, 150);
                renderProjectWordCloud(response, 'project-stat-mentions')
            });
            getAllTagsForSHOW(projectID, userID, 'user').then(response => {
                response = response.slice(0, 150);
                createUserStatsForProject(response, 'project-stat-users')
            });
            getTokenCountForProject(projectID, userID, 'token').then(res => {
                $('#hashtag-count').text(res.hashtag);
                $('#user-count').text(res.user);
                $('#mention-count').text(res.mentions);
                $('#location-count').text(res.location);
                $('#keyword-count').text(res.keyword);
            });
            getTokenCountForProject(projectID, userID, 'tweet').then(res => {
                $('#pos').text(res['1']);
                $('#neg').text(res['2']);
                $('#neu').text(res['3']);
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
                for (let key in res) {
                    sum += res[key];
                }
                $('#totalTweets').text(sum)
                plotDonutForStats(res, 'tweetStatsChart')

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
    $('#' + div).append(`<div class="card card-body projectBtn storyBtn mr-2" style="max-width:200px;" value="${projectID}|${storyID.replace(/\s+/g, '')}"><div><h3 class="m-0">${storyName}</h3></div><div><h6>${storyDesc}</h6></div><div><h6>${date}</h6></div></div>`)
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