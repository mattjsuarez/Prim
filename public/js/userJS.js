var userID = 0;	//Hardcoded for demo and debugging purposes

// set up the page
$(document).ready(function() {
		requestSideBar();
		appointmentForm();
		loadGraph();
		Highcharts.setOptions({
        	colors: ['#4F57AA']
    	});
});

//fetch the user data
var requestSideBar = function() {
	var request = $.ajax({
		url:"/patientData/"+userID,
		success:function(msg) {
			initialData(msg);
		},
		fail:function(jqXHR, textStatus, errorThrown) {
			console.log("AJAX request error thrown:"+errorThrown);
		}
	});
};

// setup graph by calling other functions
var loadGraph = function() {
	$(".updateGraph").click(function() {
		$(this).addClass("selected");
		$(this).siblings().removeClass("selected");
		var graphID = $(this).data("graph");
		var request = $.ajax({
			url:"/retrieveSingleGraph/"+userID+"/"+graphID,
			success:function(msg) {
				updateGraph(graphID,msg);
			},
			fail:function(jqXHR, textStatus, errorThrown) {
				console.log("AJAX request error thrown:"+errorThrown);
			}
		});
	});
}

//create 1 graph with the data passed to it
var updateGraph = function(graphID, msg) {
	var graph = graphID;
	var gData=msg.match(/'([^'']+)'/)[1];
	var graphData = gData.split(",");
	graphData = graphData.map(function(item) {
		return parseInt(item,10);
	});
	if(graph==0 || graph==1) {
		var container = $("#leftGraph");
	} else if (graph==2 || graph==3) {
		var container = $("#rightGraph");
	}
	container.highcharts({
        chart: {
            type: 'column'
        },
        xAxis: {
            categories: ['August','September','October','November','December']
        },
        series: [{
            data: graphData
        }]
    });
}

//setup the page with user's data
var initialData = function(patientData) {
	var userData = patientData;
	userData = JSON.parse(userData);
	userData = JSON.parse(JSON.stringify(eval('('+userData+')')));
	//Populate the off-canvas sidebar with user data
	$("#userName").text(userData.Name);
	$("#userDOB").text(userData.DOB);
	$("#userGender").text(userData.Gender);
	$("#userID").text(userData.Id);
	$("#userInsurance").text(userData.Insurance);
	//Populate the four main panels with data
	var heightArray = userData.Height.split(',');
	$("#userHeight").text(heightArray[4]);
	var weightArray = userData.Weight.split(',');
	$("#userWeight").text(weightArray[4]);
	var chArray = userData.Cholesterol.split(',');
	$("#userCholesterol").text(chArray[4]);
	var bsArray = userData.BloodSugar.split(',');
	$("#userBloodSugar").text(bsArray[4]);
	initialGraphs(heightArray,chArray);
};
//create 2 graphs on the page with intial months
var initialGraphs = function(leftGraph,rightGraph) {
	var leftData = leftGraph.map(function(item) {
		return parseInt(item,10);
	});
	var rightData = rightGraph.map(function(item) {
		return parseInt(item,10);
	});
	$('#leftGraph').highcharts({
        chart: {
            type: 'column'
        },
        xAxis: {
            categories: ['August','September','October','November','December']
        },
        series: [{
            data: leftData
        }]
    });
	$('#rightGraph').highcharts({
        chart: {
            type: 'column'
        },
        xAxis: {
            categories: ['August','September','October','November','December']
        },
        series: [{
            data: rightData
        }]
    });
};
//ajax call for creating an appointment
var appointmentForm = function() {
	$("#scheduleForm").submit(function(e) {
		var request = $.ajax({
			url:"/schedule/"+$("input")[0].value+"/"+$("input")[1].value+"/"+userID,
			success:function() {
				alert("Successfully submitted appointment request!");
			},
			fail:function(jqXHR, textStatus, errorThrown) {
				console.log("AJAX request error thrown:"+errorThrown);
			}
		});
		return false;
	});
}