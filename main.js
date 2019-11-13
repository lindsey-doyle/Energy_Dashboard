//const JSONFileName = 'assets/springfield.json';


/**
 * In order to synchronize tooltips and crosshairs, override the
 * built-in events with handlers defined on the parent element.
 */
/*
['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
    document.getElementById('container').addEventListener(
        eventType,
        function (e) {
            var chart,
                point,
                i,
                event;

            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                // Find coordinates within the chart
                event = chart.pointer.normalize(e);
                // Get the hovered point
                point = chart.series[0].searchPoint(event, true);

                if (point) {
                    point.highlight(e);
                }
            }
        }
    );
});
*/

/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
/*
Highcharts.Pointer.prototype.reset = function () {
    return undefined;
};

*/

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
/*
Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

/**
 * Synchronize zooming through the setExtremes event handler.
 */
/*
function syncExtremes(e) {
    var thisChart = this.chart;

    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.each(Highcharts.charts, function (chart) {
            if (chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(
                        e.min,
                        e.max,
                        undefined,
                        false,
                        { trigger: 'syncExtremes' }
                    );
                }
            }
        });
    }
}

*/


// config for the Energy Generation graph (stacked area graph)
var energyConfig = {
    chart: {
            type: 'area',
            marginLeft: 40, // Keep all charts left aligned
            spacingTop: 20,
            spacingBottom: 20        
    },
    title: {
        text: 'Generation MW',
        fontSize: 18,
    },
    "crosshair-x":{
        shared: true
    },
    
    plot: {
        tooltip:{
            visible: false
        },
        aspect: "spline",
        stacked: true
    },
    plotarea: {
        margin: "dynamic"
    },
    "scale-x": {
        "min-value": 1571579700,
        "step": "30minute",
        "transform": {
            "type": "date",
            "all": "%m/%d/%Y<br>%h:%i:%s:%q %A"
        },
        "item": {
            "font-size": 9
        }
    },
    "utc": true,
    "timezone": 0,
    'scale-y': {
        values: "0:80:10",
        format: "%v",
        guide: {
            'line-style': "dotted"
        }
    },
    series: []
}
// Config for the Price graph (line graph)
var priceConfig = {
    chart: {
            type: 'line',
            marginLeft: 40, // Keep all charts left aligned
            spacingTop: 20,
            spacingBottom: 20        
    },
    title: {
        text: 'Price $/MWh',
        fontSize: 18,
    },
    "crosshair-x":{
        shared: true
    },
    plot: {
        tooltip:{
            visible: false
        }
    },
    plotarea: {
    },
    "scale-x": {
        "min-value": 1571579700,
        "step": "30minute",
        "transform": {
            "type": "date",
            "all": "%m/%d/%Y<br>%h:%i:%s:%q %A"
        },
        "item": {
            "font-size": 9
        }
    },
    "utc": true,
    "timezone": 0,
    'scale-y': {
        values: "0:30",
        format: "%v",
        guide: {
          'line-style': "dotted"
        }
    },
      series: []
}
// Config for the Temperature graph ()
var tempConfig = {
    // config for the temperature line graph
    chart: {
            type: "line",
            marginLeft: 40, // Keep all charts left aligned
            spacingTop: 20,
            spacingBottom: 20        
    },
    title: {
        text: 'Temperature degreesF',
        fontSize: 18,
    },
    "crosshair-x":{
        shared: true
    },
    plot: {
        tooltip:{
            visible: false
        }
    },
    plotarea: {
    },
    "scale-x": {
        "min-value": 1571579700,
        "step": "30minute",
        "transform": {
            "type": "date",
            "all": "%m/%d/%Y<br>%h:%i:%s:%q %A"
        },
        "item": {
            "font-size": 9
        }
    },
    "utc": true,
    "timezone": 0,
    'scale-y': {
        values: "0:80:20",
        format: "%v",
        guide: {
            'line-style': "dotted"
        }
    },
      series: []
}

/*
var pieConfig = {
    chart: {
        type: "pie"    
    },
    //type: "pie",
    plot: {
        valueBox: {
            text: '%t\n%npv%'
        }
    },
    title: {
        text: 'Energy Breakup'
    },
    plotarea: {
        margin: "0 0 0 0"
    },
    series: []
  };
  */

// Create global data structure to hold energy breakup 
var globalEnergyData = {
    keys: [],
    values: []
  };

// Function to deep-copy the global data structure (for energy breakup data)
function updateGlobalEnergyData(data) {
    globalEnergyData['values'] = [];
    for (var idx = 0; idx < data[0]['data'].length; idx ++) {
      var energyBreakup = data.map(elm => {return elm['data'][idx]});
      globalEnergyData['values'].push(energyBreakup);
    }
    globalEnergyData['keys'] = data.map(elm => elm['name']);
}


// Function to load data for each chart and ...
// .......
function onSuccessCb(jsonData) {
    
    // getting the Energy data 
    var energyData = jsonData.filter(function(elm) {
        return elm['type'] === 'power';
    }).map(function(elm) {
        return {
          data: elm['history']['data'],
          name: elm['id']
        };
    });
    updateGlobalEnergyData(energyData); // make deep copy

    // getting the Price data
    var priceData = jsonData.filter(function(elm) {
        return elm['type'] === 'price';
    }).map(function(elm) {
        return {
          data: elm['history']['data'],
          name: elm['id']
        };
    });

    // getting the Temperature data 
    var tempData = jsonData.filter(function(elm) {
        return elm['type'] === 'temperature';
    }).map(function(elm) {
        return {
          data: elm['history']['data'],
          name: elm['id']
        };
    });

    /*
    var pieDataSet = globalEnergyData['keys'].map(function(elm, idx) {
        return {
          data: elm.split('.')[elm.split('.').length - 1],  // 'text:
          name: [globalEnergyData['data'][nodeId][idx]]  // 'values: // NEXT change 'vals to 'data' here 
        }
    });
    */
    
      
    // set series of each graph config to corresponding dataset
    energyConfig.series = energyData;
    priceConfig.series = priceData;
    tempConfig.series = tempData;
    
    /*
    pieConfig.series = pieDataSet;
    */

    //  create charts 
    var chartDiv1 = document.createElement('div');
    chartDiv1.className = 'chart';
    document.getElementById('sharedGrid').appendChild(chartDiv1);
    Highcharts.chart(chartDiv1, energyConfig);

    var chartDiv2 = document.createElement('div');
    chartDiv2.className = 'chart';
    document.getElementById('sharedGrid').appendChild(chartDiv2);
    Highcharts.chart(chartDiv2, priceConfig);

    var chartDiv3 = document.createElement('div');
    chartDiv3.className = 'chart';
    document.getElementById('sharedGrid').appendChild(chartDiv3);
    Highcharts.chart(chartDiv3, tempConfig);
    
    /*
    var chartDiv4 = document.createElement('div');
    chartDiv4.className = 'chart';
    document.getElementById('pieGrid').appendChild(chartDiv4);
    Highcharts.chart(chartDiv4, pieConfig);
    */
    
}

// Utility function to fetch any file from the server
function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200 || httpRequest.status === 0) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            } else {
                "with error:", httpRequest.statusText;
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
}

// The entrypoint of the script execution
function doMain() {
    fetchJSONFile("assets/springfield.json", onSuccessCb);
}

document.onload = doMain();
