#Intrade API For NodeJS

Designed to connect to Intrade via tha <a href="http://www.intrade.com/v4/misc/help/api/">Intrade API</a>. Includes:
* Data Retrieval API (incomplete)
* Trading API (coming soon)

## Install
<pre>
	npm install request
</pre>

## Data Retrieval API

### Active Contract Listening
This is a list of all active contract and contracts that have expired(settled) within the last 24hrs.

```javascript
var intradeDataRetreival = require('intrade').dataRetrieval;
var options = {
	//env: 'dev' //defaults to 'production'
};

intradeDataRetreival.list( options, function(eventClasses){
	var eventClass     = eventClasses[0],
		name           = eventClass.get('name'),
		eventGroups    = eventClass.get('eventGroups'),
		eventGroup     = eventGroups[0],
		eventGroupName = eventGroup.get('name'),
		events         = eventGroup.get('events'),
		event          = events[0],
		contracts      = event.get('contracts'),
		contract       = contracts[0],
		contract_id    = contract.get('id');
});

```

### All Contracts By Event Class
To get a list of contracts in a specific class.

```javascript
var options = {
	env: 'dev',// omit for production or use `production`
	class_id: 66
};		

intradeDataRetreival.getContractsByClass( options, function(eventClass){
	//..
});
```

###Price Information
Current price information

```javascript
intradeDataRetreival.getPriceInformation( options, function( intradeContractInfo ){
	var closingPrcie = intradeContractInfo.get('close');
});
```

###Contract Information
Other contract data

```javascript
var options = {
	env: 'dev',
	id: 334244
};

intradeDataRetreival.getContractByID( options, function( contract ){
	contract.get('type');
});
```
###Historical Trading Info (Closing Prices) 
***TODO***

###Daily Time and Sales
Time and Sales data information. You can get data for the last 24 hours only.
```javascript
var options = {
	id: 749429
};

intrade.getTimeAndSales( options, function(timeAndSalesData){
		console.log( 'timeAndSalesData' ,timeAndSalesData );
});
```


## License 

(The MIT License)

Copyright (c) 2009-2011 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.