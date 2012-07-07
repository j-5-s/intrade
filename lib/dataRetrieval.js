
var request = require('request'),
	globals = require('../util/globals'),
	parser  = require('xml2json'),
	util    = require('util'),
	_       = require('underscore');


module.exports.version = '0.0.1';

//models
var IntradeEventClass    = require('./models/IntradeEventClass'),
	IntradeEventGroup    = require('./models/IntradeEventGroup'),
	IntradeEvent         = require('./models/IntradeEvent'),
	IntradeContract      = require('./models/IntradeContract'),
	IntradeContractInfo  = require('./models/IntradeContractInfo');


var list = function( options, callback ) {
	
	var envVars = globals[options.env];
	
	if (typeof envVars === 'undefined') {
		throw new Error( 'Use \'dev\' or \'production\' for environment paramter' );
	}

	request.get(envVars.base_url + 'MarketData/xml.jsp', function(err, resp, body){
		var json         = parser.toJson(body, {object:true}),
			eventClasses = json.MarketData.EventClass,
			buffer       = [];
		
		for (var i = 0; i < eventClasses.length; i ++) {
			var rawEventClass = eventClasses[i],
				eventClass    = new IntradeEventClass({name:rawEventClass.name,
					id:rawEventClass.id,
					displayOrder:rawEventClass.displayOrder
				});

			buffer.push( eventClass );



			eventClass._addRawEventGroups( rawEventClass.EventGroup );


		}

		callback( buffer );
	});
};

module.exports.list = list;


/*
 * To get a list of contracts in a specific class use the following url:
 * A subset of this data based on EventClass(e.g. Politics, Financial etc.)
 * @returns {IntradeEventClass}
 */
var getContractsByClass = function( options, callback ) {
	
	var envVars = globals[options.env];
	
	if (typeof envVars === 'undefined') {
		throw new Error( 'Use \'dev\' or \'production\' for environment paramter' );
	}

	if (typeof options.class_id === 'undefined') {
		throw new Error( 'A class id is a required parameter for `getContractsByClass`' );
	}

	
	request.get(envVars.base_url + 'MarketData/XMLForClass.jsp?classID=' + options.class_id, function(err, resp, body){

		var json = parser.toJson(body, {object:true});
		
		var rawEventClass = json.EventClass,
			eventClass    = new IntradeEventClass({name:rawEventClass.name,
				id:rawEventClass.id,
				displayOrder:rawEventClass.displayOrder
			});

		eventClass._addRawEventGroups( rawEventClass.EventGroup);
		callback( eventClass );

	});

};

module.exports.getContractsByClass = getContractsByClass;


/**
 * Current price information is retrieved using the ContractBookXML.jsp.
 * @param options {Object}
 *   * options.id - the id of the contract for which marketdata is to be returned.
 *     Multiple ids may be specified. (e.g. id=743474&id=34566&...). The id of a
 *     contract can be got from the active contract listing (xml.jsp).
 *
 *   * timestamp - a timestamp to indicate a cutoff period for marketdata.
 *     Contracts whose marketdata has not changed since this timestamp will
 *     not be displayed. This is useful for an application that are maintaining
 *     current information and only need information about updates. Timestamps
 *     are represented by the number of milliseconds since January 1, 1970, 00:00:00 GMT.
 *
 *   * depth - the depth of orders that are returned. This defaults to 5. i.e. a maximum of
 *     5 bid/offer prices are returned. If you just need the best price you should pass in "depth=1"
 * @param callback {Function} IntradeContractInfo as first parameter
 */

var getPriceInformation = function( options, callback ) {

	var envVars   = (typeof options.env !== 'undefined') ? globals[options.env] : globals.production,
		ids       = '',
		timestamp = '',
		depth     = '';

	if (typeof options.id === 'undefined') {
		throw new Error( 'No id was set when calling getPriceInformation' );
	}

	if (_.isArray(options.id)) {
		ids = options.id.join('&id=');
	} else {
		ids = options.id;
	}

	if (typeof options.timestamp !== 'undefined') {
		timestamp = '&timestamp=' + options.timestamp;
	}

	if (typeof options.depth !== 'undefined') {
		depth = '&depth=' +options.depth;
	}


	request.get(envVars.base_url + 'MarketData/ContractBookXML.jsp?id=' + ids + timestamp + depth, function(err, resp, body){
		
		var json = parser.toJson(body, {object:true}),
			rawContractInfo = json.ContractBookInfo;

		//setup the bids and offers
		var rawBids = rawContractInfo.contractInfo.orderBook.bids.bid,
			rawOffers = rawContractInfo.contractInfo.orderBook.offers.offer;

			
		if (!_.isArray(rawBids)) {
			rawBids = [rawBids];
		}
		
		if (!_.isArray(rawOffers)) {
			rawOffers = [rawOffers];
		}

		var bids = [], offers = [];

		//Bids
		for ( var i = 0; i < rawBids.length; i++ ){
			bids.push({
				price: parseFloat( rawBids[i].price, 10),
				quantity: parseInt( rawBids[i].quantity, 10)
			});
		}
		
		//Offers

		for ( i = 0; i < rawOffers.length; i++ ){
		
			offers.push({
				price: parseFloat(rawOffers[i].price,10),
				quantity: parseInt(rawOffers[i].quantity,10)
			});
		}
		

		var contractInfo = new IntradeContractInfo({
			lastUpdated: new Date( rawContractInfo.lastUpdateTime ),
			close: parseFloat( rawContractInfo.contractInfo.close, 10) ,
			conID: parseInt( rawContractInfo.contractInfo.conID, 10 ),
			lstTrdPrc: parseFloat( rawContractInfo.contractInfo.lstTrdPrc, 10 ),
			lstTrdTme: new Date( rawContractInfo.contractInfo.lstTrdTme ),
			state: rawContractInfo.contractInfo.state,
			vol: rawContractInfo.contractInfo.vol,
			symbol: rawContractInfo.contractInfo.symbol,
			bids: bids,
			offers: offers
		});

		callback(contractInfo);
	});
};

