var _          = require('Underscore'),
	BaseObject = require('./BaseObject');;

/**
 * Contract Info class
 * belongs to a contract
 */
var IntradeContractInfo = function( attributes ) {
	this.attributes = {};
	if (typeof attributes !== 'undefined' ){
		this.set( attributes );	
	}

	this.toString = function() {
		return 'IntradeContractInfo';
	};
};

//Extend the base object for @get & @set
IntradeContractInfo.prototype = BaseObject.prototype;


module.exports = IntradeContractInfo;
