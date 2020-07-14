$(function (){
    /*let object=setInterval(function (e) {
    },60000);*/
    $.ajax({
    	url: "/graph/index/",
    	type: "GET",
    	data: {},
    	success: function (data) {
            let tcp_labels=[],tcp_values=[];
            for (key in data['tcp']) {
                tcp_labels.push(key);
                tcp_values.push(data['tcp'][key]);
            }
        	var trace_tcp={
              x: tcp_labels,
              y: tcp_values,
              name: "TCP Protocol",
              type: "scatter",
              mode: "lines",
              line: {
                color: "green"
              }
            };
            let udp_labels=[],udp_values=[];
            for (key in data['udp']) {
                udp_labels.push(key);
                udp_values.push(data['udp'][key]);
            }
            var trace_udp={
              x: udp_labels,
              y: udp_values,
              name: "UDP Protocol",
              type: "scatter",
              mode: "lines",
              line: {
                color: "coral"
              }
            };
            let others_labels=[],others_values=[];
            for (key in data['others']) {
                others_labels.push(key);
                others_values.push(data['others'][key]);
            }
            var trace_other={
              x: others_labels,
              y: others_values,
              name: "Other Protocol",
              type: "scatter",
              mode: "lines",
              line: {
                color: "blue"
              }
            };
            let overall_labels=[],overall_values=[];
            for (key in data['overall']) {
                overall_labels.push(key);
                overall_values.push(data['overall'][key]);
            }
            var trace_overall={
              x: overall_labels,
              y: overall_values,
              name: "Overall Flow",
              type: "scatter",
              mode: "lines",
              line: {
                color: "gray"
              }
            };
            var layout0={
                title: "Network Flow Per Minutes According IP Protocols",
                xaxis: {
                    title: "Flow Time in Minute",
                    autorange: true,
                    //range: ['00:00:00','24:00:00'],
                    type: 'date'
                },
                yaxis: {
                    title: "Bytes Flow Amount",
                    type: "linear",
                }
            };
            var layout={
                title: "Overall Network Flow Per Minutes",
                xaxis: {
                    title: "Flow Time in Minute",
                    autorange: true,
                    //range: ['00:00:00','24:00:00'],
                    type: 'date'
                },
                yaxis: {
                    title: "Bytes Flow Amount",
                    autorange: true,
                    type: 'linear'
                }
            };
            let src_labels=[],src_values=[];
            for (key in data['src_data']) {
                src_labels.push(key);
                src_values.push(data['src_data'][key]);
            }
            var trace1={
              x: src_labels,
              y: src_values,
              type: "bar",
              marker:{
                showscale: true,
                color: src_values,
                colorscale: [[0,'gray'],[0.5,'blue'],[1,'crimson']],
              },
            };
            var layout1={
                title: "Source Ip Versus Bytes Flow",
                xaxis: {
                    title: "Source IP",
                },
                yaxis: {
                    title: "Bytes Flow Amount"
                }
            };
            let dst_labels=[],dst_values=[];
            for (key in data['dst_data']) {
                dst_labels.push(key);
                dst_values.push(data['dst_data'][key]);
            }
            var trace2={
              x: dst_labels,
              y: dst_values,
              type: "bar",
              marker:{
                showscale: true,
                color: dst_values,
                colorscale: [[0,'gray'],[0.5,'blue'],[1,'crimson']],
              },
            };
            var layout2={
                title: "Destination Ip Versus Bytes Flow",
                xaxis: {
                    title: "Destination IP",
                },
                yaxis: {
                    title: "Bytes Flow Amount",
                }
            };
            Plotly.newPlot('graph-flow',[trace_tcp,trace_udp,trace_other],layout0);
            Plotly.newPlot('graph-flow-overall',[trace_overall],layout);
            Plotly.newPlot('graph-src',[trace1],layout1);
            Plotly.newPlot('graph-dst',[trace2],layout2);
    	},
    	error: function (error_data) {
    		console.log(error_data);
    	}
    });
    
    $.ajax({
        url: "/graph/packets/",
        type: "GET",
        data:{},
        success: function (data) {
            var trace0={
              x: data['datetime'],
              y: data['packetsflow'],
              type: "scatter",
              mode: "lines",
              line: {
                color: "yellow"
              }
            };
            var trace00={
              x: data['datetime'],
              y: data['fwdpacketsflow'],
              name: "Forward Packet Flow",
              type: "scatter",
              mode: "lines",
              line: {
                color: "coral"
              }
            };
            var trace000={
              x: data['datetime'],
              y: data['bwdpacketsflow'],
              name: "Backward Packet Flow",
              type: "scatter",
              mode: "lines",
              line: {
                color: "aqua"
              }
            };
            var layout0={
                title: 'Overall Packet Flow Per Minutes',
                xaxis: {
                    title: "Network Flow Time",
                    autorange: true,
                    //range: ['00:00:00','24:00:00'],
                    type: 'date'
                },
                yaxis: {
                    title: "Packets Flow Amount",
                    type: "linear",
                }
            };
            var layout00={
                title: 'Forward and Backward Packet Flow Per Minutes',
                xaxis: {
                    title: "Network Flow Time",
                    autorange: true,
                    //range: ['00:00:00','24:00:00'],
                    type: 'date'
                },
                yaxis: {
                    title: "Packets Flow Amount",
                    type: "linear",
                }
            };
            Plotly.newPlot('graph-packetflow',[trace0],layout0);
            Plotly.newPlot('graph-fwdbwdpacketflow',[trace00,trace000],layout00);
        },
        error: function (error_data) {
            console.log(error_data);
        }
    });
    function dashGraph(arg) {
    	var graphchoice=arg;
    	$("#parinfo").html("loading...");
    	$.ajax({
	      url: "/graph/dash/",
	      type: "GET",
	      data:{
	      	"basis": graphchoice
	      },
	      success: function (data) {
	      	$("#parinfo").html("");
	      	var colorchoice;
	      	if (data['choice']=='src_port') {
	      		colorchoice=data['src_port'];
	      	}
	      	if (data['choice']=='dst_port') {
	      		colorchoice=data['dst_port'];
	      	}
	      	if (data['choice']=='src_ip') {
	      		colorchoice=data['mod_src'];
	      	}
	      	if (data['choice']=='dst_ip') {
	      		colorchoice=data['mod_dst'];
	      	}
	        var trace={
	          type: 'parcoords',
	          line: {
	            //change color to data ['dst_port'], it will give visualization of data reference to dst port
	            showscale: true,
	            color: colorchoice,
	            colorscale: [[0,'red'],[0.25,'pink'],[0.5,'green'],[0.75,'yellow'],[1,'blue']]
	          },
	          dimensions: [{
	            label: 'Source IP',
	            values: data['mod_src'],
	            ticktext: data['src_ip']
	          },{
	            label: 'Source Port',
	            values: data['src_port']
	          },{
	            label: 'Destination IP',
	            values: data['mod_dst'],
	            ticktext: data['dst_ip']
	          },{
	            label: 'Destination Port',
	            values: data['dst_port']
	          }]
	        };
            var layout={
                
            };
	        Plotly.newPlot('graph-parallel',[trace],layout);
	      },
	      error: function (error_data) {
	        console.log(error_data);
	      }
	    });
    }
    dashGraph('src_port');
    $("#choices").on('change',function () {
    	dashGraph($("#choices").val());
    });
    $.ajax({
    	url: "/graph/pie/",
    	type: "GET",
    	data:{},
    	success: function (data) {

    	var trace={
          labels: ['Others Protocol','TCP Protocol','UDP Protocol'],
          values: [data['0'],data['6'],data['17']],
          type: "pie",
          hole: 0.4,
          rotation: 90,
        };
        var layout={
        	title: 'IP Protocols'
        };
        Plotly.newPlot('graph-pie',[trace],layout);
    	},
    	error: function (error_data) {
    		console.log(error_data);
    	}
    });
    
    $.ajax({
        url: "/graph/networkflow/",
        type: "GET",
        data:{},
        success: function (data) {
            $("#flowinfo").html("");
            for (var i = data['dates'].length - 1; i >= 0; i--) {
                $("#flowselect").append("<option>"+data['dates'][i]+"</option>");
            }
            var flowtrace={
                name: "Bytesflow vs Packetflow vs Flowduration",
                x: data['flowduration'],
                y: data['packetsflow'],
                z: data['bytesflow'],
                mode: "markers",
                type: "scatter3d",
                marker: {
                    color: data['flowduration'],
                    colorscale: [[0,'gray'],[0.25,'green'],[0.5,'yellow'],[0.75,'orange'],[1,'red']],
                    showscale: true,
                    colorbar:{
                        title: 'Time in Seconds of a Day'
                    },
                    size: 5
                }
            };
            var flowlayout={
                title: "Flow Duratlon vs Packets Flow vs Bytes Flow",
                xaxis:{
                    title: 'Flow Duration in Seconds',
                },
                yaxis:{
                    title: 'Packets Flow Counts',
                },
                zaxis:{
                    title: 'Bytes Flow Counts',
                }
            };
            Plotly.newPlot("graphnetflow",[flowtrace],flowlayout);
        },
        error: function (error_data) {
            console.log(error_data)
        }
    });
  
    function boxplot(){ 
        var ip=$("#ipselect").val();
        var port=$("#portselect").val();

        $("#boxinfo").html("loading..."); 
        $.ajax({
            url: "/graph/box/",
            type: "GET",
            data:{
                'ip': ip,
                'port': port
            },
            success: function (data) {
                $("#boxinfo").html("");
                if (ip!="none" && port=="none") {
                    $("#ipselect").html("<option selected=''>"+ip+"</option>");
                    $("#portselect").html("<option value='none'>Source Port</option>");
                }
                else if (ip=="none" && port!="none") {
                    $("#ipselect").html("<option value='none'>Source IP</option>");
                    $("#portselect").html("<option selected=''>"+port+"</option>");
                }
                else if (port!="none" && ip!="none") {
                    $("#ipselect").html("<option selected=''>"+ip+"</option>");
                    $("#portselect").html("<option selected=''>"+port+"</option>");
                    $("#portselect").append("<option value='none'>Source Port</option>");
                    $("#ipselect").append("<option value='none'>Source IP</option>");
                }
                else{}
                for (var i = 0; i < data['src_ip'].length; i++) {
                    $("#ipselect").append("<option>"+data['src_ip'][i]+"</option>");
                } 
                for (var i = 0; i < data['src_port'].length; i++) {
                    $("#portselect").append("<option>"+data['src_port'][i]+"</option>");
                }  

                var trace1={
                    y: data['packetsflow'],
                    name: "Total Packets Flow",
                    type: "box",
                    marker: {
                        color: "gold"
                    }
                };
                var trace2={
                    y: data['bytesflow'],
                    name: "Total Bytes Flow",
                    type: "box",
                    marker: {
                        color: "purple"
                    }
                };
                var layout1={
                    title: "",
                    yaxis:{
                        title: "Packet Counts"
                    }
                };
                var layout2={
                    title: "",
                    yaxis:{
                        title: "Bytes Counts"
                    }
                };
                Plotly.newPlot("graph-box1",[trace1],layout1);
                Plotly.newPlot("graph-box2",[trace2],layout2);
            },
            error: function (error_data) {
                console.log(error_data)
            }
        });
    }
    boxplot();
    $("#ipselect").change(function (e) {
        //console.log($("#ipselect").val(),$("#portselect").val());
        boxplot();
    });
    $("#portselect").change(function (e) {
        //console.log($("#ipselect").val(),$("#portselect").val());
        boxplot();
    });
    $("#resetbtn").click(function (e) {
        $("#portselect").html("<option value='none'>Source Port</option>");
        $("#ipselect").html("<option value='none'>Source IP</option>");
        boxplot();
    });

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

//DashBoard Visualizations
    $("#dashboard").click(function (e) {
        window.open("/dashboard/","_self");
    });
});