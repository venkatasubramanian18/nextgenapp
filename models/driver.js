var mongoose = require('mongoose');


var driverSchema = mongoose.Schema({
	uuid:{
		type: String,
		required: true,
		unique : true
	},
	firstText:{
		type: String,
		required: true
	},
	mi:{
		type: String,
	},
	lastText:{
		type: String,
		required: true
	},
	suffix:{
		type: String,
		required: true
	},
	dob:{
		type: String,
		required: true
	},
	maritalstatus:{
		type: String,
		required: true
	},
	licstate:{
		type: String,
		required: true
	},
	accident:{
		type: String,
		required: true
	},
	age:{
		type: String,
		required: true
	}
});

var Driver = module.exports = mongoose.model('Driver', driverSchema);

// Add Driver Details
module.exports.DriverDetail = function(driver, callback){
	console.log("models DriverDetail :" + driver);
	Driver.create(driver, callback);
}


// Update Driver Details
module.exports.DriverDetailUpdt = function(id, driver, callback){
	var query = {uuid: id};
	var update = {
		firstText: driver[0].firstText,
		mi: driver[0].mi,
		lastText: driver[0].lastText,
		suffix: driver[0].suffix,
		dob: driver[0].dob,
		maritalstatus: driver[0].maritalstatus,
		licstate: driver[0].licstate,
		accident: driver[0].accident,
		age: driver[0].age
	}
	
	Driver.findOneAndUpdate(query, update, callback);
}

