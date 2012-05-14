var app = require('express').createServer();
var aws = require('aws2js')

var ignition = {};

ignition.getState = function(instanceId, callback) {
	ignition.getStateOfInstance(instanceId, function(error, response) {
		var currentState = response;
		ignition.getDisplayTextForState(currentState, function(error, response) {
			callback(error, { state : currentState, text : response } );
		});
	});
	
};

ignition.getStateOfInstance = function(instanceId, callback) {

	var accessKey = process.env.AWS_ACCESS_KEY;
	var secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

	var ec2 = aws.load('ec2', accessKey, secretAccessKey);

	ec2.request('DescribeInstances', { "InstanceId.0" : instanceId }, function(error, response) {
		if (error) {
			console.error(error);
			return callback(error, "unknown");
		} else {
			var state = response.reservationSet.item.instancesSet.item.instanceState.name;
			return callback(null, state);
		}
	});
};

ignition.getDisplayTextForState = function(state, callback) {
  switch(state) {
		case "stopped":
		case "stopping":
			return callback(null, "start");
		case "pending":
		case "running":
			return callback(null, "stop");
		default:
			return callback(null, "?");
	}
};

module.exports = ignition;

