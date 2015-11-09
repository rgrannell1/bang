#!/usr/bin/env node

"use strict"




var fs         = require('fs')
var is         = require('is')
var express    = require('express')
var request    = require('request')
var mustache   = require('mustache')
var httpStatus = require('../commons/http-status')
var constants  = require('../commons/constants')

var utils      = require('../commons/utils.js')
var engines    = require('../engines.js')
var rd         = require('../redirect.js')
var logger     = utils.logger

var rest       = { }

rest.suggest   = require('../rest/suggest')
rest.search    = require('../rest/search')





var shutdown = uptime => {

	logger.info({
		uptime: (uptime( ) / (60 * 1000)).toFixed(2)
	}, 'terminating Bang! server')

}





var bangServer = (services, config, callback) => {

	var app    = express( )
	var uptime = utils.timer( )

	app.get('/suggest', rest.suggest)
	app.get('/search',  rest.search)





	app.listen(config.port, "localhost", ( ) => {

		logger.info({
			port:    config.port,
			pid:     process.pid,
			version: constants.version
		},
		'Bang! listening')

		callback(app)

	})
	.on('error', err => {

		if (err.errno === 'EADDRINUSE') {
			logger.error({port: config.port}, 'port currently in use.')
		} else {
			logger.error(err)
		}

	})





	process.on('SIGTERM', process.exit)
	process.on('SIGINT',  process.exit)
	process.on('exit',    shutdown.bind({ }, uptime))

}





module.exports = bangServer
