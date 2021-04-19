import { getUserDetails } from "../userAnalysis/helper.js";
import { forwardToHistoricalAnalysis } from "../utilitiesJS/redirectionScripts.js";
import { getDateInFormat } from '../utilitiesJS/smatDate.js';
import { TweetsGenerator } from "../utilitiesJS/TweetGenerator.js";
import { getTweetsForFreq } from "./helper.js";

export const generateBarChartForCooccur = (query, data = null, div, option, from, to) => {
    var chart = am4core.create(div, am4charts.XYChart);
    am4core.useTheme(am4themes_animated);
    chart.padding(0, 0, 0, 0);
    chart.data = generateChartData(data, option);
    function generateChartData(data, option) {
        var chartData = [];
        data.forEach(element => {
            if (option === 'hashtag') {
                chartData.push({
                    "token": element['hashtag'],
                    "count": element['count'],

                });
            } else if (option === 'mention') {
                chartData.push({
                    "token": element['handle'],
                    "count": element['count'],

                });
            } else if (option === 'user') {
                chartData.push({
                    "token": element['handle'],
                    "count": element['count'],
                    "id": element['id']

                });
            }
        });

        return chartData;
    }


    //create category axis for names
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.id = "category_Axis";

    categoryAxis.dataFields.category = "token";

    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;

    //create value axis for count and expenses
    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = true;


    //create columns
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "token";
    series.dataFields.valueX = "count";
    categoryAxis.renderer.cellStartLocation = 0.2;
    categoryAxis.renderer.cellEndLocation = 1.1;

    var cellSize = 30;
    chart.events.on("datavalidated", function (ev) {

        // Get objects of interest
        var chart = ev.target;
        var categoryAxis = chart.yAxes.getIndex(0);

        // Calculate how we need to adjust chart height
        var adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;

        // get current chart height
        var targetHeight = chart.pixelHeight + adjustHeight;

        // Set it on chart's container
        chart.svgContainer.htmlElement.style.height = targetHeight + "px";
    });
    series.columns.template.fillOpacity = 10;
    series.columns.template.fill = am4core.color("#4280B7");
    series.columns.template.strokeOpacity = 10;
    series.tooltipText = " {categoryY}: {valueX.value}" + "(Click to Know More)";
    series.columns.template.width = am4core.percent(50);

    categoryAxis.sortBySeries = series;
    chart.cursor = new am4charts.XYCursor();
    series.columns.template.events.on("hit", function (ev) {
        if (option === 'hashtag' || option === 'mention') {
            var item = ev.target.dataItem.component.tooltipDataItem.dataContext;
            let queryTemp = '(' + query + '&' + String(item.token) + ')';
            forwardToHistoricalAnalysis(queryTemp, from, to);
        } else {
            var item = ev.target.dataItem.dataContext.id;
            forwardToUserAnalysis(item, from, to);
        }
    });
}



const colorMap = { com: '#ff0055', sec: '#3D3D3D', com_sec: '#FF00FF', normal: '#297EB4' };
export const renderProjectWordCloud = (data, div, from, to, projectName) => {
    var chart = am4core.create(div, am4plugins_wordCloud.WordCloud);
    chart.fontFamily = "Courier New";
    var series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
    series.randomness = 0.1;
    series.rotationThreshold = 0.5;
    let tempData = [];
    data.map(element => {
        tempData.push({
            tag: element[0],
            value: Math.log(element[1]),
            count: element[1],
            color: colorMap[element[2]],
            category: (element[2] == 'normal') ? '' : ((element[2] == 'sec') ? ', Security' : ((element[2] == 'com') ? ', Communal' : ', Communal & Security'))
        })
    });
    series.labels.template.propertyFields.fill = "color";
    series.data = tempData;
    series.dataFields.word = "tag";
    series.dataFields.value = "value";
    series.dataFields.category = "category";
    series.dataFields.count = "count";
    // series.maxCount = 100;
    // series.minWordLength = 2;
    series.labels.template.tooltipText = "{word}: {count} {category}";
    series.events.on("hit", function (ev) {
        forwardToHistoricalAnalysis(ev.target.tooltip.dataItem.dataContext.tag, from, to, projectName)
    });
}

