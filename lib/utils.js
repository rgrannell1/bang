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

			const fields = {
				label:   label,
				pid:     process.pid,
				time:    (new Date).toString(),
				posix:   Date.now(),
				message: message
			}

			const log = format(
				"%s    %s    %s    %d    %s",
				fields.label,
				fields.pid,
				fields.time,
				fields.posix,
				fields.message
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
