var app = require('express').createServer();

var ignition = require('../lib/ignition.js');

app.set('view engine', 'jade');
app.set('view options', { layout: false });

var instanceId = "THEINSTANCEID";

var rootGet = function(req, res){
	ignition.getState(instanceId, function(error, response) {
		res.render('ignition', {action : response.text, instanceId : instanceId});
	}); 
};

app.get('/', rootGet);

app.post('/start', function(req, res, next){
	ignition.start(instanceId, function(error, response) {
		res.redirect('/');
	});
});

app.post('/stop', function(req, res, next){
	ignition.stop(instanceId, function(error, response) {
		res.redirect('/');
	});
});

app.listen(3000);