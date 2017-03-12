var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var uuid = require('node-uuid');

var nodemailer = require('nodemailer');

var sgTransport = require('nodemailer-sendgrid-transport');
//api key from any emailer. enter beow
var options = {
    auth: {
        api_key: 'xxxx'
    }
}
var mailer = nodemailer.createTransport(sgTransport(options));

var twilio = require('twilio');
//Twiio account SID and Token below
var accountSid = 'xxxx';
var authToken = 'xxxx'; 
var client = new twilio.RestClient(accountSid, authToken);

app.use(express.static(__dirname+'/client'));
app.use(bodyParser.json());

Personal =require('./models/personal');
Vehicle =require('./models/vehicle');
Driver =require('./models/driver');
Coverage =require('./models/coverage');

// Connect to Mongoose
// for prod use MLab drivers
// for DEV use to create below DB in local mongodb
mongoose.connect('mongodb://localhost/quoteDB');
console.log("DEV");

var db = mongoose.connection;

var uuid = uuid.v1();

console.log("uuid : " + uuid);

app.post('/api/personal', function(req, res){
	console.log("server api/personal");
	var personal = [{'uuid' : uuid,'firstText' : req.body.firstText,'mi' : req.body.mi,'lastText' : req.body.lastText,'suffix' : req.body.suffix,'address' : req.body.address,'aptunit' : req.body.aptunit,'city' : req.body.city,'state' : req.body.state,'zip' : req.body.zip,'dob' : req.body.dob,'email' : req.body.email,'phone' : req.body.phone}];
	console.log("personal :" + personal[0].firstText);
	Personal.PersonalDetail(personal, function(err, personal){
		var date = new Date();
		console.log("server PersonalDetail " + date.getSeconds() + " " + date.getMilliseconds());
		if(err){
			console.log("err :" + err);
			throw err;
		}
		else
		{
			res.json(personal);
		}
		
	});
});

app.put('/api/personalUpdate/:_id', function(req, res){
	console.log("server api/personalUpdate");
	var personal = [{'uuid' : uuid,'firstText' : req.body.firstText,'mi' : req.body.mi,'lastText' : req.body.lastText,'suffix' : req.body.suffix,'address' : req.body.address,'aptunit' : req.body.aptunit,'city' : req.body.city,'state' : req.body.state,'zip' : req.body.zip,'dob' : req.body.dob,'email' : req.body.email,'phone' : req.body.phone}];
	var id = uuid;
	console.log("id  : " + id);
	console.log("req.body.firstText  : " + personal.firstText);
	Personal.PersonalDetailUpdt(id, personal, function(err, id, personal){
		console.log("/api/personalUpdate/id");
		if(err){
			console.log("err :" + err);
			throw err;
		}
		res.json(personal);
	});
});


app.post('/api/driver', function(req, res){
	console.log("server api/driver");
	console.log("uuid : " + uuid);
	var driver = [{'uuid' : uuid,'firstText' : req.body.firstText,'mi' : req.body.mi,'lastText' : req.body.lastText,'suffix' : req.body.suffix,'dob' : req.body.dob,'maritalstatus' : req.body.maritalstatus,'licstate' : req.body.licstate,'accident' : req.body.accident,'age' : req.body.age,'dob' : req.body.dob}];
	console.log("driver :" + driver);
	Driver.DriverDetail(driver, function(err, driver){
		if(err){
			console.log("err :" + err);
			throw err;
		}
		res.json(driver);
	});
});

app.put('/api/driverUpdate/:_id', function(req, res){
	console.log("server api/driverUpdate");
	var driver = [{'uuid' : uuid,'firstText' : req.body.firstText,'mi' : req.body.mi,'lastText' : req.body.lastText,'suffix' : req.body.suffix,'dob' : req.body.dob,'maritalstatus' : req.body.maritalstatus,'licstate' : req.body.licstate,'accident' : req.body.accident,'age' : req.body.age,'dob' : req.body.dob}];
	var id = uuid;
	Driver.DriverDetailUpdt(id, driver, function(err, id, driver){
		console.log("/api/driverUpdate/id");
		if(err){
			console.log("err :" + err);
			throw err;
		}
		res.json(driver);
	});
});

