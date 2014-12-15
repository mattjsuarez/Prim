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
    password: 'mjsuarez_pw',
    db: 'mjsuarez_db'
});

//connect to index.jade file to render it
router.get('/', function(req, res) {
  res.render('../views/index');
});

router.get('/schedule/:docID/:date/:userID', function(req, res) {
	var docID = req.param("docID");
	var date = req.param("date");
	var userID = req.param("userID");
	console.log(typeof(date));
	c.query("INSERT INTO DoctorPatients (PatientID,DoctorID,LastVisit) VALUES (:userID,:docID,:date)",{userID:userID,docID:docID,userID:userID});
});

router.get('/patientInfo/:id', function(req, res){
	var id = req.param("id");
	var toReturn = "";
	var patientInfo = c.query("SELECT Name FROM Patients WHERE Id = :id", {id:id});
	patientInfo.on('result', function(res) {
		res.on('row', function(row){
			var obj = JSON.stringify(inspect(row));
			toReturn = toReturn + obj + "," + id + ",";
			patientInfo = c.query("SELECT PCPid FROM Patients WHERE Id = :id", {id:id});
			patientInfo.on('result', function(res) {
				res.on('row', function(row){
					obj = JSON.stringify(inspect(row));
					toReturn = toReturn + obj;
					res.send(toReturn);
				});
			});
		});
	} );
});

router.get('/patientData/:patID',function(req,res) {
	var patID = req.param("patID");
	console.log(patID);
	var patientInfo = c.query("SELECT * FROM Patients WHERE Id=:id", {id:patID}); //generate a query asks database for a patient by patient's id
	patientInfo.on('result', function(patRow) {
		patRow.on('row', function(row) {
			var obj = JSON.stringify(inspect(row));
			console.log(obj);
			res.send(obj); //return patient information
		});
	});
});

router.get('/retrieveGraphData/:id', function(req, res) {
	var id = req.param("id");
	var i = 0;
	var dataArray = new Array(4);
	var age = c.query("SELECT Age FROM Patients WHERE Id= :id", {id:id});
	age.on('result', function(res) {
		res.on('row', function(row) {
			var obj0 = JSON.stringify(inspect(row));
			dataArray[0] = obj0;
			//res.on('end') something something second/third/fourth query. res.send(array)
		});
	});
	var cholesterol = c.query("SELECT Cholesterol FROM Patients WHERE Id= :id", {id:id});
	cholesterol.on('result', function(res) {
		res.on('row', function(row) {
			var obj1 = JSON.stringify(inspect(row));
			dataArray[1] = obj1;
		});
	});
	var height = c.query("SELECT Height FROM Patients WHERE Id= :id", {id:id});
	var weight = c.query("SELECT Weight FROM Patients WHERE Id= :id", {id:id});
});

module.exports = router;