var _          = require('Underscore'),
	BaseObject = require('./BaseObject');

/**
 * Contract event class
 */
var IntradeContract = function( attributes ) {
	this.attributes = {};
	if (typeof attributes !== 'undefined' ){
		this.set( attributes );	
	}
	
	this.toString = function() {
		return 'IntradeContract';
	};
};

//Extend the base object for @get & @set
IntradeContract.prototype = BaseObject.prototype;


module.exports = IntradeContract;