

// d3 bindings to html
var options = d3.select("#select")
var selector = d3.select("#selDataset");
var demographics = d3.select("#sample-metadata");
var plotarea = d3.select("#plot_area")
var url = "/api/predicted_table"

function init() {

    get_Calculations()
    create_WordCloud()
};


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

/**
 * Sort object properties (only own properties will be sorted).
 * @param {object} obj object to sort properties
 * @param {bool} isNumericSort true - sort object properties as numeric value, false - sort as string value.
 * @returns {Array} array of items in [[key,value],[key,value],...] format.
 */
function sortProperties(obj, isNumericSort)
{
	isNumericSort=isNumericSort || false; // by default text sort
	var sortable=[];
	for(var key in obj)
		if(obj.hasOwnProperty(key))
			sortable.push([key, obj[key]]);
	if(isNumericSort)
		sortable.sort(function(a, b)
		{
			return a[1]-b[1];
		});
	else
		sortable.sort(function(a, b)
		{
			var x=a[1].toLowerCase(),
				y=b[1].toLowerCase();
			return x<y ? -1 : x>y ? 1 : 0;
		});
	return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}


// function get_wordCloud_Data() {
//   var myWords = []
//   d3.json('/api/nodate').then((data) => {
//         console.log(data)
//         var myarr = sortProperties(data, true );
//         var convArr = myarr.reverse().slice(0,10)
//         console.log("ORDERED",myarr.reverse().slice(0,10))
//         console.log(convArr[0][0])
//         console.log(convArr.keys)
//         console.log(convArr.values)
//         //var myWords = []

      
//         for (let i=0; i<convArr.length;i++){
//           var temp_={}
//           temp_['word']=convArr[i][0]
//           temp_['size']=convArr[i][1]
//           console.log(temp_)
//           myWords.push(temp_)
//         }
//     return myWords
// })}

function create_WordCloud() {
    // List of words
    
  // var myWords = get_wordCloud_Data()

  //       console.log("myWord",myWords)
      


var myWords = [{word: "whole_milk", size: "40"}, 
{word: "other_vegetables", size: "35"}, 
{word: "rolls_or_buns", size: "31"}, 
{word: "yogurt", size: "28"}, 
{word: "beef", size: "26"},
{word: "bottled_beer", size: "24"},
{word: "candy", size: "19"},
{word: "cake_bar", size: "21"},
{word: "liquor", size: "8"},
{word: "spice", size: "12"},
{word: "snack_products", size: "14"},
{word: "shopping_bags", size: "19"},
{word: "soda", size: "18"},
{word: "tropical_fruit", size: "14"} ]

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