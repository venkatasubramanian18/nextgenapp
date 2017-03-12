var mongoose = require('mongoose');


var vehicleSchema = mongoose.Schema({
	uuid:{
		type: String,
		required: true,
		unique : true
	},
	year:{
		type: String,
		required: true
	},
	make:{
		type: String,
		required: true
	},
	model:{
		type: String,
		required: true
	},
	series:{
		type: String,
		required: true
	},
	custom:{
		type: String,
		required: true
	},
	primary:{
		type: String,
		required: true
	},
	loan:{
		type: String,
		required: true
	},
	device:{
		type: Array
	},
	park:{
		type: String,
		required: true
	},
	address:{
		type: String,
		required: true
	}
});

var Vehicle = module.exports = mongoose.model('Vehicle', vehicleSchema);

// Add Vehicle Details
module.exports.VehicleDetail = function(vehicle, callback){
	var date = new Date();
	console.log("models VehicleDetail :" + date.getSeconds() + " " + date.getMilliseconds());
	Vehicle.create(vehicle, callback);
}


// Update Driver Details
module.exports.VehicleDetailUpdt = function(id, vehicle, callback){
	var query = {uuid: id};
	var update = {
		year: vehicle[0].year,
		make: vehicle[0].make,
		model: vehicle[0].model,
		series: vehicle[0].series,
		custom: vehicle[0].custom,
		primary: vehicle[0].primary,
		loan: vehicle[0].loan,
		device: vehicle[0].device,
		park: vehicle[0].park,
		address: vehicle[0].address
	}
	
	Vehicle.findOneAndUpdate(query, update, callback);
}

