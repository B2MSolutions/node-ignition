var express = require('express'),
    fs = require('fs'),
    util = require('util');

var ignition = require('../lib/ignition.js');

var app = express.createServer();

var logFile = fs.createWriteStream('./ignition.log', {flags: 'a'});

app.configure(function() {
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });
    app.use(express.bodyParser());
    app.use(express.logger({stream: logFile}));
});


app.get('/login/:instanceId/:elasticIp', function(req, res) {
    res.render('logon', {instanceId : req.params.instanceId, elasticIp : req.params.elasticIp});
});


app.post('/login/:instanceId/:elasticIp', function(req, res) {
    
    // TODO real authentication
    log(util.format('user %s logged in with password %s', req.body.user, req.body.password));
    res.redirect('/show/' + req.params.instanceId + '/' + req.params.elasticIp);
});

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
                        log(util.format('started instance %s', req.params.instanceId));
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
        log(util.format('stopped instance %s', req.params.instanceId));
		res.redirect('/show/' + req.params.instanceId + '/' + req.params.elasticIp);
	});
});

app.listen(3000);

function log(message) {
    var msg = util.format('\n%s : %s\n\n', new Date(Date.now()).toISOString(), message);
    console.log(msg);
    logFile.write(msg);
};