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
					obj = JSON.stringify(insepct(row));
					toReturn = toReturn + obj;
					res.send(toReturn);
				});
			});
		});
	} );
});

//DOCTOR INFO DUMP
//retrieve a patient's information by the doctor's id number
router.get('/retrieveDoctorByID/:id', function(req, res) {
	var id = req.param("id");
	var patientInfo = c.query("SELECT * FROM Doctors WHERE Id= :id", {id:id}); //generate a query asks database for a doctor by doctor's id
	patientInfo.on('result', function(res) {
		res.on('row', function(row) {
			var obj = JSON.stringify(inspect(row));
			res.send(obj); //return doctor information
		});
	});
});

//DOCTOR INFO DUMP
//retrieve a doctor's information by the doctor's name
router.get('/retrieveDoctorByName/:name', function(req, res) {
	var name = req.param("name"); //retrieve the value from the parameter name
	var doctorInfo = c.query("SELECT * FROM Doctors WHERE Name= :nam", {nam:name}); //generate a query. asks database for a doctor given a name
	doctorInfo.on('result', function(res) {
		res.on('row',function(row) {
			var obj = JSON.stringify(inspect(row));
			res.send(obj); //return the doctor information
		});
	});
});

//PATIENT INFO DUMP
//retrieve a patient's information by the patient's id number
router.get('/retrievePatientByID/:id', function(req, res) {
	var id = req.param("id");
	var patientInfo = c.query("SELECT * FROM Patients WHERE Id= :id", {id:id}); //generate a query asks database for a patient by patient's id
	patientInfo.on('result', function(res) {
		res.on('row', function(row) {
			var obj = JSON.stringify(inspect(row));
			res.send(obj); //return patient information
		});
	});
});

//PATIENT INFO DUMP
//retrieve a patient's information by the patient's name
router.get('/retrievePatientByID/:name', function(req, res) {
	var name = req.param("name");
	var patientInfo = c.query("SELECT * FROM Patients WHERE Name= :nam", {nam:name}); //generate a query asks database for a patient by patient's id
	patientInfo.on('result', function(res) {
		res.on('row', function(row) {
			var obj = JSON.stringify(inspect(row));
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

function secondQuery(dataArray,res,id) {
	//var
}


module.exports = router;
//router gives 4 basic counts for fat/ cholesteral, etcc...
//4 sets of arrays for the graph - fat, cholesteral, weight, height

//AI - shirnova. NOT HEFERNAN
