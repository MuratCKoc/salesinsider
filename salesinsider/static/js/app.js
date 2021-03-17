// d3 bindings to html
var options = d3.select("#select")
var selector = d3.select("#selDataset");
var demographics = d3.select("#sample-metadata");


function init() {
    // Populate the dropdown
    d3.json("../data/prophet1.json").then((data) =>  {
        var Names = data.names;
        Names.forEach((sample) => {
            selector.append("option").text(sample).property("value",sample);
        })
        console.log(Names);

        // Use the first sample to init the charts
        const initialSample = Names[0];
        build_Charts(initialSample);
        buildMetadata(initialSample)
    });
};

function buildMetadata(initialSample) {
    var panel = d3.select("#sample-metadata");

    d3.json("../data/prophet1.json").then(function (data) {
        demographics.html("");

        var all_metadata = data.metadata
        // Filter the data
        var sample_metadata = all_metadata.filter(line => line.id == initialSample)
        
        // Plot Guage
        plotGauge(sample_metadata[0].wfreq);

        Object.entries(sample_metadata[0]).forEach(([key, value]) => {
            panel.append("h5").text(`${key}: ${value}`);
        });
    })
}

// optionChanged function to reload data
function optionChanged(newSample) {
    build_Charts(newSample);
    buildMetadata(newSample);
}

// function build_Charts(initialSample) {
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