export const generateSentiDistLineChart = (data = null, query, rangeType, div) => {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        var chart = am4core.create(div, am4charts.XYChart);
        // Increase contrast by taking evey second color
        chart.colors.list = [
            am4core.color("#33CCCC"), //pos
            am4core.color("#FC5F4F"), //neg
            am4core.color("#FFC060") //neu
        ];

        // Add dataclearInterval(interval_for_freq_dis_trend_analysis);
        var dataTemp = [];
        for (const [key, senti] of Object.entries(data['data'])) {
            dataTemp.push({
                date: new Date(senti[0]),
                pos: parseInt(senti[1]),
                neg: parseInt(senti[2]),
                neu: parseInt(senti[3])
            });
        }
        chart.data = dataTemp;

        chart.responsive.enabled = true;

        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 50;
        if (rangeType == 'day') {
            dateAxis.title.text = "Date";
            dateAxis.tooltipDateFormat = "d MMMM yyyy";
        }
        var title = chart.titles.create();
        title.fontSize = 12;
        title.marginBottom = 10;
        if (rangeType == 'day')
            title.text = "Per day distribution";

        if (rangeType == 'day') {
            dateAxis.title.text = "Date";
            dateAxis.tooltipDateFormat = "d MMMM yyyy";
        }



        // after adding data chart should validated to update........
        chart.events.on("datavalidated", function () {
            dateAxis.zoom({
                start: 1 / 15,
                end: 1.2
            }, false, true);
        });
        dateAxis.interpolationDuration = 100;
        dateAxis.rangeChangeDuration = 500;
        // .........................................................


        // Create series
        function createAxisAndSeries(field, name, opposite, option, color) {
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            if (option == 0)
                valueAxis.title.text = "No. of tweets";
            var series = chart.series.push(new am4charts.LineSeries());
            var circleBullet = series.bullets.push(new am4charts.CircleBullet());
            circleBullet.circle.fill = am4core.color(color);
            circleBullet.circle.strokeWidth = 0;

            var hoverState = circleBullet.states.create("hover");
            hoverState.properties.scale = 2;

            series.dataFields.valueY = field;
            series.dataFields.dateX = "date";
            series.strokeWidth = 2;
            series.yAxis = valueAxis;
            series.name = name;
            // series.tooltipText = "{name}: [bold]{valueY}[/]";
            series.tooltipText = `[bold]{dateX.formatDate('yyyy-MMM-dd HH:mm:ss')}: {valueY} Tweets [\]
                (click on circle to Know more)`;
            series.tooltip.autoTextColor = false;
            series.tooltip.label.fill = am4core.color("#141313");
            // series.tensionX = 0.8;

            // all the below is optional, makes some fancy effects.......
            // gradient fill of the series
            series.fillOpacity = 1;
            var gradient = new am4core.LinearGradient();
            gradient.addColor(chart.colors.getIndex(option), 0.2);
            gradient.addColor(chart.colors.getIndex(option), 0);
            series.fill = gradient;
            //............................................................

            var interfaceColors = new am4core.InterfaceColorSet();
            valueAxis.renderer.line.strokeOpacity = 1;
            valueAxis.renderer.line.strokeWidth = 2;
            valueAxis.renderer.line.stroke = series.stroke;
            valueAxis.renderer.labels.template.fill = series.stroke;
            valueAxis.renderer.opposite = opposite;
            valueAxis.renderer.grid.template.disabled = true;

            // image.href = "https://www.amcharts.com/lib/images/star.svg";
        }

        createAxisAndSeries("pos", "Positive", false, 0, "#33CCCC");
        createAxisAndSeries("neg", "Negative", true, 1, "#FC5F4F");
        createAxisAndSeries("neu", "Neutral", true, 2, "#FFC060");

        chart.legend = new am4charts.Legend();

        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.scrollbarX = new am4core.Scrollbar();


    });

};
export const createUserStatsForProject = (data, div) => {
    $('#' + div).html('<div class="row mt-1 pt-1" id="userStats" style="height:330px;overflow-y:auto"> </div>')
    const userIDs = data.map(element => element[0]);
    const counts = data.map(element => element[1]);
    getUserDetails(userIDs).then(response => {
        let i = 0;
        response.map(user => {
            $('#userStats').append('<div class="border p-2 m-2 text-center userCard" style="width:200px;height:100px;cursor:pointer"   value="$' + user.author_id + '"><div class="profilePictureDiv p-1 text-center mr-2"> <img src=' + user.profile_image_url_https + ' / style="height:33px;border-radius:50%;"></div><div class="font-weight-bold text-truncate">' + user.author + '</div> <div>Tweets: <b>' + counts[i] + '</b></div></div>');
            i += 1;
        })

    })
}

