



export const wordCloudLM = (hashtag_data,div) => {
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create(div, am4plugins_wordCloud.WordCloud);
    chart.fontFamily = "Courier New";
    var series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
    series.randomness = 0.1;
    series.rotationThreshold = 0.5;

    var data = [];


    var dataformat = [];
 
    data.forEach(element => {
        dataformat.push({
            tag: element['token'],
            count: element['count'],
            "color": am4core.color(element['color'])
        })

    });


    series.data = dataformat;

    series.dataFields.word = "tag";
    series.dataFields.value = "count";

    series.colors = new am4core.ColorSet();
    series.colors.passOptions = {};
    
    series.labels.template.propertyFields.fill = "color";

    // series.labels.template.url = "https://stackoverflow.com/questions/tagged/{word}";
    // series.labels.template.urlTarget = "_blank";
    // series.labels.template.tooltipText = "{word}: {value}";

    var hoverState = series.labels.template.states.create("hover");
    hoverState.properties.fill = am4core.color("#FF0000");
    
    series.labels.template.events.on("over", function (ev) {

        var item = ev.target.tooltipDataItem.dataContext;
        var token = item['tag'];
        
        wordcloudPlot(hashtag_data,token);
        // plotEventOnMap(token, only_hashtag_place_data);
    });

    // var subtitle = chart.titles.create();
    // subtitle.text = "(click to open)";

    // var title = chart.titles.create();
    // title.text = "Most Popular Tags @ StackOverflow";
    // title.fontSize = 20;
    // title.fontWeight = "800";
}