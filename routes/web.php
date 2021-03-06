<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */

//Define View Routes Here.

Route::get('/', function () {
    $URL = env('APP_URL', null);
    return redirect($URL . 'home');
});

Route::get('/help', function () {
    return view('modules.help');
});

Route::get('/configure', function () {
    return view('modules.configure');
})->middleware('isAdmin');

Route::get('/create-project', function () {
    return view('modules.project');
});

Route::get('/home', function (Request $request) {
    $query = '';
    if ($request->input('query')) {
        $query = $request->input('query');
        
    } elseif ($request->input('query')) {
        $query = '';
    }
    return view('modules.home', compact('query'));
});

Route::get('/story', function (Request $request) {
    $projectID = '';
    $storyID = '';
    $projectID = $request->input('projectID');
    if ($request->input('storyID')) {
        $storyID = $request->input('storyID');
    }
    return view('modules.storyBuilder', compact('projectID','storyID'));
});

Route::get('/storyViewer', function (Request $request) {
    $projectID = '';
    $storyID = '';
    $projectID = $request->input('projectID');
    if ($request->input('storyID')) {
        $storyID = $request->input('storyID');
    }
    return view('modules.storyViewer', compact('projectID','storyID'));
});

Route::get('/networkUserAnalysis', function (Request $request) {
    $query = '';
    $tweet_id = '';
    $from = '';
    $to = '';
    if ($request->input('query') && $request->input('tweet_id') && $request->input('from') && $request->input('to')) {
        $query = $request->input('query');
        $tweet_id = $request->input('tweet_id');
        $from = $request->input('from');
        $to = $request->input('to');
    }
    return view('modules.networkUserAnalysis', compact('query', 'tweet_id', 'from', 'to'));

})->middleware('auth');
Route::get('/change-password', function (Request $request) {
    return view('modules.change-password');
})->middleware('auth');
Route::get('/userAnalysis', function (Request $request) {
    $query = '';
    $from = '';
    $to = '';
    if ($request->input('query') && $request->input('from') && $request->input('to')) {
        $query = $request->input('query');
        $from = $request->input('from');
        $to = $request->input('to');
    }
    return view('modules.userAnalysis', compact('query', 'from', 'to'));

})->middleware('auth');

Route::get('/historicalAnalysis', function (Request $request) {
    $query = '';
    $from = '';
    $to = '';
    if ($request->input('query') && $request->input('from') && $request->input('to')) {
        $query = $request->input('query');
        $from = $request->input('from');
        $to = $request->input('to');
    }
    return view('modules.historicalAnalysis', compact('query', 'from', 'to'));
})->middleware('auth');

Route::get('/networkAnalysis', function (Request $request) {
    $query = '';
    $from = '';
    $to = '';
    $uniqueID = '';
    $realtion = '';
    $user = '';
    if ($request->input('query')) {
        $query = $request->input('query');
        $from = $request->input('from');
        $to = $request->input('to');
        $uniqueID = $request->input('uniqueID');
        $relation = $request->input('relation');
        $user = $request->input('user');
    }
    return view('modules.networkAnalysis', compact('query', 'from', 'to', 'uniqueID', 'relation', 'user'));
})->middleware('auth');

Route::get('/locationMonitor', function () {
    return view('modules.locationMonitor');
})->middleware('auth');

Route::get('/trendAnalysis', function () {
    return view('modules.trendAnalysis');
})->middleware('auth');

Route::get('/feedbackPortal', function () {
    return view('modules.feedbackManage');
})->middleware('auth', 'isAdmin');

Route::get('/tracking', function (Request $request) {
    if ($request->input('tweetID')) {
        $tweetID = $request->input('tweetID');
        return view('modules.tweetTracking', compact('tweetID'));
    } else {
        return view('modules.tweetTracking');
    }

})->middleware('auth');

Route::get('/manageProject', function (Request $request) {
    return view('modules.project');
})->middleware('auth');

Route::get('/project', function (Request $request) {
    $projectID = $request->input('projectID');
    return view('modules.manageProject', compact('projectID'));
    
})->middleware('auth');




//Few Auth Routes
Auth::routes();
Route::get('/logout', 'Auth\LoginController@logout')->name('logout');

//Define API routes requiring middleware here.
Route::group(['prefix' => 'smat'], function () {
    Route::get('ua', 'Home@home');
    Route::post('topCooccurDataPublic', 'Home@getTopCoocurDataPublic');
    Route::get('getme', 'Home@me');
    Route::post('/freqDist', 'Home@getFrequencyDistributionData');
    Route::post('/sentiDist', 'Home@getSentimentDistributionData');
    Route::post('/readCooccurData', 'Home@readCooccurDataPublic');
    Route::post('/getTopTrendingData', 'Home@getTopTrendingData');
    Route::post('/getTweetIDs', 'Home@getTweetIDData');
    Route::get('/getTweetsRaw', 'Home@getRawTweets');
    Route::post('/getUserNameFromID', 'Home@getUserNameFromID');

});

