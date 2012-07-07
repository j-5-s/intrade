var _          = require('Underscore'),
	BaseObject = require('./BaseObject');

/**
 * The Event Group
 * @class
 */

var IntradeEventGroup = function( attributes ) {

	this.attributes = {
		//default storage for _events to empty array (to push)
		events: []
	};

	if (typeof attributes !== 'undefined' ){
		this.set( attributes );	
	}

	this.toString = function() {
		return 'IntradeEventGroup';
	};	

};


//Extend the base object for @get & @set
IntradeEventGroup.prototype = BaseObject.prototype;

/**
 * Adds the Event to the Event Group
 * @api private
 */

IntradeEventGroup.prototype._addEvent = function( intradeEvent ) {
	this.get('events').push( intradeEvent );
};

module.exports = IntradeEventGroup;