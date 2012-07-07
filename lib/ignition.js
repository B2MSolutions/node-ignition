var accessKey = process.env.AWS_ACCESS_KEY;
var secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

var aws = require('aws2js');
var ec2 = aws.load('ec2', accessKey, secretAccessKey);

var ignition = {};

ignition.ec2 = ec2;

ignition.getState = function(instanceId, callback) {
	ignition.getStateOfInstance(instanceId, function(error, currentState) {
		ignition.getDisplayTextForState(currentState, function(error, response) {
			callback(error, { currentState : currentState, text : response } );
		});
	});
}; 

ignition.getStateOfInstance = function(instanceId, callback) {
	ignition.ec2.request('DescribeInstances', { "InstanceId.0" : instanceId }, function(error, response) {
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

ignition.start = function(instanceId, callback) {
    ignition.ec2.request('StartInstances', { "InstanceId.0" : instanceId }, function(error, response) {
        console.log('start for instance %s', instanceId);
        return callback(error, response);
    }); 
};

ignition.stop = function(instanceId, callback) {
	ignition.ec2.request('StopInstances', { "InstanceId.0" : instanceId }, function(error, response) {
        console.log('stop for instance %s', instanceId);
        return callback(error, response);
    }); 
};

ignition.associateElasticIp = function(instanceId, elasticIp, callback) {
    ignition.ec2.request('AssociateAddress', { "InstanceId" : instanceId, "PublicIp" : elasticIp }, function(error, response) {
        console.log('AssociateAddress for instance %s, elasticIp %s', instanceId, elasticIp);
        
        if (error) {
            console.error(error);
        } else {
            console.log(response);
        }
        
        return callback(error, response);
    });
};

module.exports = ignition;