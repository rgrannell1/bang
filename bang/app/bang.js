

"use strict"




var is         = require('is')
var express    = require('express')
var constants  = require('../commons/constants')

var commons    = require('../commons/commons')
var logger     = require('../logging/logger')

var rest       = {
	suggest: require('../rest/suggest'),
	search:  require('../rest/search'),
	about:   require('../rest/about')
}





if (process.env.NODE_ENV !== 'production'){
	try {
		require('longjohn')
	} catch (err) {
		logger.error({err}, 'failed to load "longjohn" module. Is --production set?')
	}
}





var logUptime = uptime => {

	logger.info({

		uptime: (uptime( ) / (60 * 1000)).toFixed(2),
		unit:   'minutes'

	}, 'terminating Bang! server')

}




var attachRoutes = (app, config) => {

	app.get('/suggest', rest.suggest.bind({ }, config))
	app.get('/search',  rest.search .bind({ }, config))
	app.get('/about',   rest.about  .bind({ }, config))

	return app

}





var attachExitHandlers = (uptime, config) => {

	process.on('SIGTERM', process.exit)
	process.on('SIGINT',  process.exit)

	if (!config.silent) {
		process.on('exit', logUptime.bind({ }, uptime))
	}

	process.on('uncaughtException', err => {

		logger.fatal({err}, 'uncaught exception.')
		config.fatalErrorHandler(err)

	})

}





var bangServer = (rawConfig, callback) => {

	var config = bangServer.preprocess(bangServer.validate(rawConfig))

	var app    = attachRoutes(express( ), config)
	var uptime = commons.timer( )

	attachExitHandlers(uptime, config)





	var server = app.listen(config.port, ( ) => {

		if (!config.silent) {

			logger.info({
				port:    config.port,
				pid:     process.pid,
				version: constants.version
			},
			'Bang! listening')

		}

		callback(app, server)

	})
	.on('error', err => {

		if (err.errno === 'EADDRINUSE') {
			logger.fatal({
				port: config.port
			}, 'port currently in use.')
		} else {
			logger.fatal('uncaught error.')
		}

		config.fatalErrorHandler(err)

	})

}





bangServer.preprocess = config => {

	var defaults = { }

	defaults.fatalErrorHandler = ( ) => {
		process.exit(1)
	}

	defaults.trace = false
	defaults.port  = 8025

	Object.keys(defaults).forEach(key => {
		config[key] = is.undefined(config[key]) ? defaults[key] : config[key]
	})

	return config

}





bangServer.validate = config => {

	return config

}





module.exports = bangServer
