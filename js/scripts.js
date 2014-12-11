//Main function when body loads
$(document).ready(function() {
    initElements();
	panelExpand();
});

var initElements = function() {
    var datepicker = $.UIkit.datepicker(element, {});
}
var panelExpand = function() {
	$("#expandInfo").click(function() {
		var userID = $("#userID").text();
		var request = $.ajax({
        	url:'/retrieveGraphData/'+userID,
        	type:'GET',
        	success:function(msg) {
    			console.log(msg);	    
        	}
    	});
    	request.fail(function(jqXHR, textStatus) {
        	console.log("Request failed: " + textStatus);
    	});
	});
};