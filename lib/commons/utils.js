#!/usr/bin/env node

"use strict"





const path    = require('path')
const bunyan  = require('bunyan')





const variadic = function (fn) {
	return function ( ) {
		return fn(Array.prototype.slice.call(arguments))
	}
}



/*
	relative -> string...

	resolve a file path relative to the root of wherever bang is installed.
*/

const relative = variadic(function (args) {
	return path.resolve.apply( null, [__dirname].concat(args) )
})





const timer = ( ) => {

	const startTime = Date.now( )

	return ( ) => {
		return Date.now( ) - startTime
	}

}




const logger = bunyan.createLogger({
	name: "bang!",
	streams: [{
		stream: process.stdout
	}]

})





module.exports = {
	relative: relative,
	logger:   logger,
	timer:    timer
}
