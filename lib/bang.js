#!/usr/bin/env node

"use strict"





/*
	Bang! js

	A node server for redirecting queries to other search engines.

	This takes a bang operator (for example "!w") and a query
	(for example "glycerol"), and redirects the query to the website
	designated by the bang operator.

*/

const fs         = require('fs')
const is         = require('is')
const express    = require('express')
const request    = require('request')
const mustache   = require('mustache')
const httpStatus = require('./commons/http-status')
const constants  = require('./commons/constants')

const utils      = require('./commons/utils.js')
const engines    = require('./engines.js')
const rd         = require('./redirect.js')
const logger     = utils.logger

const suggest    = require('./rest/suggest')
const search     = require('./rest/search')





/*
	shutdown :: number -> undefined

	log that the process is being terminated.
*/

const shutdown = uptime => {

	logger.info({
		uptime: (uptime( ) / (60 * 1000)).toFixed(2)
	}, 'terminating Bang! server')

}





/*
	BangServer

	This constructor creates a new bang server instance. This server
	takes queries of the form

	domain/search/?q={searchTerms}
	domain/suggest/?q={searchTerms}

	where searchTerms is some arbitrary search term. Bang's main use is
	to parse queries with special bang-syntax flags - like !twitter cats - and
	to direct the client to that search engine with a query primed for use on
	that site.


*/

const BangServer = function (services, config) {

	config        = config      || { }
	services      = services    || [ ]
	config.port   = config.port || process.env.port

	var app       = express( )
	const uptime  = utils.timer( )





	app.get('/suggest', suggest)
	app.get('/search',  search)

	app.use(err => {
		logger.error(err)
	})





	app
	.listen(config.port, "localhost", ( ) => {

		logger.info({
			port:    config.port,
			pid:     process.pid,
			version: constants.version
		},
		'Bang! listening')

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

	return app
}





module.exports = BangServer
