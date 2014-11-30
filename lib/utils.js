#!/usr/bin/env node

const fs      = require('fs')
const path    = require('path')
const format  = require('util').format




const relative = function () {

	const args = Array.prototype.slice.call(arguments)
	return path.resolve.apply( null, [__dirname].concat(args) )

}

const logger = ( function(){

	const logStatus = function (level) {
		return function (message) {

			const fields = {
				level:   level,
				pid:     process.pid,
				time:    (new Date).toString(),
				posix:   Date.now(),
				message: message
			}

			const log = format(
				"%s    %s    %s    %d    %s\n",
				fields.level,
				fields.pid,
				fields.time,
				fields.posix,
				fields.message
			)

			process.stdout.write(log)
			fs.writeFile(path.resolve(__dirname, 'bang.log'), log, function (_) {
				return;
			})

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