module.exports.getPriceInformation = getPriceInformation;

/**
 * Other contract data can be retrieved using ConInfo.jsp.
 * @param options {Object}
 * @param callback {Function} (contracts)
 */

var getContractsByID = function( options, callback ) {
	var envVars   = (typeof options.env !== 'undefined') ? globals[options.env] : globals.production;

	if (typeof options.id === 'undefined') {
		throw new Error( 'No id was set when calling getContractByID' );
	}
	var ids = '';
	if (_.isArray(options.id)) {
		ids = options.id.join( '&id=' );
	} else {
		ids = options.id;
	}

	request.get(envVars.base_url + 'MarketData/ConInfo.jsp?id=' + ids, function(err, resp, body){
		
		var json           = parser.toJson(body, {object:true}),
			rawContracts   = json.conInfo.contract,
			contractBuffer = [];
		
		if (!_.isArray(rawContracts)) {
			rawContracts = [rawContracts];
		}

		

		for (var i = 0; i < rawContracts.length; i++) {
			var rawContract = rawContracts[i];
			
			// ccy: 'USD',
			// close: '14.1',
			// conID: '334244',
			// dayhi: '9.2',
			// daylo: '7.1',
			// dayvol: '600',
			// lifehi: '90.0',
			// lifelo: '4.5',
			// lstTrdPrc: '7.1',
			// lstTrdTme: '1341396674021',
			// maxMarginPrice: '100.0',
			// minMarginPrice: '0.0',
			// state: 'O',
			// tickSize: '0.1',
			// tickValue: '0.01',
			// totalvol: '29.0k',
			// type: 'PX',
			// symbol: 'GAS.TOUCH.$4.50.DEC12'

			var	intradeContract = new IntradeContract({
				currency:rawContract.ccy,
				close: parseFloat( rawContract.close, 10 ),
				dayhi: parseFloat( rawContract.dayhi, 10 ),
				daylo: parseFloat( rawContract.daylo, 10 ),
				dayvol: parseFloat( rawContract.dayvol, 10 ),
				id: parseInt(rawContract.conID,10),
				isRunning: rawContract.isRunning || false,
				lifehi: parseFloat( rawContract.lifehi, 10 ),
				lifelo: parseFloat( rawContract.lifelo, 10 ),
				lstTrdPrc: parseFloat( rawContract.lstTrdPrc, 10 ),
				lstTrdTme: new Date(parseInt(rawContract.lstTrdTme,10)),
				maxMarginPrice: parseFloat( rawContract.maxMarginPrice, 10),
				minMarginPrice: parseFloat( rawContract.minMarginPrice, 10),
				state: rawContract.state,
				symbol: rawContract.symbol,
				tickSize: rawContract.tickSize,
				tickVolumn: parseInt( rawContract.totalvol, 10 ),
				type: rawContract.type
			});

			contractBuffer.push(intradeContract);
		}
		
		callback( contractBuffer );
	});
};

/**
 * Other contract data can be retrieved using ConInfo.jsp.
 * @param options {Object}
 * @param callback {Function} (contract)
 */

var getContractByID = function( options, callback ) {
	getContractsByID(options,function(contracts){
		if (contracts.length === 0) {
			callback();
		}
		callback(contracts[0]);
	});
};

module.exports.getContractsByID = getContractsByID;
module.exports.getContractByID = getContractByID;

/**
 * Time and Sales data information is retrieved using
 * the TimeAndSales.jsp. You can get data for the last 24 hours only.
 * @param options {Object}
 *    - id {Number} contract id (String works)
 */

var getTimeAndSales = function( options, callback ) {

	var envVars   = (typeof options.env !== 'undefined') ? globals[options.env] : globals.production;

	if (typeof options.id === 'undefined') {
		throw new Error( 'No id was set when calling getContractByID' );
	}

	request.get(envVars.base_url + '/TradeData/TimeAndSales.jsp?conID=' + options.id, function(err, resp, body){
		var lines = body.split('\r'),
			buffer = [];

		for (var i = 0; i < lines.length; i++ ){
			var line = lines[i],
				parts = line.split(',\t');
			
			if (parts[0] && parts[0] !== 'No trades found' ) {
				buffer.push({
					dt: new Date(parseInt(parts[0],10)),
					date: parts[1],
					price: parseFloat( parts[2], 10),
					quantity: parseInt(parts[3], 10)
				});
			}
		}

		callback(buffer);
	});
};

module.exports.getTimeAndSales = getTimeAndSales;