// Create a Line plot with Ploty using data from app.py

// Selecting page areas
var plot_area = d3.select("#plot")
var selector = d3.select("#selDateset");
var headline = d3.select("#news-headline")
var news = d3.select("#news-text")
var bar_area = d3.select("#bar-graph")
var category = d3.select("#selCategory")
var user_date = selector.node().value

// Populates drop down menu with dates from global news page
function init() {
    d3.json("/dates").then((data) => {
        var Dates = data.Story[0].Date
        var News = data.Story[0].News
        Dates.forEach((date) => {
            selector.append("option")
                .text(date.slice(0, -13))
                .property("value", date);
        })
    });

};

// updates headline and news story sections when date selected
function optionChanged() {

    let user_date = selector.node().value

    headline.html("")
    headline.append("h3")
        .text(`Headline for ${user_date.slice(0, -13)}`)

    news.html("")
    d3.json("/dates").then((data) => {
        var dates = data.Story[0]['Date']
        var ind = dates.indexOf(user_date)
        var blurb = data.Story[0]['News'][ind]
        news.append("p")
            .text(blurb)
    })

    categoryChanged()
}

// function which hopefuly returns array of dates 
function arrayToDates(arr) {
    var date_list = []
    for (var n = 0; n < arr.length; n++) {
        var dt = new Date(arr[n])
            // console.log(dt)
        date_list.push(dt)
    }
    return date_list
}

