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
describe('list', function(){
	it('should return', function(done){
		
		var options = {
			id: 749429
		};

		intrade.getTimeAndSales( options, function(eventClasses){
			
			listEvent.emit('ready', eventClasses);
			done();
		});
	});
});

//## Checks the array returned
listEvent.on('ready', function( timeAndSalesData ){

	describe('array of history', function(){
		it('should exist', function(done){
			
			should.exist(timeAndSalesData);
			done();
		});
	});
});