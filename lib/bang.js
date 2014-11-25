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
const winston   = require('winston')
const express   = require('express')
const mustache  = require('mustache')


const utils     = require('./utils.js')
const engines   = require('./engines.js')
const rd        = require('./redirect.js')
const constants = require('./constants.js')

const relative  = utils.relative
const logger    = utils.logger





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

	const onlyEngine  = redirected.terms.replace(/ 	/g).length === 0

	res
	.status(302)
	.set('Location', onlyEngine? redirected.hostname : redirected.expandedURL)
	.end()

}





var app = express()

app.get('/help-data.json', function (req, res) {
	/*
		Serve help-data.json to the client asyncronously.
	*/

	fs.readFile(relative('help-data.json'), function (err, file) {
		err ? logger.error(err, {pid:  process.pid}) : res.send(file)
	})

})

app.get('/suggest/:searchTerms', function (req, res) {
	/*
		find some suggestions.
	*/

	res.end()

})

app.get('/search/:searchTerms', function (req, res) {
	/*
		redirect the URL.

	*/

	const redirected    = rd.redirect(req.params.searchTerms)
	const requestedHelp = redirected.hostname === relative('help.html')

	requestedHelp ?
		serveHelp(res) :
		redirectBrowser(res, redirected)

})





app.use(function (err, _, _, _) {

	logger.error(err.stack, {
		pid:  process.pid
	})

})





logger.info(
	'Bang! ' + constants.version +
	' listening at http://localhost:' +
	constants.port + " (pid %d).", process.pid)



app.listen(constants.port)