//Define API routes requiring middleware here.
Route::group(['prefix' => 'login'], function () {

});

//Define API routes requiring middleware here for  Historical Analysis
Route::group(['prefix' => 'HA'], function () {
    Route::post('getFrequencyDataForHistorical', 'HistoricalController@getFrequencyDataForHistorical');
    Route::post('getSentimentDataForHistorical', 'HistoricalController@getSentimentDataForHistorical');
    Route::post('getCooccurDataForHA', 'HistoricalController@getCooccurDataForHA');

    //spark(advance search)
    Route::post('requestToSpark', 'HistoricalAdvanceController@requestToSpark');
    Route::post('getStatusFromSpark', 'HistoricalAdvanceController@getStatusFromSpark');
    Route::post('getOuputFromSparkAndStoreAsJSON', 'HistoricalAdvanceController@getOuputFromSparkAndStoreAsJSON');
    Route::post('storeToMySqlAdvanceSearchData', 'HistoricalAdvanceController@storeToMySqlAdvanceSearchData');

    Route::post('getFrequencyDataForHistoricalAdvance', 'HistoricalAdvanceController@getFrequencyDataForHistoricalAdvance');
    Route::post('getSentimentDataForHistoricalAdvance', 'HistoricalAdvanceController@getSentimentDataForHistoricalAdvance');
    Route::post('getCooccurDataForAdvance', 'HistoricalAdvanceController@getCooccurDataForAdvance');
    Route::post('getTweetIDForAdvance', 'HistoricalAdvanceController@getTweetIDForAdvance');

    // just for testing
    Route::get('freqDistDataHA', 'HistoricalController@getFrequencyDataForHA');
    Route::get('sentDistDataHA', 'HistoricalController@getSentimentDataForHA');
    Route::get('getCooccurDataForHA', 'HistoricalController@get_Co_occur_Data_For_HA');
    Route::get('getTopLatLngHA', 'HistoricalController@get_top_data_lat_lng_ha');
    Route::get('getTopCatLocationHA', 'HistoricalController@get_top_data_cat_location_ha');
    Route::get('genNetwork', 'CommonController@gen_network');
    Route::get('getFrequencyDistributionTweet', 'HistoricalController@getFrequencyDistributionTweetHA');

});

//Define API routes requiring middleware here for Network Analysis
Route::group(['prefix' => 'na'], function () {
    Route::get('generateNetwork', 'networkAnalysisController@generateNetwork');
    Route::post('graph_view_data_formator', 'networkAnalysisController@graph_view_data_formator_for_rendering_in_visjs');
    Route::post('readcsv', 'networkAnalysisController@read_csv_file');
    //Route::get('readcsv', 'networkAnalysisController@read_csv_file');
    Route::post('centrality_data_formator', 'networkAnalysisController@centrality_data_formator_for_rendering_in_visjs');
    Route::get('mysessionid', 'networkAnalysisController@mysessionid');
    // Route::get('centrality', 'networkAnalysisController@centrality');
    Route::post('centrality', 'networkAnalysisController@centrality');
    Route::post('expansion', 'networkAnalysisController@network_expansion');

    Route::post('link_prediction_data_formator', 'networkAnalysisController@link_prediction_data_formator_new');
    Route::post('link_prediction', 'networkAnalysisController@linkPrediction');
    Route::get('shortest_path_data_formator', 'networkAnalysisController@shortest_path_data_formator_new');
    Route::post('shortestpath', 'networkAnalysisController@shortestpath');
    Route::post('communitydetection', 'networkAnalysisController@community_detection');
    Route::post('community_data_formator', 'networkAnalysisController@community_data_formator_for_rendering_in_visjs');

    Route::post('union', 'networkAnalysisController@union');
    Route::post('union_data_formator', 'networkAnalysisController@union_data_formator');
    Route::post('intersection', 'networkAnalysisController@intersection');
    Route::post('difference', 'networkAnalysisController@difference');
    Route::post('formator_inter_diff', 'networkAnalysisController@difference_data_formator');

    Route::post('writedelete', 'networkAnalysisController@write_delete');
    Route::get('isfileexist', 'networkAnalysisController@isfileexist');
    Route::post('fileupload', 'networkAnalysisController@fileupload');
    Route::get('fileUploadRequest', 'networkAnalysisController@fileUploadRequest');
    // Route::post('requestToSparkandStoreResult', 'networkAnalysisController@requestToSpark');
    Route::post('requestToSpark', 'networkAnalysisController@requestToSpark');
    Route::post('genNetwork', 'networkAnalysisController@gen_network');
    Route::get('getdirname', 'networkAnalysisController@getdirname');

    Route::get('getsparkstatus/{sparkID}', 'networkAnalysisController@getSparkStats');
    Route::post('getFromSparkAndStore', 'networkAnalysisController@getOuputFromSparkAndStore');
    //For network evolution
    Route::get('nettest', 'networkAnalysisEvolution@tester');
    Route::get('jobsubmit', 'networkAnalysisEvolution@jobSubmission');
    Route::post('diameter', 'networkAnalysisController@diameter');
});

