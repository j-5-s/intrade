var _ = require('Underscore');

var BaseObject = function() {
	this.attributes = {};
};

/**
 * Sets an attribute value on the object
 */
BaseObject.prototype.set = function( params ) {
	_.extend(this.attributes, params );
};

/**
 * Gets an attribute value on the object
 * @returns value {Mixed}
 */
BaseObject.prototype.get = function( key ) {
	return this.attributes[key];
};

module.exports = BaseObject;
