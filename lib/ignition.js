var app = require('express').createServer();

app.set('view engine', 'jade');
app.set('view options', { layout: false });

var instanceid = "instanceid";
var action = "start";

var getStateOfInstance = function(instanceId) {
    // TODO
};


app.get('/', function(req, res){
  res.render('ignition', {action : action, instanceid : instanceid});
});

app.listen(process.env.C9_PORT);