export const plotDonutForStats_old = (data, div) => {
    var chart = am4core.create(div, am4charts.PieChart);

    let temp = [];
    const colorDict = { 1: '#33CCCC', 2: '#FC5F4F', 3: '#FFC060' }
    const categoryDict = { 1: 'Positive', 2: 'Negative', 3: 'Neutral', 11: 'Communal & Positive', 12: 'Communal & Negative', 13: 'Communal & Neutral', 101: 'Security & Positive', 102: 'Security & Negative', 103: 'Security & Neutral', 111: 'Communal & Security & Positive', 112: 'Communal & Security & Negative', 113: 'Communal & Security & Neutral' }
    for (let key in data) {
        if (key === '1' || key === '2' || key === '3')
            temp.push({
                category: categoryDict[key],
                count: data[key],
                "color": am4core.color(colorDict[key])
            });
    }
    chart.data = temp;
    // Add data

    // Set inner radius
    chart.innerRadius = am4core.percent(50);

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "type";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.propertyFields.fill = "color";

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
}




export const plotDonutForStats = (data, div) => {
    var chart = am4core.create(div, am4charts.PieChart);

    let temp = [];
    const colorDict = { 1: '#33CCCC', 2: '#FC5F4F', 3: '#FFC060' }
    const categoryDict = { 1: 'Positive', 2: 'Negative', 3: 'Neutral', 11: 'Communal & Positive', 12: 'Communal & Negative', 13: 'Communal & Neutral', 101: 'Security & Positive', 102: 'Security & Negative', 103: 'Security & Neutral', 111: 'Communal & Security & Positive', 112: 'Communal & Security & Negative', 113: 'Communal & Security & Neutral' }
    for (let key in data) {
        if (key === '1' || key === '2' || key === '3')
            temp.push({
                category: categoryDict[key],
                count: data[key],
                "color": am4core.color(colorDict[key])
            });
    }
    chart.data = temp;
    // Add data

    // Set inner radius
    chart.innerRadius = am4core.percent(50);

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "type";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.propertyFields.fill = "color";

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
}



