import { getUserDetails } from "../userAnalysis/helper.js";

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



export const renderProjectWordCloud = (data, div) => {
    var chart = am4core.create(div, am4plugins_wordCloud.WordCloud);
    chart.fontFamily = "Courier New";
    var series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
    series.randomness = 0.1;
    series.rotationThreshold = 0.5;
    let tempData = [];

    data.map(element => {
        tempData.push({
            tag: element[0],
            count: Math.log(element[1]),
        })
    });
    series.data = tempData;
    series.dataFields.word = "tag";
    series.dataFields.value = "count";
    // series.maxCount = 100;
    // series.minWordLength = 2;
    series.labels.template.tooltipText = "{word}: {value}";

}

export const createUserStatsForProject = (data, div) => {
    $('#' + div).html('<div class="row mt-1 pt-1" id="userStats" style="height:330px;overflow-y:auto"> </div>')
    const userIDs = data.map(element => element[0]);
    const counts = data.map(element => element[1]);
    getUserDetails(userIDs).then(response => {
        let i = 0;
        response.map(user => {
            $('#userStats').append('<div class="border p-2 m-2 text-center" style="width:200px;height:100px;"><div class="profilePictureDiv p-1 text-center mr-2"> <img src=' + user.profile_image_url_https + ' / style="height:33px;border-radius:50%;"></div><div class="font-weight-bold text-truncate">' + user.author + '</div> <div>Tweets: <b>' + counts[i] + '</b></div></div>');
            i += 1;
        })

    })
}

export const plotDonutForStats = (data, div) => {
    var chart = am4core.create(div, am4charts.PieChart);

    let temp = [];
    const colorDict = {1:'#33CCCC',2:'#FC5F4F',3:'#FFC060'}
    const categoryDict = {1:'Positive' , 2 :'Negative' , 3 :'Neutral' , 11 : 'Communal & Positive' , 12 :'Communal & Negative' , 13 : 'Communal & Neutral' , 101 : 'Security & Positive', 102:'Security & Negative' , 103 :'Security & Neutral' , 111 : 'Communal & Security & Positive' , 112 :'Communal & Security & Negative' , 113:'Communal & Security & Neutral'}
    for( let key in data){
        if(key==='1' || key === '2'|| key ==='3')
        temp.push({
            category : categoryDict[key],
            count : data[key],
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
