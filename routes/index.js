var express = require('express');
var jade = require('jade');
var router = express.Router();
var Client = require('mariasql');
var inspect = require('util').inspect;
var c = new Client();

//connect to the database
c.connect({
    host: 'localhost',
    user: 'mjsuarez',
    password: 'mjsuarez_pw', //password to access mjsuarez_db
    db: 'mjsuarez_db' //mjsuarez_db tables
});

//connect to index.jade file to render it
router.get('/', function(req, res) {
  res.render('../views/index'); //render jade template in the views directory
});

router.get('/schedule/:docID/:date/:userID', function(req, res) { //query the database. insert information into DoctorPatients table
	var docID = req.param("docID"); //retrieve the docID parameter
	var date = req.param("date"); //retrieve the date parameter
	var userID = req.param("userID"); //retrieve the userID parameter
	c.query("INSERT INTO DoctorPatients (PatientID,DoctorID,LastVisit) VALUES (:userID,:docID,:date)",{userID:userID,docID:docID,date:date}).on('result', function(res) {
		res.on('error', function(err) {
			console.log('Result error: ' + inspect(err));
		});
	}); /* generate a query
	that inserts information into the database*/
});

router.get('/retrieveSingleGraph/:userID/:graphID/',function(req,res) { //query the database. Select information from database using a patient's id
	var userID = req.param("userID"); //retrieve the userID
	var graphID = req.param("graphID"); //retrieve the graphID
	switch(graphID) { //use the graphID to modify what is selected from database
		case "0":
			var graphInfo = c.query("SELECT Height FROM Patients WHERE Id=:id",{id:userID}); //select height of patient whose id is passed in
			break;
		case "1":
			var graphInfo = c.query("SELECT Weight FROM Patients WHERE Id=:id",{id:userID}); //select weight of patient whose id is passed in
			break;
		case "2":
			var graphInfo = c.query("SELECT Cholesterol FROM Patients WHERE Id=:id",{id:userID}); //select cholesterol of patient whose id is passed in
			break;
		case "3":
			var graphInfo = c.query("SELECT BloodSugar FROM Patients WHERE Id=:id",{id:userID}); //select bloodsugar of patient whose id is passed in
			break;
	}
	graphInfo.on('result', function(gRow) { //on query result,...
		gRow.on('row', function(row) {
			var obj = JSON.stringify(inspect(row)); //stringify the row
			res.send(obj); //and return the object
		});
	});
});

router.get('/patientData/:patID',function(req,res) { //query database and return a patient according to the patient's id
	var patID = req.param("patID"); //retrieve the patID (patient's id)
	console.log(patID);
	var patientInfo = c.query("SELECT * FROM Patients WHERE Id=:id", {id:patID}); //generate a query asks database for a patient by patient's id
	patientInfo.on('result', function(patRow) { //on a query result,...
		patRow.on('row', function(row) {
			var obj = JSON.stringify(inspect(row)); //stringify row
			res.send(obj); //return patient information
		});
	});
});
module.exports = router;