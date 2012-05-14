var should = require('should');
var sinon = require('sinon');

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
});