//Define API routes requiring middleware here for User Analysis
Route::group(['prefix' => 'UA'], function () {
    Route::post('/userlist', 'UserAnalysisController@first_list');
    Route::get('/getpagingstate', 'UserAnalysisController@get_page_state_token');
    Route::get('/getSuggestedUsers', 'UserAnalysisController@getSuggestedUsers');
    Route::get('/getUserDetails', 'UserAnalysisController@getUserDetails');
    Route::post('/getUserDetailsTemp', 'UserAnalysisController@getUserDetails');
    Route::post('/getFrequencyDataForUser', 'UserAnalysisController@getFrequencyDataForUser');
    Route::post('/getTweetIDs', 'UserAnalysisController@getTweetIDUA');
    Route::post('/getSentimentDataForUser', 'UserAnalysisController@getSentimentDataForUser');
    Route::post('/getCooccurDataForUser', 'UserAnalysisController@getCooccurDataForUser');
    Route::get('/getUsersFromCrawlerList', 'UserAnalysisController@getUAListFromCrawler');
    Route::post('/getNetworkTweetIDs', 'UserAnalysisController@getNetworkTweetIDUA');
});

//Define API routes requiring middleware here for Map
Route::group(['prefix' => 'LM'], function () {
    Route::post('getTweetId', 'LocationMap@get_tweet_id_list');
    Route::get('/getTime', 'LocationMap@get_current_date_time');
    Route::post('getHashtag', 'LocationMap@get_hashtags');
    Route::post('getTopHashtag', 'LocationMap@get_top_hashtags');
    Route::post('checkLocation', 'LocationMap@checkLocation_');
    Route::post('/getcityState', 'LocationMap@showData');
    Route::post('/getTweetInfo', 'LocationMap@location_tweet');
    Route::post('/getTweetInfoHome', 'LocationMap@location_tweet_home');
    Route::post('/getLocationNames', 'LocationMap@getLocationNames');
    Route::post('/tweet_info_for_tracking', 'LocationMap@tweet_info_for_tracking');
    Route::post('/tweet_info', 'LocationMap@tweet_info');
    Route::post('/generate_tweet_network', 'LocationMap@generate_tweet_network');
    Route::post('/tweetid_userInfo', 'LocationMap@tweetid_userInfo');
    Route::post('/user_tweet_info', 'LocationMap@user_tweet_data');

});

//Define API routes requiring middleware here for Trend Analysis
Route::group(['prefix' => 'TA'], function () {
    Route::post('/getTopTrending', 'TrendAnalysisController@getTrending');

});

//Resource Route for feedback controller
Route::post('/feedback', 'FeebackController@insertFeedback');
Route::post('/getFeedback', 'FeebackController@checkIfFeedbackExist');
Route::post('/extractFeedbacks', 'FeebackController@extractFeedbacks');

Route::resource('status', 'queryStatusController', ['except' => ['show']]);
Route::post('/status/{username}', 'queryStatusController@show');

Route::resource('normalStatus', 'normalQueryStatusController', ['except' => ['show']]);
Route::post('/normalStatus/{id}', 'normalQueryStatusController@show');

//Define API routes requiring middleware here for Tweet Tracking
Route::group(['prefix' => 'track'], function () {
    Route::post('/getTweetInfo', 'TweetTracking@getTweetInfo');
    Route::post('/getFrequencyDistributionTweet', 'TweetTracking@getFrequencyDistributionTweet');
    Route::post('/getTweetIDsForSource', 'TweetTracking@get_tweet_idlist_for_track_type_sourceid');
    ///getDatesDist
    Route::post('/getDatesDist', 'TweetTracking@getDatesDist');
    Route::post('/generate_tweet_network_', 'TweetTracking@generate_tweet_network_');
});