export const generateFreqDistBarChart = (query, data = null, rangeType, div, pname) => {
    // Create chart instance
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create(div, am4charts.XYChart);
    // Add data
    var dataTemp = [];
    for (const [key, freq] of Object.entries(data['data'])) {

        dataTemp.push({
            date: new Date(freq[0]),
            count: freq[1]
        });
    }
    chart.data = dataTemp;


    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.title.fontSize = 10;

    var title = chart.titles.create();
    title.fontSize = 12;
    title.marginBottom = 10;
    if (rangeType == 'day')
        title.text = "Per day distribution" + '  (Click on the bars for more)';
    else if (rangeType == 'hour') {
        console.log(data['data']);
        title.text = "Per hour distribution for " + data['data'][0][0] + ' (Click on the bars for more)';
    }

    if (rangeType == 'hour') {
        dateAxis.title.text = "DateTime";
        dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
        dateAxis.baseInterval = {
            "timeUnit": "hour",
            "count": 1
        }
    } else if (rangeType == 'day') {
        dateAxis.title.text = "Date";
        dateAxis.tooltipDateFormat = "d MMMM yyyy";
    }

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

    series.columns.template.events.on("hit", function (ev) {
        $('#' + div).css('width', '70%');
        $('#' + div + '-tweets').parent().css('display', 'block');
        $('#' + div + '-tweets').parent().css('width', '30%');
        let datetime_obj = ev.target.dataItem.component.tooltipDataItem.dataContext;
        var date = getDateInFormat(datetime_obj['date'], 'Y-m-d');
        var startTime = getDateInFormat(datetime_obj['date'], 'HH:MM:SS');
        getTweetsForFreq(date, date, pname, 'all').then(res => {
                TweetsGenerator(res.data,6,div + '-tweets',date,date,true,rangeType,pname)   
        })
    });
    //Handling Click Events 

}



export const generateSentiDistBarChart = (data, query, rangeType, div) => {
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create(div, am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    var dataTemp = [];
    for (const [key, senti] of Object.entries(data['data'])) {
        dataTemp.push({
            date: new Date(senti[0]),
            pos: parseInt(senti[1]),
            neg: parseInt(senti[2]),
            neu: parseInt(senti[3])
        });
    }
    chart.data = dataTemp;

    // chart.colors.step = 2;

    chart.legend = new am4charts.Legend();
    chart.colors.list = [
        am4core.color("#33CCCC"), //pos
        am4core.color("#FC5F4F"), //neg
        am4core.color("#FFC060") //neu
    ];
    chart.responsive.enabled = true;


    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    // dateAxis.renderer.grid.template.location = 0;
    var title = chart.titles.create();
    title.fontSize = 12;
    title.marginBottom = 10;
    if (rangeType == 'day')
        title.text = "Per day distribution" + '  (Click on the bars for more)';
    else if (rangeType == 'hour')
        title.text = "Per hour distribution for " + data['data'][0][0] + ' (Click on the bars for more)';

    if (rangeType == 'hour') {
        dateAxis.title.text = "DateTime";
        dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
        dateAxis.baseInterval = {
            "timeUnit": "hour",
            "count": 1
        }
    } else if (rangeType == 'day') {
        dateAxis.title.text = "Date";
        dateAxis.tooltipDateFormat = "d MMMM yyyy";
    }


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // if (option == 0)
    valueAxis.title.text = "% of tweets";
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.minWidth = 50;

    // Create series
    function createAxisAndSeries(field, name, option) {
        var series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.columns.template.width = am4core.percent(20);
        series1.columns.template.tooltipText =
            `[bold]{dateX}: {valueY} Tweets ({valueY.totalPercent.formatNumber('#.00')}%)[/]
              (click on bar to Know more)`;
        series1.name = name;
        series1.dataFields.dateX = "date";
        series1.dataFields.valueY = field;
        series1.dataFields.valueYShow = "totalPercent";
        series1.dataItems.template.locations.dateX = 0.5;
        series1.stacked = true;
        series1.yAxis = valueAxis;
        series1.name = name;
        series1.tooltip.pointerOrientation = "down";
        series1.tooltip.label.fill = am4core.color("#141313");
        series1.tensionX = 0.2;
        series1.columns.template.width = am4core.percent(80);
        series1.strokeWidth = 2;
        // do not show tooltip for zero-value column
        series1.tooltip.label.adapter.add("text", function (text, target) {
            if (target.dataItem && target.dataItem.valueY == 0) {
                return "";
            } else {
                return text;
            }
        });

    }

    createAxisAndSeries("pos", "Positive", 0);
    createAxisAndSeries("neg", "Negative", 1);
    createAxisAndSeries("neu", "Neutral", 2);

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.scrollbarX = new am4core.Scrollbar();
};

