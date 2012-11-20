var express = require('express'),
    fs = require('fs'),
    util = require('util');

var ignition = require('./lib/ignition.js');

var app = express.createServer();

var port = process.env.PORT ? process.env.PORT : 3000;

app.listen(port);
console.log('listening on ' + port);

//var logFile = fs.createWriteStream('./ignition.log', {flags: 'a'});

var started = [];

var zoo = {
    a: 'ant',
    b: 'bat',
    c: 'cat',
    d: 'dog',
    e: 'elephant',
    f: 'frog',
    g: 'giraffe',
    h: 'horse',
    i: 'iguana',
    j: 'jaguar',
    k: 'koala',
    l: 'llama',
    m: 'mouse',
    n: 'newt',
    o: 'octopus',
    p: 'platypus',
    q: 'quail',
    r: 'rat',
    s: 'snake',
    t: 'tiger',
    u: 'urial',
    v: 'vole',
    w: 'walrus',
    x: 'xantis',
    y: 'yak',
    z: 'zebra'
};

var cryptozoologicalAuthentication = function(username, password) {
    var cryptozoologicalName = zoo[username[0]] + zoo[username[1]] + zoo[username[2]];
    console.log('cryptozoologicalAuthentication: ' + cryptozoologicalName);
    var user = null;
    if(password === cryptozoologicalName) {
        user = { name: username };
    }

    return user;
};

app.configure(function() {
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'volcanoes at the end of the world' }));
    //app.use(express.logger({stream: logFile}));
    app.use("/css", express.static(__dirname + '/css'));
});

app.get('/login/:instanceId/:elasticIp', function(req, res) {
    res.render('logon', {instanceId : req.params.instanceId, elasticIp : req.params.elasticIp});
});

app.post('/login/:instanceId/:elasticIp', function(req, res) {
    console.log("logging in");
    var username = req.body.username;
    var password = req.body.password;
    var user = cryptozoologicalAuthentication(username, password);

    if(user) {
        log(util.format('user %s logged in with password %s', username, password));
        req.session.regenerate(function() {
            req.session.user = user;
            res.redirect('/show/' + req.params.instanceId + '/' + req.params.elasticIp);
        });
    } else {
        res.redirect('/login/' + req.params.instanceId + '/' + req.params.elasticIp);
    }
});

app.get('/show/:instanceId/:elasticIp?', ensureAuthenticated, function(req, res) {
    ignition.getInstanceDetails(req.params.instanceId, function(error, details) {
        res.render('ignition',
            {
                action : details.action,
                name: details.name,
                launchtime: details.launchtime,
                currentState : details.currentState,
                instanceId : req.params.instanceId,
                elasticIp : req.params.elasticIp,
                refresh : req.query.refresh,
                startedby: started[req.params.instanceId] ? started[req.params.instanceId] : 'unknown'
            });
    });
});

app.get('/start/:instanceId/:elasticIp', ensureAuthenticated, function(req, res, next){
    started[req.params.instanceId] = req.session.user.name;

    ignition.start(req.params.instanceId, function(error, response) {
        (function poll(){
            setTimeout(function(){
                ignition.associateElasticIp(req.params.instanceId, req.params.elasticIp, function(error, response) {
                    if (error === null) {
                        log(util.format('instance %s started by %s', req.params.instanceId, req.session.user.name));
                        return res.redirect('/show/' + req.params.instanceId + '/' + req.params.elasticIp);
                    } else {
                        poll();
                    }
                });
            }, 2000);
        })();
	});
});

app.get('/stop/:instanceId/:elasticIp', ensureAuthenticated, function(req, res, next){
	ignition.stop(req.params.instanceId, function(error, response) {
        log(util.format('stopped instance %s', req.params.instanceId));
		res.redirect('/show/' + req.params.instanceId + '/' + req.params.elasticIp);
	});
});

function log(message) {
    var msg = util.format('\n%s : %s\n\n', new Date(Date.now()).toISOString(), message);
    console.log(msg);
    //logFile.write(msg);
}

function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }

    res.redirect('/login/' + req.params.instanceId + '/' + req.params.elasticIp);
}