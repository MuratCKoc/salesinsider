

// d3 bindings to html
var options = d3.select("#select")
var selector = d3.select("#selDataset");
var demographics = d3.select("#sample-metadata");
var plotarea = d3.select("#bar")
var url = "/api/predicted_table"

function init() {
    // Populate the dropdown
    // d3.json(url).then((data) =>  {
    //     var Names = data.names;
    //     Names.forEach((sample) => {
    //         selector.append("option").text(sample).property("value",sample);
    //     })
    //     console.log(Names);

    //     // Use the first sample to init the charts
    //     const initialSample = Names[0];
    //     build_Charts(initialSample);
    //     buildMetadata(initialSample)
    // });
    get_Calculations()
    create_WordCloud()
};

function get_Calculations(){
    // var results = JSON.parse(url)
    // console.log(results)
    d3.json(url).then((data) => {
        var columns = Object.keys(data)
        // Remove Dates
        columns.shift()
        get_count(data)
        var PATTERN = /_Predicted/
        predicted_columns = columns.filter(function (str) { return PATTERN.test(str); });
        predicted_columns.forEach((item) => {
                selector.append("option")
                .text(item)
                .property("value",item);
        })
    })
    console.log(url)
}

function get_count() {
    console.log(data)
}

function get_mean(arr) {
    var sum = 0;
        for (var n = 0; n < arr.length; n++) {
        var price = arr[n]
        sum += price
    }
    var average_price = sum / arr.length
    return average_price
}

// function buildMetadata(initialSample) {
//     var panel = d3.select("#sample-metadata");

//     d3.json("../data/prophet1.json").then(function (data) {
//         demographics.html("");

//         var all_metadata = data.metadata
//         // Filter the data
//         var sample_metadata = all_metadata.filter(line => line.id == initialSample)
        
//         // Plot Guage
//         plotGauge(sample_metadata[0].wfreq);

//         Object.entries(sample_metadata[0]).forEach(([key, value]) => {
//             panel.append("h5").text(`${key}: ${value}`);
//         });
//     })
// }

// optionChanged function to reload data
function optionChanged(newSample) {
    build_Charts(newSample);
    //buildMetadata(newSample);
}

init();

function build_Charts(initialSample) {

    imgUrl = '/static/images/plots/'+initialSample+".png"
    console.log("IMAGE URL", imgUrl)

    plotarea.append("p").text(imgUrl)
    
    console.log("ASDASD", initialSample)
}
//     d3.json("data/prophet1.json").then((data) => {

//         //Prepare chart data 
//         var dataSample = data.samples;
//         var chartObj = dataSample.filter(sampleObj => sampleObj.id == initialSample);
//         var currentSample = chartObj[0];

//         // Bubble Chart
//         var bubble_trace = {
//             x: currentSample.otu_ids,
//             y: currentSample.sample_values,
//             text: currentSample.otu_labels,
//             mode: 'markers',
//             marker: {
//                 color: currentSample.otu_ids,
//                 size: currentSample.sample_values
//             }
//         };
//         var trace1 = [bubble_trace];
//         var layout = {
//             title: "OTU ID",
//             height: 500,
//             widht: 1400,
//             margin: { t:50, r:50, b:50, l:50}
//         };
//         Plotly.newPlot("bubble",trace1, layout, {responsive: true})

//         // Sort results for bar chart
//         var samplesArr = [];

//         //Prepare data to sort, Store them into Array
//         for (var i=0; i < currentSample.sample_values.length; i++) {
//             var sDict = {}

//             sDict.otu_id = currentSample.otu_ids[i]

//             sDict.value = currentSample.sample_values[i]

//             sDict.label = currentSample.otu_labels[i]
//             samplesArr.push(sDict);
//         }

//         // Sort data
//         var sortedResults = samplesArr.sort((a,b) => b.value - a.value)
//         var topResults = sortedResults.slice(0,10)
//         topResults = topResults.reverse()
//         console.log(topResults)

//         console.log(samplesArr);

//         // Bar Chart
//         var bar_trace = [{
//             type: "bar",
//             y: topResults.map(a => `otu_id: ${a.otu_id}` ),
//             x: topResults.map(a => a.value),
//             hovertext: currentSample.otu_labels.slice(0,10).reverse(),
//             marker: {color:"#1a30d9"},
//             orientation: "h",
//             name: "Belly Flora"
//         }]
//         Plotly.newPlot("bar", bar_trace, {responsive:true})

//     })
// }

// // function plotGauge(wfreq) {
// //     var data = [{
// //         domain: {x: [0, 1], y: [0, 1]},
// //         value: wfreq,
// //         mode: "gauge+number+delta",
// //         delta: {reference: 9, increasing: {color:"green"}},
// //         gauge: {
// //         axis: { range: [null, 10] },
// //             steps: [
// //             { range: [0, 5], color: "lightgray" },
// //             { range: [5, 10], color: "gray" }
// //             ],

// //         threshold: {line: { color: "red", width: 4 }},
// //         thickness: 0.75},
// //         type: "indicator",
// //         title: { 
// //             text: "Belly Button Washing Frequency Scrubs Per Week",
// //             font: {size: 15}}
// //     }]

// //     var layout = { widht: 400, height:500, margin: {t:0, b:0} };
// //     Plotly.newPlot("gauge", data, layout);
// // }

// // Event listener
options.on("change", init());

function create_WordCloud() {
    // List of words
var myWords = [{word: "Running", size: "10"}, {word: "Surfing", size: "20"}, {word: "Climbing", size: "50"}, {word: "Kiting", size: "30"}, {word: "Sailing", size: "20"}, {word: "Snowboarding", size: "60"} ]

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#wordCloud").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
// Wordcloud features that are different from one word to the other must be here
var layout = d3.layout.cloud()
  .size([width, height])
  .words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
  .padding(5)        //space between words
  .rotate(function() { return ~~(Math.random() * 2) * 90; })
  .fontSize(function(d) { return d.size; })      // font size of words
  .on("end", draw);
layout.start();

// This function takes the output of 'layout' above and draw the words
// Wordcloud features that are THE SAME from one word to the other can be here
function draw(words) {
  svg
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size; })
        .style("fill", "#69b3a2")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}
}