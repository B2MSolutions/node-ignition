var http = require('http');
var should = require('should');
var sinon = require('sinon');
var mocha = require('mocha');

var ignition = require('../lib/ignition.js');

describe('ignition', function(){
    before(function(){
    });

    describe('#getDisplayTextForState()', function() {
        it('should return start when stopped', function() {
            ignition.getDisplayTextForState('stopped').should.equal('start');
        });
    
        it('should return start when stopping', function(){
            ignition.getDisplayTextForState('stopping').should.equal('start');
        });
    
    	it('should return stop when running', function(){
            ignition.getDisplayTextForState('running').should.equal('stop');
        });
    
    	it('should return ? when shutting-down', function(){
            ignition.getDisplayTextForState('shutting-down').should.equal('?');
        });
    
    	it('should return ? when terminated', function(){
            ignition.getDisplayTextForState('terminated').should.equal('?');
        });
    
    	it('should return stop when pending', function(){
            ignition.getDisplayTextForState('pending').should.equal('stop');
        });
    });
    
    describe('#start()', function() {
        it('should call AWS2JS request function with parameter StartInstances', function(callback) {
            var stub = sinon.stub(ignition.ec2, 'request').yields(null, null);
            ignition.start('TestInstance', function(error, response) {
                should.not.exist(error);
                stub.calledOnce.should.be.true;
                stub.calledWith('StartInstances', { "InstanceId.0" : "TestInstance" } ).should.be.true;
                ignition.ec2.request.restore();
                callback();
            }); 
        });
    });
    
    describe('#stop()', function() {
        it('should call AWS2JS request function with parameter StopInstances', function(callback) {
            var stub = sinon.stub(ignition.ec2, 'request').yields(null, null);
            ignition.stop('TestInstance', function(error, response) {
                should.not.exist(error);
                stub.calledOnce.should.be.true;
                stub.calledWith('StopInstances', { "InstanceId.0" : "TestInstance" } ).should.be.true;
                ignition.ec2.request.restore();
                callback();
            }); 
        });
    });
    
    describe('#associateElasticIp()', function() {
        it('should call AWS2JS request function with parameters AssociateAddress, the instanceId and the Elastic IP', function(callback) {
            var stub = sinon.stub(ignition.ec2, 'request').yields(null, null);
            ignition.associateElasticIp('TestInstance', '0.0.0.0', function(error, response) {
                should.not.exist(error);
                stub.calledOnce.should.be.true;
                stub.calledWith('AssociateAddress', { "InstanceId" : "TestInstance", "PublicIp" : "0.0.0.0" } ).should.be.true;
                ignition.ec2.request.restore();
                callback();
            });
        });        
    });

    describe('#ignition.getInstanceDetails', function() {
        var validDescription = {
            reservationSet: {
                item: {
                    instancesSet: {
                        item: {
                            instanceState: {
                                name : "stopped"
                            },
                            tagSet: {
                                item: [ { 
                                    key: "Name",
                                    value: "NAME"
                                }]
                            }
                        }
                    }
                }
            }
        };

        beforeEach(function() {
            var sampleResponse = {};
            sinon.stub(ignition, 'describeInstances');
            sinon.stub(ignition, 'getDisplayTextForState').returns('ACTION');
            sinon.stub(ignition, 'describeHealth');
        });
        afterEach(function() {
            ignition.describeInstances.restore();
            ignition.getDisplayTextForState.restore();
            ignition.describeHealth.restore();
        });
        it('should return unknowns on error', function(callback) {
            ignition.describeInstances.yields('ERR');
            ignition.describeHealth.yields(null, 'HEALTH');
            ignition.getInstanceDetails('A', function(e, d) {
                should.not.exist(e);
                should.exist(d);
                d.should.eql({ currentState: "unknown", action: "unknown", name: "unknown", launchtime: 'unknown', health: 'unknown' });
                callback();
            })
        });
        it('should return currentState when valid', function(callback) {
            ignition.describeInstances.yields(null, validDescription);
            ignition.describeHealth.yields(null, 'HEALTH');
            ignition.getInstanceDetails('A', function(e, d) {
                should.not.exist(e);
                should.exist(d);
                should.exist(d.currentState);
                d.currentState.should.equal("stopped");
                callback();
            })
        });
        it('should return action when valid', function(callback) {
            ignition.describeInstances.yields(null, validDescription);
            ignition.describeHealth.yields(null, 'HEALTH');
            ignition.getInstanceDetails('A', function(e, d) {
                should.not.exist(e);
                should.exist(d);
                should.exist(d.action);
                d.action.should.equal("ACTION");
                callback();
            })
        });
        it('should return name when valid', function(callback) {
            ignition.describeInstances.yields(null, validDescription);
            ignition.describeHealth.yields(null, 'HEALTH');
            ignition.getInstanceDetails('A', function(e, d) {
                should.not.exist(e);
                should.exist(d);
                should.exist(d.name);
                d.name.should.equal("NAME");
                callback();
            })
        });
        it('should return launchtime when valid', function(callback) {
            ignition.describeInstances.yields(null, validDescription);
            ignition.describeHealth.yields(null, 'HEALTH');
            ignition.getInstanceDetails('A', function(e, d) {
                should.not.exist(e);
                should.exist(d);
                should.exist(d.launchtime);
                d.launchtime.should.equal("unknown");
                callback();
            })
        });
         it('should return health when valid', function(callback) {
            ignition.describeInstances.yields(null, validDescription);
            ignition.describeHealth.yields(null, 'HEALTH');
            ignition.getInstanceDetails('A', function(e, d) {
                should.not.exist(e);
                should.exist(d);
                should.exist(d.health);
                d.health.should.equal("HEALTH");
                callback();
            })
        });
    });

    describe('#ignition.describeHealth', function() {
        it('should', function(callback) {
            this.timeout(10000);
            var req = http.get("http://google.com/", function(res) {
                console.log("Got response: " + res.statusCode);
                callback();
            }).on('error', function(e) {
                console.log("Got error: " + e.message);
                callback();
            });

            req.on('socket', function (socket) {
                socket.setTimeout(5000);  
                socket.on('timeout', function() {
                    req.abort();
                });
            });
        });
    });
});
