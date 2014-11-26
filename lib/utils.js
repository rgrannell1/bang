#!/usr/bin/env node

const path    = require('path')
const winston = require('winston')





const relative = function () {

	const args = Array.prototype.slice.call(arguments)
	return path.resolve.apply( null, [__dirname].concat(args) )

}

const debugInfo = function () {
	return {
		pid:  process.pid,
		time: (new Date.getHours()) + ':' + (new Date.getMinutes())
	}
}





var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)({
			filename: path.resolve(__dirname, '..', 'bang.log')
		}),
		new (winston.transports.Console)
	]
})





module.exports = {
	relative:  relative,
	logger:    logger,
	debugInfo: debugInfo
}
