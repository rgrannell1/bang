#!/usr/bin/env node




/*
	Bang! js

	A node server for redirecting queries to other search engines.

	This takes a bang operator (for example "!w") and a query
	(for example "glycerol"), and redirects the query to the website
	designated by the bang operator.

	DuckDuckGo has a similar feature, but I wrote my own alternative for
	several reasons: DuckDuckGo defaults to itself, while Bang! defaults to
	google. Bang! is hosted locally, so there is no need to relay through
	an intermediate server to format your query.

*/

const fs        = require('fs')
const is        = require('is')
const url       = require('url')
const path      = require('path')
const express   = require('express')
const mustache  = require('mustache')


const utils     = require('./utils.js')
const engines   = require('./engines.js')
const rd        = require('./redirect.js')
const constants = require('./constants.js')

const relative  = utils.relative
const logger    = utils.logger

const format    = require('util').format










const serveHelp = function (res, fpath) {

	const view = {
		engines: engines.engines.map(function (engine) {

			return {
				patterns: engine.patterns,
				hostname: engine.hostname
			}

		})
	}

	fs.readFile(relative('help-template.html'), function (err, template) {

		res
		.set('Content-Type', 'text/html')
		.send(mustache.render(template.toString(), view))
		.end()

	})

}




const redirectBrowser = function (res, redirected) {

	if (is.undefined(redirected)) {
		logger.error("redirectBrowser: redirected was undefined")
	}

	const onlyEngine = redirected.terms.replace(/ 	/g).length === 0

	res
	.status(302)
	.set('Location', onlyEngine? redirected.hostname : redirected.queryURL)
	.end()

}





const shutdown = function (uptime) {
	return function () {

		logger.info( format('terminating Bang! server after %d minutes of uptime.', (uptime() / (60000)).toFixed(2)) )

	}
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

	config      = config      || {}
	services    = services    || []
	config.port = config.port || constants.port





	var app      = express()
	const uptime = ( function () {

		const startTime = (new Date()).getTime()

		return function () {
			return (new Date()).getTime() - startTime
		}

	} )()





	app.get('/suggest', function (req, res) {
		/*
			find search suggestions.
		*/

		const searchTerms = req.query.q || ""
		const suggestURL  = "http://suggestqueries.google.com/complete/search?"









		res.end()

	})

	app.get('/search', function (req, res) {
		/*
			redirect the url.
		*/

		const searchTerms   = req.query.q || ""

		const redirected    = rd.redirect(searchTerms)
		const requestedHelp = redirected.hostname === relative('help.html')

		requestedHelp ? serveHelp(res) : redirectBrowser(res, redirected)

	})

	app.use(function (err, _, _, _) {

		logger.error( err.stack )

	})





	process.on('SIGTERM', process.exit)
	process.on('SIGINT',  process.exit)

	process.on('exit',  shutdown(uptime))





	return app.listen(config.port, function () {
		logger.info(format('Bang! %s listening at http://localhost:%d (pid %d).', constants.version, config.port, process.pid))
	})

}




BangServer()
