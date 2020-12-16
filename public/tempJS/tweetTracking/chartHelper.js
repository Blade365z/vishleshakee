/*
------------IMPORTANT  NOTE---------------
------------------------------------------
PLEASE NOT THERE ARE TYPES::
1.retweet
3.replytweet
2.quotedtweet
*/

import {getTweetsForSource} from './helper.js';
import { getDateInFormat } from '../utilitiesJS/smatDate.js';
import {TweetsGenerator} from '../utilitiesJS/TweetGenerator.js'

export const drawFreqDataForTweet = (data, div, id, type,isGroupedByMonthFlag) => {
    // Create chart instance
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create(div, am4charts.XYChart);
    // Add data
    var dataTemp = [];
    if(isGroupedByMonthFlag){
        for (const [key, freq] of Object.entries(data)) {
            console.log(freq);
            dataTemp.push({
                date: key,
                count: freq[1]
            });
        }
    }else{
        for (const [key, freq] of Object.entries(data['data'])) {
            dataTemp.push({
                date: new Date(freq[0]),
                count: freq[1]
            });
        }
    }
    
    chart.data = dataTemp;
    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.title.fontSize = 10;

    // var title = chart.titles.create();
    // title.fontSize = 12;
    // title.marginBottom = 10;
    // if (rangeType == 'day')
    //     title.text = "Per day distribution" + '  (Click on the bars for more)';
    // else if (rangeType == 'hour')
    //     title.text = "Per hour distribution for " + data['data'][0][0] + ' (Click on the bars for more)';

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "No. of tweets";
    valueAxis.title.fontSize = 10;
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.dateX = "date";
    series.columns.template.fill = am4core.color("#4280B7");
    series.columns.template.strokeOpacity = 0;
    series.tooltipText = `[bold]{dateX}: {valueY} Tweets[/] 
      (click on bar to Know more)`;
    series.strokeWidth = 2;
    series.tooltip.autoTextColor = false;
    series.tooltip.label.fill = am4core.color("#141313");
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.fillOpacity = 0.5;
    series.tooltip.label.padding(12, 12, 12, 12);
    series.columns.template.width = am4core.percent(50);
    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    // Create scrollbars
    chart.cursor = new am4charts.XYCursor();
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.background.fill = am4core.color("#4280B7");


    // //Handling Click Events 
    series.columns.template.events.on("hit", function (ev) {
        let datetime_obj = ev.target.dataItem.component.tooltipDataItem.dataContext;
        var date = getDateInFormat(datetime_obj['date'], 'Y-m-d'); 
        getTweetsForSource(id,date,null,type).then(response => {
            $('#tweetsModal').modal('show');
            TweetsGenerator(response.data,6,'tweets-modal-div',null,null,true,null);
        })
    });
}


export const drawFreqDataForTweetMonth = (data, div, id, type,isGroupedByMonthFlag) => {

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
var chart = am4core.create(div, am4charts.XYChart);
chart.scrollbarX = new am4core.Scrollbar();

// Add data
var  dataTemp=[];
for (const [key, freq] of Object.entries(data)) {
    console.log(freq);
    dataTemp.push({
        country: key,
        visits: freq
    });
}
chart.data = dataTemp;
// Create axes
var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "country";
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.minGridDistance = 30;
categoryAxis.renderer.labels.template.horizontalCenter = "right";
categoryAxis.renderer.labels.template.verticalCenter = "middle";
categoryAxis.renderer.labels.template.rotation = 270;
categoryAxis.tooltip.disabled = true;
categoryAxis.renderer.minHeight = 110;

var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.minWidth = 30;

// Create series
var series = chart.series.push(new am4charts.ColumnSeries());
series.sequencedInterpolation = true;
series.dataFields.valueY = "visits";
series.dataFields.categoryX = "country";
series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
series.columns.template.strokeWidth = 0;
series.columns.template.fill = am4core.color("#4280B7");

series.tooltip.pointerOrientation = "vertical";

series.columns.template.column.cornerRadiusTopLeft = 10;
series.columns.template.column.cornerRadiusTopRight = 10;
series.columns.template.column.fillOpacity = 1.0;

// on hover, make corner radiuses bigger
var hoverState = series.columns.template.column.states.create("hover");
hoverState.properties.cornerRadiusTopLeft = 0;
hoverState.properties.cornerRadiusTopRight = 0;
hoverState.properties.fillOpacity = 1;
chart.scrollbarX.background.fill = am4core.color("#4280B7");


// Cursor
chart.cursor = new am4charts.XYCursor();

}