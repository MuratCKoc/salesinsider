

// d3 bindings to html
var options = d3.select("#select")
var selector = d3.select("#selDataset");
var demographics = d3.select("#sample-metadata");
var plotarea = d3.select("#plot_area")
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

function get_wordCloud_Data(){
  d3.json("/api/maths").then
}

function get_Calculations(){
    // var results = JSON.parse(url)
    // console.log(results)
    d3.json(url).then((data) => {
        set_dropDown(data)
    
      })

    console.log(url)
}

function set_dropDown(data) {
          // Populate Drop Down
        var columns = Object.keys(data)
        // Remove Dates
        columns.shift()
        
        var PATTERN = /_Predicted/
        predicted_columns = columns.filter(function (str) { return PATTERN.test(str); });
        predicted_columns.forEach((item) => {
                selector.append("option")
                .text(item)
                .property("value",item);
        })
}

function get_count() {
  var sumDict = {}
  sum =0 ;
  // Object.entries(data).forEach(([key,value]) => {
  //   console.log(`${key}: ${value}`);

  //     Object.entries(value).forEach(([k_,value])=>{
  //       console.log(`${value}`)
  //           if (k_ === "Date" ) {
  //             console.log("Skipped?")
  //         }
  //         else {
  //         sum += value
  //         }
  //     } ) 
  //     sumDict[key] = sum;
  //     sum =0;
  // })

  //   console.log("ASD", sumDict)
}




// optionChanged function to reload data
function optionChanged(newSample) {
  plotarea.html("")
    build_Charts(newSample);
    //buildMetadata(newSample);
}

init();

function build_Charts(initialSample) {
    //imgUrl = 'https://github.com/MuratCKoc/salesinsider/tree/main/salesinsider/static/images/plots/'
    img_path = '../static/images/plots/'
    imgUrl = img_path+initialSample+'.png'
    console.log("IMAGE URL", imgUrl)

    plotarea.append("img").attr("src",imgUrl).attr("width", 700)
        .attr("height", 500)

    //plot_area.html("")
    // plotarea.append("svg:image")
    //     .attr("xlink:href", imgUrl)
    //     .attr("width", 500)
    //     .attr("height", 800)
    
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


function create_barChart() {
  // create 2 data_set
var data1 = [
   {group: "A", value: 4},
   {group: "B", value: 16},
   {group: "C", value: 8}
];

var data2 = [
   {group: "A", value: 7},
   {group: "B", value: 1},
   {group: "C", value: 20}
];

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#barChart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data1.map(function(d) { return d.group; }))
  .padding(0.2);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 20])
  .range([ height, 0]);
svg.append("g")
  .attr("class", "myYaxis")
  .call(d3.axisLeft(y));

// A function that create / update the plot for a given variable:
function update(data) {

  var u = svg.selectAll("rect")
    .data(data)

  u
    .enter()
    .append("rect")
    .merge(u)
    .transition()
    .duration(1000)
      .attr("x", function(d) { return x(d.group); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", "#69b3a2")
}

// Initialize the plot with the first dataset
update(data1)
}

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