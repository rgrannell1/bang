#!/usr/bin/env node

const fs      = require('fs')
const path    = require('path')
const format  = require('util').format





/*
	relative -> string...

	resolve a file path relative to the root of wherever bang is installed.
*/

const relative = function () {

	const args = Array.prototype.slice.call(arguments)
	return path.resolve.apply( null, [__dirname].concat(args) )

}





const timer = function () {

	const startTime = (new Date()).getTime()

	return function () {
		return (new Date()).getTime() - startTime
	}

}





module.exports = {
	relative:  relative,
	timer:     timer
}
