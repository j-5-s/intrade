/*global it, describe */
var intrade = require('intrade'),
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
			env: 'dev',
			class_id: 66
		};

		intrade.getContractsByClass( options, function(eventClass){
			listEvent.emit('ready', eventClass);
			done();
		});
	});
});

//## Checks the length of the EventClasses returned
listEvent.on('ready', function(eventClass){

	describe('Single class', function(){
		it('should contain 1 eventClasses in dev', function(done){
			should.exist(eventClass);
			eventClass.get('name').length.should.be.above(0);
			eventClass.get('id').should.be.above(0);			
			done();
		});
	});
});


//## EventGroup
listEvent.on('ready', function(eventClass){
	describe('an EventClass should have at least one Event Group', function(){
		it('with name and ID access', function(done){

			var	eventGroups = eventClass.get('eventGroups'),
				eventGroup = eventGroups[0];

			eventGroups.length.should.be.above(0);
			eventGroup.get('name').length.should.be.above(0);
			eventGroup.get('id').should.be.above(0);
			done();
		});
	});
});

listEvent.on('ready', function(eventClass){
	describe('an EventClass should have at least one Event Group', function(){
		it('with name and ID access', function(done){

			var	eventGroups  = eventClass.get('eventGroups'),
				eventGroup   = eventGroups[0],
				events       = eventGroup.get('events'),
				intradeEvent = events[0];

			events.length.should.be.above(0);
			intradeEvent.get('name').length.should.be.above(0);
			done();
		});
	});
});

listEvent.on('ready', function(eventClass){
	describe('an EventClass should have at least one Event Group', function(){
		it('with name and ID access', function(done){
			var eventGroups  = eventClass.get('eventGroups'),
				eventGroup   = eventGroups[0],
				events       = eventGroup.get('events'),
				intradeEvent = events[0],
				contracts    = intradeEvent.get('contracts'),
				contract     = contracts[0];

			contracts.length.should.be.above(0);

			contract.get('id').should.be.above(0);
			done();
		});
	});
});



