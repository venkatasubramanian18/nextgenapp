var mongoose = require('mongoose');


var personalSchema = mongoose.Schema({
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
		type: String
	},
	lastText:{
		type: String,
		required: true
	},
	suffix:{
		type: String,
		required: true
	},
	address:{
		type: String,
		required: true
	},
	aptunit:{
		type: String,
		required: true
	},
	city:{
		type: String,
		required: true
	},
	state:{
		type: String,
		required: true
	},
	zip:{
		type: String,
		required: true
	},
	dob:{
		type: String,
		required: true
	},
	email:{
		type: String,
		required: true
	},
	phone:{
		type: String,
		required: true
	}
});

var Personal = module.exports = mongoose.model('Personal', personalSchema);

// Add Personal Details
module.exports.PersonalDetail = function(personal, callback){
	var date = new Date();
	console.log("models PersonalDetail :" + date.getSeconds() + " " + date.getMilliseconds());
	Personal.create(personal, callback);
}

// Update Personal Details
module.exports.PersonalDetailUpdt = function(id, personal, callback){
	var query = {uuid: id};
	console.log("PersonalDetailUpdt uuid : " + id);
	console.log("PersonalDetailUpdt personal.firstText : " + personal.firstText);
	var update = {
		firstText: personal[0].firstText,
		mi: personal[0].mi,
		lastText: personal[0].lastText,
		suffix: personal[0].suffix,
		address: personal[0].address,
		aptunit: personal[0].aptunit,
		dob: personal[0].dob,
		email: personal[0].email,
		phone: personal[0].phone
	}
	Personal.findOneAndUpdate(query, update, callback);
}

