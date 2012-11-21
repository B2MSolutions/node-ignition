var accessKey = process.env.AWS_ACCESS_KEY;
var secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

var _ = require('underscore'),
	moment = require('moment'),
	aws = require('aws2js');

var ec2 = aws.load('ec2', accessKey, secretAccessKey);

var ignition = {};

ignition.ec2 = ec2;

ignition.getInstanceDetails = function(instanceId, callback) {
	ignition.describeInstances(instanceId, function(e, instance) {
		if(e) {
			return callback(e, { state: "unknown", text: "unknown", name: "unknown" });
		}
		
		var state = instance.reservationSet.item.instancesSet.item.instanceState.name;
		var stateText = ignition.getDisplayTextForState(state);

		var tags = instance.reservationSet.item.instancesSet.item.tagSet.item;
		var name = _.find(tags, function(tag){ return tag.key == 'Name'; }).value;

		var launchtime = instance.reservationSet.item.instancesSet.item.launchTime;

		return callback(null, { currentState: state, action: stateText, name: name, launchtime: launchtime ? moment(new Date(launchtime)).format("ddd Do, hA") : 'unknown' });
	});
};

ignition.describeInstances = function(instanceId, callback) {
	ignition.ec2.request('DescribeInstances', { "InstanceId.0" : instanceId }, callback);
};

ignition.getDisplayTextForState = function(state) {
  switch(state) {
		case "stopped":
		case "stopping":
			return "start";
		case "pending":
		case "running":
			return "stop";
		default:
			return "?";
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