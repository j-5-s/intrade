var _          = require('Underscore'),
	BaseObject = require('./BaseObject');

var IntradeEvent = function( attributes ) {
	
	this.attributes = {
		contracts: [] //default storage for contracts to empty array (to push)
	};

	if (typeof attributes !== 'undefined' ){
		this.set( attributes );	
	}

	this.toString = function() {
		return 'IntradeEvent';
	};


	this._contracts = [];
};

//Extend the base object for @get & @set
IntradeEvent.prototype = BaseObject.prototype;

/**
 * Adds the contract to the event
 * only used for building a list or object internally
 * @api private
 */
IntradeEvent.prototype._addContract = function( intradeContract ){
	this.get('contracts').push( intradeContract );
};

module.exports = IntradeEvent;