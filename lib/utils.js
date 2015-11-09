#!/usr/bin/env node

const fs      = require('fs')
const path    = require('path')
const format  = require('util').format

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

	const startTime = (new Date( )).getTime( )

	return ( ) => {
		return (new Date( )).getTime( ) - startTime
	}

}




const logger = bunyan.createLogger({
	name: "bang!",
	streams: [{
		stream: process.stderr
	}]

})





module.exports = {
	relative: relative,
	logger:   logger,
	timer:    timer
}
