$(function (){
    $.ajax({
        url: "/graph/portscan/",
        type: "GET",
        data:{},
        success: function (data) {
            $("#loadinfo").html("");
            let port=[];
            let count=[];
            for(let key in data){
                port.push(key);
                count.push(data[key]);
            }
            //console.log(port,count);
            var trace={
              x: port,
              y: count,
              type: "scatter",
              mode: 'markers',
              marker: {
                size: 12,
                showscale: true,
                color: count,
                colorscale: [[0,'green'],[0.001,'lightgray'],[0.0025,'blue'],[0.005,'salmon'],[0.009,'yellow'],[0.02,'purple'],[0.5,'orange'],[1,'red']],
                colorbar: {
                    title: "Port Count ColorScale",
                }
              }
            };
            var layout0={
                title: 'Port Scanning',
                yaxis: {
                    //autorange: true,
                    range: [0,100],
                    title: 'Port Count upto 100'
                },
                xaxis: {
                    autorange: true,
                    title: 'Source Port Number'
                }
            };
            var layout={
                title: 'Port Scanning',
                xaxis: {
                    autorange: true,
                    title: 'Source Port Number'
                },
                yaxis: {
                    autorange: true,
                    range: [0,100],
                    title: 'Port Count'
                }
            };
            Plotly.newPlot('portscan0',[trace],layout0);
            Plotly.newPlot('portscan',[trace],layout);
        },
        error: function (error_data) {
            console.log(error_data);
        }
    });

    $.ajax({
        url: '/fetch/coordinates/',
        success: function (data) {
            var trace1={
                type: 'scattergeo',
                mode: "markers+text",
                text: data['src_ip'],
                //textposition: ['top right','top left','top center','bottom right','top right','top left','top right'],
                lon: data['src_lon'],
                lat: data['src_lat'],
                marker: {
                    size: 14,
                    //color: ['#bebada','#fdb462','#fb8072','#d9d9d9','#bc80bd','#b3de69','#35891d'],
                    line: {
                        width: 1,
                    }
                },
                name: 'Source Ip Tracing'
            };
            var trace2={
                type: 'scattergeo',
                mode: "markers+text",
                text: data['dst_ip'],
                //textposition: ['top right','top left','top center','bottom right','top right','top left','top right'],
                lon: data['dst_lon'],
                lat: data['dst_lat'],
                marker: {
                    size: 14,
                    //color: ['#bebada','#fdb462','#fb8072','#d9d9d9','#bc80bd','#b3de69','#35891d'],
                    line: {
                        width: 1,
                    }
                },
                name: 'Destination Ip Tracing'
            };
            let layout={
                title: "IP Tracing in World Map",
                height: 640,
                font: {
                    family: "Droid Serif,serif",
                    size: 15,
                    color: 'lightgray',
                },
                titlefont:{
                    size: 25,
                    color: 'gray'
                },
                geo: {
                    projection: {
                        type: 'orthographic',
                        rotation: {
                            lat: 45.5,
                            lon:  -73.57
                        },
                    },
                    showocean: true,
                    oceancolor: 'rgb(0,255,255)',
                    showland: true,
                    landcolor: 'rgb(230,145,56)',
                    showlakes: true,
                    lakecolor: 'blue',
                    showcountries: true,
                    lataxis: {
                        showgrid: true,
                        gridcolor: 'rgb(102,102,102)'
                    },
                    lonaxis: {
                        showgrid: true,
                        gridcolor: 'rgb(102,102,102)'
                    }
                }
            };
            Plotly.newPlot('scattergeo',[trace1,trace2],layout,{showLink: false});
        },
        error: function (error_data) {
            console.log(error_data);
        }
    });
    
    $("#dashboard").click(function (e) {
        window.open("/dash/","_self");
    });
});
    /*var t={
        type: 'sankey',
        orientation: 'h',
        node:{
            pad: 150,
            thickness: 30,
            line:{
                color: 'black',
                width: 0.5
            },
            label: ['A1','A2','B1','B2','C1','C2'],
            color: ['blue','coral','blue','crimson','blue','green'],
        },
        link:{
            source: [0,1,0,2,3,3],
            target: [2,3,3,4,4,5],
            value: [8,4,2,8,4,2]
        }
    };
    var l={
        title: 'Basic Sankey',
        font:{
            size: 10,
        }
    };
    Plotly.newPlot('sankey',[t],l);*/
//seperate different sites used by the source ip such as google,youtube,facebook
 /*
    var trace={
        x: ["2013-10-04 22:23:00","2013-11-04 22:23:00","2013-12-04 22:23:00","2014-01-04 22:23:00","2014-02-04 22:23:00"],
        y: [1,3,6,8,4],
        type: "scatter"
    };
    var trace1={
        x: ["2013-10-04 01:23:00","2013-10-04 08:20:00","2013-10-04 11:00:00","2013-10-04 15:23:00","2013-10-04 20:23:00"],
        y: [1,3,6,8,4],
        type: "scatter"
    };
    var layout={};
    Plotly.newPlot('dashgraph',[trace],layout);
    Plotly.newPlot('dashgraph1',[trace1],layout);
    Plotly.newPlot('dashgraph2',[trace,trace1],layout);

    var trace2={
        x: ["2013-07-04 24:23:00","2013-10-04 01:23:00","2013-12-04 20:23:00","2014-05-04 06:23:00","2014-09-04 22:23:00","2014-12-04 18:23:00","2015-03-04 13:23:00","2015-10-04 01:23:00"],
        y: [25,10,18,14,16,20,22,13],
        type: "scatter",
        mode: "lines"
    }
    var layout={
        title: "Manually Set Range For Time Series",
        xaxis: {
            range: ['2013-01-01','2016-01-01'],
            type: "date"
        },
        yaxis: {
            autorange: true,
            type: "linear"
        }
    }
    Plotly.newPlot('dashgraph3',[trace2],layout);
    var trace3={
        x: ["2013-07-04 24:23:00","2013-10-04 01:23:00","2013-12-04 20:23:00","2014-05-04 06:23:00","2014-09-04 22:23:00","2014-12-04 18:23:00","2015-03-04 13:23:00","2015-10-04 01:23:00"],
        y: [25,10,18,14,16,20,22,13],
        name: "Timeline First",
        marker:{
            color: 'crimson',
        }
    };
    var trace4={
        x: ["2012-11-04 24:23:00","2012-12-04 24:23:00","2013-10-04 22:23:00","2013-11-04 22:23:00","2014-03-04 22:23:00","2014-08-04 22:23:00","2014-12-04 22:23:00","2015-02-04 22:23:00"],
        y: [11,15,1,3,6,8,4,16],
        name: "Timeline  Second",
        marker:{
            color: 'green',
        }
    }
    var layout={
        title: "Time Series With Range Slider",
        xaxis: {
             autorange: true,
             range: ['2013-01-01','2016-01-01'],
             rangeselector:{
                buttons:[{
                    count: 1,
                    label: '1m',
                    step: 'month',
                    stepmode: 'backward',
                },{
                    count: 6,
                    label: '6m',
                    step: 'month',
                    stepmode: 'backward',
                },{
                    step: 'all',
                }]
             },
             rangeslider: {
                range: ['2013-01-01','2016-01-01'],
             },
             type: 'date'
        },
        yaxis:{
            autorange: true,
            type: "linear",
        }
    };
    Plotly.newPlot('dashgraph4',[trace3,trace4],layout);
    */