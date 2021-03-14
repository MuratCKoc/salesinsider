// Select page sections
var date_selector = d3.select("#selDateset")
var plot_area = d3.select("#plot")
var headline = d3.select("#news-headline")
var news_section = d3.select("#news-text")
var bar_area = d3.select("#bar-graph")
var category = d3.select("#selCategory")
var user_date = date_selector.node().value
var header_text = d3.select("#plot-header")

// Initialization function for index page
function init() {
    load_Dates();
    load_News();
};

// DATES CHANGED
function optionChanged() {
    load_News();
    categoryChanged();
}

// CATEGORY CHANGED
function categoryChanged() {
    console.log("CategoryChanged")
    console.log(category.property("value"))

    buildplot_Categories()
}

// LOAD Dates Function
function load_Dates(){
    var url = "/"+"dates"
    d3.json(url).then((data) => {
        // Pull data from news date table
        var Dates = data.Story[0].Date

        // Populate Dates selector section
        Dates.forEach((date) => {
            var date = date
            date_selector.append("option")
                .text(date.slice(0, -13))
                .property("value",date);
        });
    });
}

// LOAD News Function
function load_News(){
    var user_date = date_selector.node().value;

    //console.log("NEWS DATE",user_date)
    headline.html("")
    headline.append("h3")
        .text(`Headline for ${user_date.slice(0, -13)}`)

    news_section.html("")
    d3.json("/dates").then((data) => {
        var dates = data.Story[0]['Date']
        var ind = dates.indexOf(user_date)
        var blurb = data.Story[0]['News'][ind]
        news_section.append("p").text(blurb)
    });
}

//========= PLOT FUNCTION
function buildplot_Categories() {

    plot_area.html("")

    // Get Selected category
    var user_category = category.property("value")

    // Set url
    var url = `/${user_category}`

    d3.json(url).then(function(data) {

        // Set array data binding
        if ( user_category === "aviation" ) { 
            gc_route = data.aviation_stocks
            var bar_x = ["BBD-B", "AC"]
            header_text.html('')
            header_text.append('p').text('BBD-B: Bombardier Inc  |  AC: Air Canada')
             }
        else if ( user_category === "technology" )
            { gc_route = data.technology
            var bar_x = ["KXS","SHOP"] 
            header_text.html('')
            header_text.append('p').text('KXS: Kinaxis Inc  |  SHOP: Sopify Inc')
        }
        else if ( user_category === "entertainment" )
            { 
            gc_route = data.entertainment_stocks
            var bar_x = ["GC", "RECP", "CGX"]
            var cgx = get_DateRange(gc_route[2],"scatter")
            var cgx_b = get_DateRange(gc_route[2],"bar")
            var trace_3 = get_Trace(cgx,"7f6dcc")
            header_text.html('')
            header_text.append('p').text('GC: Great Canadian Gaming Corp  |  RECP: Recipe Unlimited Corp  |  CGX: Cineplex Inc')
            }
        else { 
            gc_route = data.telecommunication_stocks
            var bar_x = ["RCI-B", "BCE"]
            header_text.html('')
            header_text.append('p').text('RCI-B: Rogers Communications Inc Class B  |  BCE: BCE Inc (formerly Bell Canada Enterprises)')
        }

        var gc = get_DateRange(gc_route[0],"scatter")
        var trace_1 = get_Trace(gc,"00d775")
        
        var recp = get_DateRange(gc_route[1],"scatter")
        var trace_2 = get_Trace(recp,"0077df")

        if (user_category === "entertainment"){   
            var tracedata = [trace_1,trace_2,trace_3]
        }
        else {
            var tracedata = [trace_1, trace_2];
        };

        var layout = get_Layout(user_category);
        var config = {responsive: true};
        Plotly.newPlot("plot", tracedata, layout, config);


        // Build bar graphs  -  needs improvement
        gc_19 = get_DateRange(gc_route[0],"bar")
        recp_19 = get_DateRange(gc_route[1],"bar")
 
        if (user_category==="entertainment"){
            var avg_prices_20 = [gc.priceAvg,recp.priceAvg,cgx.priceAvg]
            var avg_prices_19 = [gc_19.priceAvg,recp_19.priceAvg,cgx_b.priceAvg]
            console.log(avg_prices_19)
            console.log(avg_prices_20)
        }
        else {
            var avg_prices_20 = [gc.priceAvg,recp.priceAvg]
            var avg_prices_19 = [gc_19.priceAvg,recp_19.priceAvg]
            console.log(avg_prices_19)
            console.log(avg_prices_20)
        }


        var trace1 = get_BarTrace(
            bar_x,
            avg_prices_19,
            "2019",
            "a786fe")

        var trace2 = get_BarTrace(
            bar_x,
            avg_prices_20,
            "2020",
            "00aadd")

        var traces = [trace1, trace2];

        var layout2 = {
            legend: {
                font:{ color:'ffffff'}
            },
            barmode: 'group',
            title: {
                text: `Average Stock Prices 2019 vs 2020`,
                font:
                {
                    color:'ffffff'
                }
            },
            //autosize: false,
            paper_bgcolor: '002e50',
            plot_bgcolor: '002e50',
            yaxis: {
                title: 'Average Stock Prices (in CAD $)', 
                color: 'ffffff'
            }, 
            xaxis: {
                color: 'ffffff'
            }
        };
        Plotly.newPlot('bar-graph', traces, layout2, config);

    })

}


