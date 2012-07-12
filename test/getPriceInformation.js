/*global it, describe */
var intrade = require('intrade').dataRetrieval,
	should  = require('should'),
	assert  = require('assert'),
	events  = require('events'),
	listEvent = new events.EventEmitter();

//# Cets the list off all objects
//Uses an event not to hit the intrade
//server unnecessarily
// * EventClasses
//     * EventGroups
//         * Events
//             * Contracts
describe('getPriceInformation', function(){
	it('should return IntradeContractInfo', function(done){
		
		var options = {
			env: 'dev',
			id: 159289
		};

		intrade.getPriceInformation( options, function(intradeContractInfo){
			listEvent.emit('ready', intradeContractInfo);
			done();
		});
	});
});

//## Checks the length of the EventClasses returned
listEvent.on('ready', function(intradeContractInfo){

	describe('object ', function(){
		it('should exist', function(done){
			
			should.exist(intradeContractInfo);
			intradeContractInfo.get('close').should.be.a('number');
			intradeContractInfo.get('bids').should.be.a('object');
			intradeContractInfo.get('offers').length.should.be.above(0);
			done();
		});
	});
});
