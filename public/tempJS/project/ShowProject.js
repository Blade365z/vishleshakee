import {getAnalysisProject, getProjectName} from './helper.js';
import {displayErrorMsg, getUserDetail, actionLog} from '../utilitiesJS/smatExtras.js'
import {forwardToHistoricalAnalysis, forwardToNetworkAnalysis, forwardToUserAnalysis} from '../utilitiesJS/redirectionScripts.js';

var userID1;

// to get userID
getUserDetail().then(response => {
	console.log(response);	
	userID1 = response.id;
	console.log(userID1);

	getAnalysisProject(userID1).then(response1 => {
		if (response1.length < 1) {
			displayErrorMsg('tableInitialTitleAdv', 'normal', 'No data found in records.', false);
		}
		if (response1) {
			console.log(response1);
			console.log(response1[0].project_id);
			let project_id = response1[0].project_id;
			let project_name;
			getProjectName(project_id).then(response => {
				console.log(response);	
				response.forEach(element => {
					project_name = element.project_name;
				});
				response1.forEach(element => {
					let analysis_name = element.analysis_name;
					let analysis_datetime = element.analysis_datetime;
					$('<tr><td>' + project_name + '</td><td>' + analysis_name + '</td><td>' + analysis_datetime + '</td><td><button class="btn btn-primary smat-rounded mx-1 showBtn" > Show </button><button class="btn btn-danger mx-1  smat-rounded deleteBtn" > Delete </button></td></tr>').prependTo("#ProjectTable");
				});
			});
			
		}
	});
});


$('body').on('click', '.showBtn', function () {
	console.log($(this).closest("tr"));
	let tds = $(this).closest("tr").children("td");
	let query = tds.eq(1).text().trim();
	let from_date = tds.eq(2).text().trim();
	console.log(query);
	// forwardToHistoricalAnalysis(query,date,date);
});