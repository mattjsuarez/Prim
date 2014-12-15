var userID = 0;	//Hardcoded for demo and debugging purposes

$(document).ready(function() {
		requestSideBar();
		appointmentForm();
});

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
            name: 'Height',
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
            name: 'Height',
            data: rightData
        }]
    });
};
var appointmentForm = function() {
	$("#scheduleForm").submit(function(e) {
		console.log($("input")[1].value);
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