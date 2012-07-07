var should = require('should');
var sinon = require('sinon');
var mocha = require('mocha');

var ignition = require('../lib/ignition.js');

describe('ignition', function(){
    before(function(){
    });

    describe('#getDisplayTextForState()', function(){
        it('should return start when stopped', function(){
            ignition.getDisplayTextForState('stopped', function(error, response) {
                response.should.equal('start');
            });
        });
    
        it('should return start when stopping', function(){
            ignition.getDisplayTextForState('stopping', function(error, response) {
                response.should.equal('start');
            });
        });
    
    	it('should return stop when running', function(){
            ignition.getDisplayTextForState('running', function(error, response) {
                response.should.equal('stop');
            });
        });
    
    	it('should return ? when shutting-down', function(){
            ignition.getDisplayTextForState('shutting-down', function(error, response) {
                response.should.equal('?');
            });
        });
    
    	it('should return ? when terminated', function(){
            ignition.getDisplayTextForState('terminated', function(error, response) {
                response.should.equal('?');
            });
        });
    
    	it('should return stop when pending', function(){
    		ignition.getDisplayTextForState('pending', function(error, response) {
                response.should.equal('stop');
            });
        });
    });
    
    describe('#start()', function(){
        it('should call AWS2JS request function with parameter StartInstances', function() {
            var stub = sinon.stub(ignition.ec2, 'request').yields(null, null);
            ignition.start('TestInstance', function(error, response) {
                should.not.exist(error);
                stub.calledOnce.should.be.true;
                stub.calledWith('StartInstances', { "InstanceId.0" : "TestInstance" } ).should.be.true;
                ignition.ec2.request.restore();
            }); 
        });
    });
    
    describe('#stop()', function(){
        it('should call AWS2JS request function with parameter StopInstances', function() {
            var stub = sinon.stub(ignition.ec2, 'request').yields(null, null);
            ignition.stop('TestInstance', function(error, response) {
                should.not.exist(error);
                stub.calledOnce.should.be.true;
                stub.calledWith('StopInstances', { "InstanceId.0" : "TestInstance" } ).should.be.true;
                ignition.ec2.request.restore();
            }); 
        });
    });
    
    describe('#associateElasticIp()', function(){
        it('should call AWS2JS request function with parameters AssociateAddress, the instanceId and the Elastic IP', function() {
            var stub = sinon.stub(ignition.ec2, 'request').yields(null, null);
            ignition.associateElasticIp('TestInstance', '0.0.0.0', function(error, response) {
                should.not.exist(error);
                stub.calledOnce.should.be.true;
                stub.calledWith('AssociateAddress', { "InstanceId" : "TestInstance", "PublicIp" : "0.0.0.0" } ).should.be.true;
                ignition.ec2.request.restore();
            });
        });
    });
});