app.post('/api/vehicle', function(req, res){
	console.log("server api/vehicle");
	console.log("uuid : " + uuid);
	var vehicle = [{'uuid' : uuid,'year' : req.body.year,'make' : req.body.make,'model' : req.body.model,'series' : req.body.series,'custom' : req.body.custom,'primary' : req.body.primary,'loan' : req.body.loan,'device' : req.body.device,'park' : req.body.park,'address' : req.body.address}];
	console.log("vehicle :" + req.body.device);
	Vehicle.VehicleDetail(vehicle, function(err, vehicle){
		if(err){
			console.log("err :" + err);
			throw err;
		}
		res.json(vehicle);
	});
});


app.put('/api/vehicleUpdate/:_id', function(req, res){
	console.log("server api/vehicleUpdate");
	var vehicle = [{'uuid' : uuid,'year' : req.body.year,'make' : req.body.make,'model' : req.body.model,'series' : req.body.series,'custom' : req.body.custom,'primary' : req.body.primary,'loan' : req.body.loan,'device' : req.body.device,'park' : req.body.park,'address' : req.body.address}];
	var id = uuid;
	Vehicle.VehicleDetailUpdt(id, vehicle, function(err, id, vehicle){
		console.log("/api/vehicleUpdate/id");
		if(err){
			console.log("err :" + err);
			throw err;
		}
		res.json(vehicle);
	});
});


app.post('/api/coverage', function(req, res){
	console.log("server api/coverage");
	console.log("uuid : " + uuid);
	var coverage = [{'uuid' : uuid,'type' : req.body.type,'bipd' : req.body.bipd,'pip' : req.body.pip,'umbi' : req.body.umbi,'comp' : req.body.comp,'coll' : req.body.coll,'mp' : req.body.mp,'tl' : req.body.tl,'premium' : req.body.premium}];
	Coverage.CoverageDetail(coverage, function(err, coverage){
		if(err){
			console.log("err :" + err);
			throw err;
		}
		res.json(coverage);
	});
});

app.post('/api/sms', function(req){
	console.log("req.body.phoneno : " + req.body.phoneno);
	console.log("req.body.name : " + req.body.name);
	console.log("req.body.premium : " + req.body.premium);
	console.log("req.body.uuid : " + req.body.uuid);
	var premium = req.body.premium.toFixed(2);
    client.messages.create({
          body: 'Hi ' + req.body.name + ',' + 'Your Premium for UUID "' + req.body.uuid + '" is $' + premium,
          to: '+91'+req.body.phoneno,  
          from: '+13174975656' 
    }, function(err, message) {
          if (err){console.log(err.message)};
    });

});

app.post('/api/email', function(req){
	var premium = req.body.premium.toFixed(2);
	var email = {
    to: [req.body.email],
    cc: ['venkatasubramanian18@gmail.com'],
    from: 'nextgenapp@gmail.com',
    subject: 'NextGen Insurance Details',
    html: '<p>Hi ' + req.body.name + ',</p>' 
    + '</b>' 
    + '<p>Thank you for taking policy with us. Please find your details as below,</p>'
    + '</b>' 
    + '<p>Your premium for the UUID: ' + '<b>' + uuid + '</b>'
    + ' is <b>$' + premium + '</b>.</p>'
    + '</b>'
    + '<p>Thanks,</p>'
    + '</b>'
    + '<p>NextGenApp</p>'
	};
	 
	mailer.sendMail(email, function(err, res) {
	    if (err) { 
	        console.log("email error : " + err) 
	        console.log("email id : " + req.body.email)
	    }
	    else {
	    console.log("email success : " + res);
	    console.log("email id : " + req.body.email)
	    }
	});

});

app.get('/api/uuid', function(req, res) {
	console.log("/api/uuid : " + uuid);
	res.json(uuid);
});

/*
app.get('/api/coverage/:_id', function(req, res){
	console.log("/api/coverage/:_id");
	var id = uuid;
	Coverage.getCovById(id, function(err, coverage){
		if(err){
			console.log("err :" + err);
			throw err;
		}
		res.json(coverage);
	});
});

*/
//app.listen(3000,'10.170.8.178');
app.listen(3000);
console.log('Running on port 3000...');