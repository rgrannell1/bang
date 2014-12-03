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
const express   = require('express')
const request   = require('request')
const mustache  = require('mustache')


const utils     = require('./utils.js')
const engines   = require('./engines.js')
const rd        = require('./redirect.js')

const relative  = utils.relative
const format    = require('util').format

const logger    = utils.logger





/*
	serveHelp :: object -> undefined

	serve the help page back to the user.
*/

const serveHelp = function (res) {

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





/*
	redirectBrowser :: object -> object -> undefined

	redirect the browser to another search engine. The major
	action this application performs.
*/

const redirectBrowser = function (res, redirected) {

	if (is.undefined(redirected)) {
		logger.error("redirectBrowser: redirected was undefined")
	}

	const onlyEngine = redirected.searchTerms.replace(/ 	/g).length === 0

	res
	.status(302)
	.set('Location', onlyEngine? redirected.hostname : redirected.queryURL)
	.end()

}





/*
	giveSuggestions :: object -> {suggest: string, terms: string}

	return search results to the browser.

	TODO should call routine to get search results, serve to browser.
*/

const giveSuggestions = function (browserResponse, redirected) {

	if (is.undefined(redirected)) {
		logger.error("giveSuggestions: redirected was undefined")
	}

	if (redirected.searchTerms.length === 0) {
		return;
	}

	request(redirected.suggestionURL, function (err, res, body) {

		if (err) {

			logger.error('request failed: %s', err.message)

		} else if (res.statusCode !== 200) {

			logger.error(
				format("giveSuggestions: non-200 status returned by %s (%d)", redirected.suggestionURL, res.statusCode))

		} else {
			// OpenSearch compliant format [term, [sug1, sug2, ...]]

			console.log( redirected.suggestionURL )

			browserResponse
			.status(200)
			.set('Content-Type', 'application/json; charset=utf-8')
			.send(body)
			.end()

		}

	})

}





/*
	shutdown :: number -> undefined

	log that the process is being terminated.
*/

const shutdown = function (uptime) {
	return function () {
		logger.info('terminating Bang! server after %d minutes of uptime.', (uptime() / (60000)).toFixed(2))
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

	config        = config      || {}
	services      = services    || []
	config.port   = config.port || process.env.port

	var app       = express()
	const uptime  = utils.timer()

	const version = require('../package.json').version




	app.get('/suggest', function (req, res) {
		/*
			find search suggestions.
		*/

		giveSuggestions(res, rd.redirect(req.query.q || ""))

	})

	app.get('/search', function (req, res) {
		/*
			redirect the url.
		*/

		const redirected    = rd.redirect(req.query.q || "")
		const requestedHelp = redirected.hostname === relative('help.html')

		requestedHelp ? serveHelp(res) : redirectBrowser(res, redirected)

	})

	app.use(function (err, _, _, _) {
		logger.error(err)
	})





	app
	.listen(config.port, function () {

		logger.info(
			format('Bang! %s listening at http://localhost:%d (pid %d).',
				version, config.port, process.pid))

	})
	.on('error', function (err) {

		if (err.errno === 'EADDRINUSE') {
			logger.error('port %s currently in use.', config.port)
		} else {
			logger.error(err)
		}

	})





	process.on('SIGTERM', process.exit)
	process.on('SIGINT',  process.exit)
	process.on('exit',    shutdown(uptime))

	return app
}




try {
	BangServer( [], {port: process.argv[2]} )
} catch (err) {
	logger.error('uncaught exception %s', err.message)
}
