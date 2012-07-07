/*global it, describe */
var intrade   = require('intrade'),
	should    = require('should'),
	assert    = require('assert'),
	events    = require('events'),
	listEvent = new events.EventEmitter(),
	_         = require('Underscore');

//# Cets the list off all objects
//Uses an event not to hit the intrade
//server unnecessarily
// * EventClasses
//     * EventGroups
//         * Events
//             * Contracts

describe('list', function(){
	it('should return', function(done){

		var options = {
			env: 'dev',
			id: 334244
		};

		intrade.getContractByID( options, function( contract ){
			listEvent.emit('ready', contract);
			done();
		});
		
	});
});

//## Checks the length of the EventClasses returned
listEvent.on('ready', function(contract){
	describe('Single contract', function(){
			
		it('should contain 18 attributes', function(done){
			
			should.exist(contract);
			contract.get('currency').should.equal('USD');
			contract.get('type').should.equal('PX')
			_.toArray(contract.attributes).length.should.equal(18);
		
			done();
		});
	});
});



