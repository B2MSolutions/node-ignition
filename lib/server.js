var app = require('express').createServer();
var aws = require('aws2js')

var ignition = require('../lib/ignition.js');

app.set('view engine', 'jade');
app.set('view options', { layout: false });

var instanceid = "THEINSTANCEID";

app.get('/', function(req, res){
	ignition.getState(instanceid, function(error, response) {
		res.render('ignition', {action : response.text, instanceid : instanceid});
	});
});

app.listen(3000);


