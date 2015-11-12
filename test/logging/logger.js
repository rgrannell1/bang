
"use strict"




var bunyan = require('bunyan')





var serializers = { }

serializers.err = err => {

	return {
		message: err.message
			? err.message
			: undefined,

		stack: err.stack
			? err.stack.toString( )
			: undefined
	}

}




module.exports = bunyan.createLogger({
	name: "bang! (testing)",
	streams: [{
		stream: process.stdout
	}],
	serializers
})
