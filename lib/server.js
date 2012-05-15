var app = require('express').createServer();

var ignition = require('../lib/ignition.js');

app.set('view engine', 'jade');
app.set('view options', { layout: false });

app.get('/show/:instanceId/:elasticIp', function(req, res){
    ignition.getState(req.params.instanceId, function(error, response) {
		res.render('ignition', {action : response.text, instanceId : req.params.instanceId, elasticIp : req.params.elasticIp, currentState : response.currentState});
	}); 
});

app.post('/start/:instanceId/:elasticIp', function(req, res, next){
	ignition.start(req.params.instanceId, function(error, response) {
        (function poll(){
            setTimeout(function(){
                ignition.associateElasticIp(req.params.instanceId, req.params.elasticIp, function(error, response) {
                    if (error === null) {
                        return res.redirect('/show/' + req.params.instanceId + '/' + req.params.elasticIp);
                    } else {
                        poll();
                    }
                });
            }, 2000)
        })();
	});
});

app.post('/stop/:instanceId/:elasticIp', function(req, res, next){
	ignition.stop(req.params.instanceId, function(error, response) {
		res.redirect('/show/' + req.params.instanceId + '/' + req.params.elasticIp);
	});
});

app.listen(3000);