
"use strict"




var fs             = require('fs')
var mustache       = require('mustache')

var constants      = require('../commons/constants')
var httpStatus     = require('../commons/http-status')
var enginePatterns = require('../data/engines.json')
var logger         = require('../logging/logger')
var Engine         = require('../model/engine')





var about = (config, req, res) => {

	var view = {
		engines: enginePatterns.map(Engine).map(engine => {

			return {
				patterns: engine.patterns.map(pattern => {
					return {pattern}
				}),
				baseURL:  engine.baseUrl
			}

		}),
		version: constants.version
	}

	fs.readFile(constants.paths.HELP_PATH, (err, template) => {

		if (err) {

			logger.fatal({err}, 'could not load help file.')
			config.fatalErrorHandler(err)

		}

		res
		.set('Content-Type', 'text/html')
		.status(httpStatus.ok)
		.send(mustache.render(template.toString( ), view))
		.end( )

	})

}





module.exports = about