Route::group(['prefix' => 'configure'], function () {
    Route::post('/getConfigurations', 'ConfigureSmat@getConfigs');
    Route::post('/save', 'ConfigureSmat@insertConfig');
    Route::post('/saveCrawlerInfo', 'ConfigureSmat@AddTrackToken');
    Route::post('/GetAllTrackToken', 'ConfigureSmat@GetAllTrackToken');
    Route::post('/updateTrackWordStatus', 'ConfigureSmat@updateTrackWordStatus');
    Route::post('/deletefromCrawlList', 'ConfigureSmat@DeleteTrackToken');
});

// project - feature
Route::post('insertKT', 'ProjectActivityController@insert_to_new_keyspace');
Route::post('showP/{id}', 'ProjectActivityController@show');
Route::post('getProjectName/{project_id}', 'ProjectActivityController@get_project_name');
Route::post('getAllProject/{id}', 'ProjectActivityController@get_all_projects');
Route::get('checkIfAnyKeySpaceCreating/{id}', 'ProjectActivityController@checkIfAnyKeySpaceCreating');
Route::post('deleteProjectFromRecords', 'ProjectActivityController@deleteProjectFromRecords');
Route::get('checkIfAnyAnalysisStoreGoingOn/{id}', 'ProjectActivityController@checkIfAnyAnalysisStoreGoingOn');
Route::get('getAnalysisDetails/{userID}/{queryString}', 'ProjectActivityController@getAnalysisDetails');
Route::get('getAnalysisForUserUnderProject/{userID}/{projectID}/{type}', 'ProjectActivityController@getAnalysisForUserUnderProject');
Route::get('checkAnalysisExistorNot/{full_query_id}', 'ProjectActivityController@checkAnalysisExistorNot');

Route::post('deleteFromProjectActivityTable', 'ProjectActivityController@deleteFromProjectActivityTable');

Route::get('/ShowProject', function () {
    return view('modules.ShowProject');
})->middleware('auth');

// log file route
Route::post('log', 'LogController@write_to_log_file');

//check for data streaming status
Route::get('checkStatus', 'CommonController@check_for_cassandra_data_streaming_status');
Route::post('/destroy/{id}', 'queryStatusController@destroy');
Route::post('/destroynets', 'queryStatusController@destroy_network_query_rec');

//RoutesforProject.
Route::post('getRelatedWords', 'ProjectActivityController@getRelatedWords');
Route::post('getRelatedWordsTest', 'ProjectActivityController@getRelatedWords_test');
Route::get('checkIfProjectExitsByName/{name}', 'ProjectActivityController@checkIfProjectExitsByName');
Route::post('createKT', 'ProjectActivityController@create_table_keyspace_api');
Route::post('storeToProjectTable', 'ProjectActivityController@store_to_project_table_api');
Route::post('storeToProjectActivityTable', 'ProjectActivityController@store_to_project_activity_table_api');

//Routes For Story
Route::post('uploadStoryContent', 'storyController@uploadStoryContent');
Route::post('createNewStory', 'storyController@createNewStory');
Route::get('checkIfStoryExists/{projectID}/{storyName}', 'storyController@checkIfStoryExists');
Route::get('getStories/{projectID}', 'storyController@getAllStoryUnderProject');
Route::get('getAllAnalysisUnderStory/{storyID}', 'storyController@getAllAnalysisUnderStory');
Route::get('getStoryInfo/{storyName}', 'storyController@getStoryInfo');
Route::get('getBaseUrl', 'storyController@getBaseUrl');
Route::post('ReadPlotsFromDir', 'storyController@ReadPlotsFromDir');
Route::post('readStories', 'storyController@readStories');
Route::post('getStoryData', 'storyController@getStoryData');

Route::post('activateProject', 'ConfigureSmat@activateProject');
Route::post('deactivateProject', 'ConfigureSmat@deactivateProject');




Route::post('SaveStoryElementsJSON', 'storyController@SaveStoryElementsJSON');

Route::post('updateStoryAnalysis', 'storyController@updateStoryAnalysis');


Route::post('getAllTagsForSHOW', 'storyController@readStoryStatsForShow');



Route::post('readTokenCountProject', 'storyController@readTokenCountProject');


Route::post('getTweetidListOrderByTweetTypeCount', 'ProjectActivityController@getTweetidListOrderByTweetTypeCount');



Route::post('getProjectFrequencyDistributionData', 'ProjectActivityController@getProjectFrequencyDistributionData');
Route::post('getProjectSentimentDistributionData', 'ProjectActivityController@getProjectSentimentDistributionData');
Route::post('getTweetidListProject', 'ProjectActivityController@getTweetidListProject');
Route::post('getTweetidListFiltered', 'ProjectActivityController@getTweetidListFiltered');




Route::post('getTweetIDListHavingLocation', 'ProjectActivityController@getTweetIDListHavingLocation');
Route::post('updatePasswordSmat','Auth\ChangePassword@updatePassword');