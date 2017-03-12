var mongoose = require('mongoose');


var coverageSchema = mongoose.Schema({
	uuid:{
		type: String,
		required: true,
		unique : true
	},
	type:{
		type: String,
		required: true
	},
	bipd:{
		type: String,
		required: true
	},
	pip:{
		type: String,
	},
	umbi:{
		type: String,
		required: true
	},
	comp:{
		type: String,
		required: true
	},
	coll:{
		type: String,
		required: true
	},
	mp:{
		type: String
	},
	tl:{
		type: String
	},
	premium:{
		type: String,
		required: true
	}
});

var Coverage = module.exports = mongoose.model('Coverage', coverageSchema);

// Add Coverage Details
module.exports.CoverageDetail = function(coverage, callback){
	console.log("models CoverageDetail :" + coverage);
	Coverage.create(coverage, callback);
}

/*// Get Coverage
module.exports.getCovById = function(id, callback){
	console.log("getCovById");
	var query = {uuid: id};
	Coverage.findById(query, callback);
}*/

