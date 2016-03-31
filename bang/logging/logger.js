
"use strict"





const bunyan  = require('bunyan')




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
	name: "bang! (server)",
	streams: [{
		stream: process.stdout
	}],
	serializers
})