//========================//
//======== Price Related Functions
function get_Prices(gc,start_index,end_index) {

        var priceList = []
        for (let x = start_index; x < end_index; x++) {
            priceList.push(gc.Adj_Close[x])
        }
        var priceAvg = avg(priceList)
        var pricesDict = {
            "priceList" : priceList,
            "priceAvg" : priceAvg
        }
        return pricesDict
}
// Calculates average close prices
function avg(arr) {
    var sum = 0
    for (var n = 0; n < arr.length; n++) {
        var price = arr[n]
        sum += price
    }
    var average_price = sum / arr.length
    return average_price
}

//===========================//
//========== PLOT Related Functions
// GET TITLE
function get_Title(Title) {
    return Title.charAt(0).toUpperCase() + Title.slice(1) +" Stock";
}
// GET TRACES
function get_Trace(gc,colorCode) {
            var trace= {
            type: "scatter",
            mode: "line",
            name: gc.ticker,
            x: gc.date_range,
            y: gc.priceList,
            line: {
                color: colorCode
            }
        };
    return trace
}


// GET LAYOUT
function get_Layout(Title) {
    var layout = {
    legend: {
            font:{ color:'ffffff'}
        },
    title: {
        text: get_Title(Title), 
        font: {
            color: '#ffffff'
          }
        },
    paper_bgcolor: '002e50',
    plot_bgcolor: '002e50',
    yaxis: {
        title: 'Stock Price (in CAD $)',
        color: 'ffffff'
    },
    xaxis: {
        color: '#ffffff'
    }
}
    return layout
};


// GET BAR_TRACE
function get_BarTrace(bar_x,avg_prc,Name,colorCode) {
    console.log(avg_prc)
        var trace = {
            x: bar_x,
            y: avg_prc,
            name: Name,
            type: 'bar',
            marker: {
                color: colorCode
            }
        };
    return trace
};

//=============================//
//========== Date Related FUNCTIONS
// Date Dictionary
function get_DateDictionary (){

    var user_date = get_Dates(date_selector.node().value,0)
    var start_date = get_Dates(user_date,1)
    var end_date = get_Dates(user_date,-1)
    var end19 = get_Dates(end_date,365)
    var start19 = get_Dates(start_date,365)


    var datesDict = {
        "user_date" : user_date,
        "start_date" : start_date,
        "end_date" : end_date,
        "end19" : end19,
        "start19" : start19
    }
    return datesDict;
};

// GET DATE RANGE
function get_DateRange(gc,type) {

    // Get Dates dictionary
    var dateDict = get_DateDictionary()
    var ticker = gc.Ticker
    var dates_gc = arrayToDates(gc.Date)

//Needs improvement scatter 
    if (type === "scatter"){
        var date_range_gc = dates_gc.filter(dt => (dt >= dateDict.start_date) && (dt <= dateDict.end_date))
        var start_index = dates_gc.indexOf(date_range_gc[0])
        var end_index = dates_gc.indexOf(date_range_gc[date_range_gc.length - 1])
        var pricesDict = get_Prices(gc,start_index,end_index)
        console.log(pricesDict)
    }
    else if (type === "bar") {
        var date_range_19 = dates_gc.filter(dt => (dt >= dateDict.start19) && (dt <= dateDict.end19))
        var start_index_19 = dates_gc.indexOf(date_range_19[0])
        var end_index_19 = dates_gc.indexOf(date_range_19[date_range_19.length - 1])
        var pricesDict = get_Prices(gc,start_index_19,end_index_19)
    }

    dateRangeDict = {
        "ticker": ticker,
        "dates": dates_gc,
        "end19": dateDict.end19,
        "start19": dateDict.start19,
        "date_range": date_range_gc,
        "start_index": start_index,
        "end_index": end_index,
        "priceAvg": pricesDict.priceAvg,
        "priceList":pricesDict.priceList
    }
    return dateRangeDict
};

/**
 * Convert strings to new Date format
 * @param {string} dateV, 
 * @param {number} time {{date type -1,0,1,365}}
 * @return {Date} 
 * */ 
function get_Dates(dateV,time) {

    // Convert default date
    if (time === 0) { return new Date(dateV) }
    // Get start date
    else if (time === 1) 
        { return new Date(dateV - (45 * 25 * 60 * 60 *1000) ) }
    // Get end date
    else if (time === -1) 
        { return new Date(dateV - (-45 * 25 * 60 * 60 *1000) ) }

    // Get 365 Conversion
    else if (time === 365) 
        { return new Date(dateV - (365 * 86400000) ) }

}

/**
 * Convert strings to new Date format
 * @param {string} array, 
 * @return {date} list
 * */ 
function arrayToDates(arr) {
    var date_list = []
    for (var n = 0; n < arr.length; n++) {
        var dt = new Date(arr[n])
            // console.log(dt)
        date_list.push(dt)
    }
    return date_list
}; 

// Initialize the page
init();

//====================//
//======Event Listeners
// Date selector listener
date_selector.on("change",optionChanged());

// Category change listener
category.on("change", categoryChanged); 