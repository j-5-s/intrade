var _          = require('Underscore'),
	BaseObject = require('./BaseObject');



//models
var IntradeEventGroup = require('./IntradeEventGroup'),
	IntradeEvent      = require('./IntradeEvent'),
	IntradeContract   = require('./IntradeContract');
/**
 * The Intrade Event Class
 * @class
 */

var IntradeEventClass = function( attributes ) {

	this.attributes = {
		//default storage for eventGroups to empty array (to push)
		eventGroups: []
	};

	if (typeof attributes !== 'undefined' ){
		this.set( attributes );	
	}

	this.toString = function() {
		return 'IntradeEventClass';
	};

};

//Extend the base object for @get & @set
IntradeEventClass.prototype = BaseObject.prototype;

/**
 * Addes an Event Group to the Event Class
 * @api private
 */
IntradeEventClass.prototype._addIntradeEventGroup = function( intradeEventGroup ) {
	this.get('eventGroups').push( intradeEventGroup );
};


/**
 * Addes an Event Group to the Event Class
 * @api private
 */
IntradeEventClass.prototype._addRawEventGroups = function( rawEventGroups ) {


	if (!_.isArray(rawEventGroups) ) {
		rawEventGroups = [rawEventGroups];
	}


	for (var j = 0; j < rawEventGroups.length; j++ ){

		

		var rawEventGroup = rawEventGroups[j];
		if (typeof rawEventGroup === 'undefined') {
			continue;
		}
		
	
		var	eventGroup    = new IntradeEventGroup({name:rawEventGroup.name, id:rawEventGroup.id});
		
		this._addIntradeEventGroup(eventGroup);

		//if the rawEventGroup is an object, there is just one, if there are many
		//its an array
		if ( !_.isArray(rawEventGroup.Event) ) {
			rawEventGroup.Event = [rawEventGroup.Event];
		}

		for (var k = 0; k < rawEventGroup.Event.length; k++ ) {
			var rawEvent = rawEventGroup.Event[k];
			//endDate, startDate, groupId, id, description, name
			var intradeEvent = new IntradeEvent({
				endDate: new Date( rawEvent.EndDate ),
				startDate: new Date( rawEvent.StartDate ),
				groupId: parseInt( rawEvent.groupID ),
				id:	parseInt( rawEvent.id ),
				description: rawEvent.description,
				name: rawEvent.name
			});

			eventGroup._addEvent( intradeEvent );

			if ( !_.isArray(rawEvent.contract )) {
				rawEvent.contract = [rawEvent.contract];
			}

			for (var l = 0; l < rawEvent.contract.length; l++ ){

				var rawContract = rawEvent.contract[l];
			
			
				var intradeContract = new IntradeContract({
					currency:rawContract.ccy,
					id: parseInt(rawContract.id,10),
					isRunning: rawContract.isRunning || false,
					state: rawContract.state,
					symbol: rawContract.symbol,
					tickSize: rawContract.tickSize,
					tickVolumn: parseInt( rawContract.tickVolumn, 10 ),
					type: rawContract.type
				});
				
				intradeEvent._addContract( intradeContract );
			}
		}
	}
};




module.exports = IntradeEventClass;