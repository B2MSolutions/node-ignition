var app = require('express').createServer();

var ignition = require('../lib/ignition.js');

app.set('view engine', 'jade');
app.set('view options', { layout: false });

app.get('/show/:instanceId', function(req, res){
    ignition.getState(req.params.instanceId, function(error, response) {
		res.render('ignition', {action : response.text, instanceId : req.params.instanceId, currentState : response.currentState});
	}); 
});

app.post('/start/:instanceId', function(req, res, next){
	ignition.start(req.params.instanceId, function(error, response) {
		res.redirect('/show/' + req.params.instanceId);
	});
});

app.post('/stop/:instanceId', function(req, res, next){
	ignition.stop(req.params.instanceId, function(error, response) {
		res.redirect('/show/' + req.params.instanceId);
	});
});

app.listen(3000);