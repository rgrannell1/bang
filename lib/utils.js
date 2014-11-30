#!/usr/bin/env node

const fs      = require('fs')
const path    = require('path')
const format  = require('util').format




const relative = function () {

	const args = Array.prototype.slice.call(arguments)
	return path.resolve.apply( null, [__dirname].concat(args) )

}

const logger = ( function(){

	const logStatus = function (label) {
		return function (message) {

			const now = new Date
			const log = format(
				"%s    %s    %s    %d    %s",
				label,
				process.pid,
				(new Date).toString(),
				Date.now(),
				message
			)

			console.log(log)
			fs.writeFile(path.resolve(__dirname, 'bang.log'))

		}
	}

	return {
		info:  logStatus("info"),
		error: logStatus("error"),
	}

} )()





module.exports = {
	relative:  relative,
	logger:    logger
}