// Creates Traces
function get_traces(ticker, date, adj_Close) {
    var trace = {
        type: "scatter",
        mode: "line",
        name: ticker,
        x: date,
        y: adj_Close,
        line: {
            color: "0077df"
        }
    };
    return trace;
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


// builds entertainment plot 
function buildplot_entertainment() {
    var user_date = selector.node().value
    var dtdt = new Date(user_date)
    var end_date = new Date(dtdt - (-45 * 24 * 60 * 60 * 1000))
    var start_date = new Date(dtdt - (45 * 24 * 60 * 60 * 1000))

    var end19 = new Date(end_date - (365 * 86400000))
    var start19 = new Date(start_date - (365 * 86400000))


    plot_area.html("")
    d3.json("/entertainment").then(function(data) {

        // GC variables
        var gc = data.entertainment_stocks[0]
        var dates_gc = arrayToDates(gc.Date)
        var date_range_gc = dates_gc.filter(dt => (dt >= start_date) && (dt <= end_date))

        var start_index = dates_gc.indexOf(date_range_gc[0])
        var end_index = dates_gc.indexOf(date_range_gc[date_range_gc.length - 1])

        var prices_gc = []
        for (var x = start_index; x < end_index; x++) {
            prices_gc.push(gc.Adj_Close[x])
        }
        var avg_gc_20 = avg(prices_gc)

        // recp variables
        var recp = data.entertainment_stocks[1]
        var dates_recp = arrayToDates(recp.Date)
        var date_range_recp = dates_recp.filter(dt => (dt >= start_date) && (dt <= end_date))

        var prices_recp = []
        for (var x = start_index; x < end_index; x++) {
            prices_recp.push(recp.Adj_Close[x])
        }
        var avg_recp_20 = avg(prices_recp)


        // cgx variables
        var cgx = data.entertainment_stocks[2]
        var dates_cgx = arrayToDates(cgx.Date)
        var date_range_cgx = dates_cgx.filter(dt => (dt >= start_date) && (dt <= end_date))

        var prices_cgx = []
        for (var x = start_index; x < end_index; x++) {
            prices_cgx.push(cgx.Adj_Close[x])
        }
        var avg_cgx_20 = avg(prices_cgx)


        var trace_1 = {
            type: "scatter",
            mode: "line",
            name: gc.Ticker,
            x: date_range_gc,
            y: prices_gc,
            line: {
                color: '00d775'
            }
        };

        var trace_2 = {
            type: "scatter",
            mode: "line",
            name: recp.Ticker,
            x: date_range_recp,
            y: prices_recp,
            line: {
                color: "0077df"
            }
        };
        var trace_3 = {
            type: "scatter",
            mode: "line",
            name: cgx.Ticker,
            x: date_range_cgx,
            y: prices_cgx,
            line: {
                color: "7f6dcc"
            }
        };

        var tracedata = [trace_1, trace_2, trace_3];

        var layout = {
            title: `Entertainment Stock`,
            paper_bgcolor: '002e50',
            plot_bgcolor: '002e50',
            yaxis: {
                title: 'Stock Price (in CAD $)'
            }
        };
        Plotly.newPlot("plot", tracedata, layout)


        // Plot bar Graphs
        var date_range_19 = dates_gc.filter(dt => (dt >= start19) && (dt <= end19))
        var start_index_19 = dates_gc.indexOf(date_range_19[0])
        var end_index_19 = dates_gc.indexOf(date_range_19[date_range_19.length - 1])

        var prices_gc_19 = []
        for (var x = start_index_19; x < end_index_19; x++) {
            prices_gc_19.push(gc.Adj_Close[x])
        }
        var avg_gc_19 = avg(prices_gc_19)

        // recp variables
        var prices_recp_19 = []
        for (var x = start_index_19; x < end_index_19; x++) {
            prices_recp_19.push(recp.Adj_Close[x])
        }
        var avg_recp_19 = avg(prices_recp_19)

        // cgx variables
        var prices_cgx_19 = []
        for (var x = start_index_19; x < end_index_19; x++) {
            prices_cgx_19.push(cgx.Adj_Close[x])
        }
        var avg_cgx_19 = avg(prices_cgx_19)



        var trace1 = {
            x: ['GC', 'RECP', 'CGX'],
            y: [avg_gc_19, avg_recp_19, avg_cgx_19],
            name: '2019',
            type: 'bar',
            marker: {
                color: '00aadd'
            }
        };

        var trace2 = {
            x: ['GC', 'RECP', 'CGX'],
            y: [avg_gc_20, avg_recp_20, avg_cgx_20],
            name: '2020',
            type: 'bar',
            marker: {
                color: 'a786fe'
            }
        };

        var traces = [trace1, trace2];

        var layout2 = {
            barmode: 'group',
            title: `Average Stock Prices 2019 vs 2020`,
            paper_bgcolor: '002e50',
            plot_bgcolor: '002e50',
            yaxis: {
                title: 'Average Stock Prices (in CAD $)'
            }
        };

        Plotly.newPlot('bar-graph', traces, layout2);
    });
};


// Create a Line plot with Ploty using data from app.py
function buildplot_technology() {
    var user_date = selector.node().value
    var dtdt = new Date(user_date)
    var end_date = new Date(dtdt - (-45 * 24 * 60 * 60 * 1000))
    var start_date = new Date(dtdt - (45 * 24 * 60 * 60 * 1000))

    var end19 = new Date(end_date - (365 * 86400000))
    var start19 = new Date(start_date - (365 * 86400000))

    plot_area.html("")
    var user_date = selector.node().value

    d3.json("/technology").then(function(data) {


        // GC variables
        var gc = data.technology[0]
        var dates_gc = arrayToDates(gc.Date)
        var date_range_gc = dates_gc.filter(dt => (dt >= start_date) && (dt <= end_date))

        var start_index = dates_gc.indexOf(date_range_gc[0])
        var end_index = dates_gc.indexOf(date_range_gc[date_range_gc.length - 1])

        var prices_gc = []
        for (var x = start_index; x < end_index; x++) {
            prices_gc.push(gc.Adj_Close[x])
        }
        var avg_gc_20 = avg(prices_gc)

        // recp variables
        var recp = data.technology[1]
        var dates_recp = arrayToDates(recp.Date)
        var date_range_recp = dates_recp.filter(dt => (dt >= start_date) && (dt <= end_date))

        var prices_recp = []
        for (var x = start_index; x < end_index; x++) {
            prices_recp.push(recp.Adj_Close[x])
        }
        var avg_recp_20 = avg(prices_recp)

        var trace_1 = {
            type: "scatter",
            mode: "line",
            name: gc.Ticker,
            x: date_range_gc,
            y: prices_gc,
            line: {
                color: '00d775'
            }
        };

        var trace_2 = {
            type: "scatter",
            mode: "line",
            name: recp.Ticker,
            x: date_range_recp,
            y: prices_recp,
            line: {
                color: "0077df"
            }
        };

        var tracedata = [trace_1, trace_2];

        var layout = {
            title: `Telecommunication Stock`,
            paper_bgcolor: '002e50',
            plot_bgcolor: '002e50',
            yaxis: {
                title: 'Stock Price (in CAD $)'
            }
        };

        Plotly.newPlot("plot", tracedata, layout)


        // Plot bar Graphs
        var date_range_19 = dates_gc.filter(dt => (dt >= start19) && (dt <= end19))
        var start_index_19 = dates_gc.indexOf(date_range_19[0])
        var end_index_19 = dates_gc.indexOf(date_range_19[date_range_19.length - 1])

        var prices_gc_19 = []
        for (var x = start_index_19; x < end_index_19; x++) {
            prices_gc_19.push(gc.Adj_Close[x])
        }
        var avg_gc_19 = avg(prices_gc_19)

        // recp variables
        var prices_recp_19 = []
        for (var x = start_index_19; x < end_index_19; x++) {
            prices_recp_19.push(recp.Adj_Close[x])
        }
        var avg_recp_19 = avg(prices_recp_19)

        var trace1 = {
            x: ['HIVE.V', 'SHOP'],
            y: [avg_gc_19, avg_recp_19],
            name: '2019',
            type: 'bar',
            marker: {
                color: '00aadd'
            }
        };

        var trace2 = {
            x: ['HIVE.V', 'SHOP'],
            y: [avg_gc_20, avg_recp_20],
            name: '2020',
            type: 'bar',
            marker: {
                color: 'a786fe'
            }
        };

        var traces = [trace1, trace2];

        var layout2 = {
            barmode: 'group',
            title: `Average Stock Prices 2019 vs 2020`,
            paper_bgcolor: '002e50',
            plot_bgcolor: '002e50',
            yaxis: {
                title: 'Average Stock Prices (in CAD $)'
            }
        };

        Plotly.newPlot('bar-graph', traces, layout2);
    });
};



// Create a Line plot with Ploty using data from app.py
function buildplot_telecommunication() {
    var user_date = selector.node().value
    var dtdt = new Date(user_date)
    var end_date = new Date(dtdt - (-45 * 24 * 60 * 60 * 1000))
    var start_date = new Date(dtdt - (45 * 24 * 60 * 60 * 1000))
    var end19 = new Date(end_date - (365 * 86400000))
    var start19 = new Date(start_date - (365 * 86400000))

    plot_area.html("")
    d3.json("/telecommunication").then(function(data) {

        // GC variables
        var gc = data.telecommunication_stocks[0]
        var dates_gc = arrayToDates(gc.Date)
        var date_range_gc = dates_gc.filter(dt => (dt >= start_date) && (dt <= end_date))

        var start_index = dates_gc.indexOf(date_range_gc[0])
        var end_index = dates_gc.indexOf(date_range_gc[date_range_gc.length - 1])

        var prices_gc = []
        for (var x = start_index; x < end_index; x++) {
            prices_gc.push(gc.Adj_Close[x])
        }
        var avg_gc_20 = avg(prices_gc)

        // recp variables
        var recp = data.telecommunication_stocks[1]
        var dates_recp = arrayToDates(recp.Date)
        var date_range_recp = dates_recp.filter(dt => (dt >= start_date) && (dt <= end_date))

        var prices_recp = []
        for (var x = start_index; x < end_index; x++) {
            prices_recp.push(recp.Adj_Close[x])
        }
        var avg_recp_20 = avg(prices_recp)

        var trace_1 = {
            type: "scatter",
            mode: "line",
            name: gc.Ticker,
            x: date_range_gc,
            y: prices_gc,
            line: {
                color: '00d775'
            }
        };

        var trace_2 = {
            type: "scatter",
            mode: "line",
            name: recp.Ticker,
            x: date_range_recp,
            y: prices_recp,
            line: {
                color: "0077df"
            }
        };

        var tracedata = [trace_1, trace_2];

        var layout = {
            title: `Telecommunication Stock`,
            paper_bgcolor: '002e50',
            plot_bgcolor: '002e50',
            yaxis: {
                title: 'Stock Price (in CAD $)'
            }
        };
        Plotly.newPlot("plot", tracedata, layout)


        // Plot bar Graphs
        var date_range_19 = dates_gc.filter(dt => (dt >= start19) && (dt <= end19))
        var start_index_19 = dates_gc.indexOf(date_range_19[0])
        var end_index_19 = dates_gc.indexOf(date_range_19[date_range_19.length - 1])

        var prices_gc_19 = []
        for (var x = start_index_19; x < end_index_19; x++) {
            prices_gc_19.push(gc.Adj_Close[x])
        }
        var avg_gc_19 = avg(prices_gc_19)

        // recp variables
        var prices_recp_19 = []
        for (var x = start_index_19; x < end_index_19; x++) {
            prices_recp_19.push(recp.Adj_Close[x])
        }
        var avg_recp_19 = avg(prices_recp_19)


        var trace1 = {
            x: ['RCI-B', 'BCE'],
            y: [avg_gc_19, avg_recp_19],
            name: '2019',
            type: 'bar',
            marker: {
                color: '00aadd'
            }
        };

        var trace2 = {
            x: ['RCI-B', 'BCE'],
            y: [avg_gc_20, avg_recp_20],
            name: '2020',
            type: 'bar',
            marker: {
                color: 'a786fe'
            }
        };

        var traces = [trace1, trace2];

        var layout2 = {
            barmode: 'group',
            title: `Average Stock Prices 2019 vs 2020`,
            paper_bgcolor: '002e50',
            plot_bgcolor: '002e50',
            yaxis: {
                title: 'Average Stock Prices (in CAD $)'
            }
        };

        Plotly.newPlot('bar-graph', traces, layout2);
    });
};


// Create a Line plot with Ploty using data from app.py
function buildplot_aviation() {
    var user_date = selector.node().value
    var dtdt = new Date(user_date)
    var end_date = new Date(dtdt - (-45 * 24 * 60 * 60 * 1000))
    var start_date = new Date(dtdt - (45 * 24 * 60 * 60 * 1000))
    var end19 = new Date(end_date - (365 * 86400000))
    var start19 = new Date(start_date - (365 * 86400000))

    plot_area.html("")
    d3.json("/aviation").then(function(data) {

        // GC variables
        var gc = data.aviation_stocks[0]
        var dates_gc = arrayToDates(gc.Date)
        var date_range_gc = dates_gc.filter(dt => (dt >= start_date) && (dt <= end_date))

        var start_index = dates_gc.indexOf(date_range_gc[0])
        var end_index = dates_gc.indexOf(date_range_gc[date_range_gc.length - 1])

        var prices_gc = []
        for (var x = start_index; x < end_index; x++) {
            prices_gc.push(gc.Adj_Close[x])
        }
        var avg_gc_20 = avg(prices_gc)

        // recp variables
        var recp = data.aviation_stocks[1]
        var dates_recp = arrayToDates(recp.Date)
        var date_range_recp = dates_recp.filter(dt => (dt >= start_date) && (dt <= end_date))

        var prices_recp = []
        for (var x = start_index; x < end_index; x++) {
            prices_recp.push(recp.Adj_Close[x])
        }
        var avg_recp_20 = avg(prices_recp)

        var trace_1 = {
            type: "scatter",
            mode: "line",
            name: gc.Ticker,
            x: date_range_gc,
            y: prices_gc,
            line: {
                color: '00d775'
            }
        };

        var trace_2 = {
            type: "scatter",
            mode: "line",
            name: recp.Ticker,
            x: date_range_recp,
            y: prices_recp,
            line: {
                color: "0077df"
            }
        };

        var tracedata = [trace_1, trace_2];


        var layout = {
            title: `Aviation Stock`,
            paper_bgcolor: '002e50',
            plot_bgcolor: '002e50',
            yaxis: {
                title: 'Stock Price (in CAD $)'
            }
        };
        Plotly.newPlot("plot", tracedata, layout)


        // Plot bar Graphs
        var date_range_19 = dates_gc.filter(dt => (dt >= start19) && (dt <= end19))
        var start_index_19 = dates_gc.indexOf(date_range_19[0])
        var end_index_19 = dates_gc.indexOf(date_range_19[date_range_19.length - 1])

        var prices_gc_19 = []
        for (var x = start_index_19; x < end_index_19; x++) {
            prices_gc_19.push(gc.Adj_Close[x])
        }
        var avg_gc_19 = avg(prices_gc_19)

        // recp variables
        var prices_recp_19 = []
        for (var x = start_index_19; x < end_index_19; x++) {
            prices_recp_19.push(recp.Adj_Close[x])
        }
        var avg_recp_19 = avg(prices_recp_19)

        var trace1 = {
            x: ['BBD-B', 'AC'],
            y: [avg_gc_19, avg_recp_19],
            name: '2019',
            type: 'bar',
            marker: {
                color: '00aadd'
            }
        };

        var trace2 = {
            x: ['BBD-B', 'AC'],
            y: [avg_gc_20, avg_recp_20],
            name: '2020',
            type: 'bar',
            marker: {
                color: 'a786fe'
            }
        };

        var traces = [trace1, trace2];

        var layout2 = {
            barmode: 'group',
            title: `Average Stock Prices 2019 vs 2020`,
            paper_bgcolor: '002e50',
            plot_bgcolor: '002e50',
            yaxis: {
                title: 'Average Stock Prices (in CAD $)'
            }
        };

        Plotly.newPlot('bar-graph', traces, layout2);
    });
};

// creates layout portion of plotly graph 
function get_layout(title) {
    var layout = {
        title: title,
        paper_bgcolor: '002e50',
        plot_bgcolor: '002e50',
        yaxis: {
            title: 'Stock Price (in CAD $)'
        }
    };

    return layout
}


// Load initial functions
init();

// plot initial graph
buildplot_aviation();

// Load ticker selection section
load_Tickers();

// Listener for category change
category.on("change", categoryChanged)

function categoryChanged() {
    var user_category = category.property("value")
    var url = `"/${user_category}"`
    if (user_category === "aviation") {
        buildplot_aviation(),
            d3.json(url).then((data) => {
                var dates = data.aviation_stocks[0].Date.map(d => new Date(d))
                console.log(dates)
            })
    } else if (user_category === "entertainment") { buildplot_entertainment() } else if (user_category === "technology") { buildplot_technology() } else { buildplot_telecommunication() }
}


var tickerSelector = d3.select("#selTicker");

function load_Tickers() {
    tickerlist = [{
                name: "Enbridge",
                symbol: "ENB.TO"
            },
            {
                name: "Canadian Tire",
                symbol: "CTC-A.TO"
            },
            {
                name: "Bank of Scotia",
                symbol: "BNS.TO"
            },
            {
                name: "Fortis",
                symbol: "FTS.TO"
            }
        ]
        //tickerlist = ["ENB.TO","CTC-A.TO","FTS.TO","BNS.TO"]
    tickerSelector = d3.select("#selTicker");
    tickerlist.forEach(d => {
        console.log(d)
        tickerSelector.append("option").text(d.name).property("value", d.symbol)
    })

}

function get_stock_data() {

}

tickerSelector.on("change", get_stock_data)


// creates date range
function dateRange(user_date) {
    var dtdt = new Date(user_date)
    var end_date = new Date(dtdt - (-45 * 24 * 60 * 60 * 1000))
    var start_date = new Date(dtdt - (45 * 24 * 60 * 60 * 1000))

    return start_date, end_date
}