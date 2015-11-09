#!/usr/bin/env node

"use strict"




const fs         = require('fs')
const is         = require('is')
const mustache   = require('mustache')
const constants  = require('../commons/constants')
const httpStatus = require('../commons/http-status')

const utils      = require('../commons/utils.js')
const engines    = require('../engines.js')
const rd         = require('../redirect.js')
const logger     = utils.logger





/*
	serveHelp :: object -> undefined

	serve the help page back to the user.
*/

const serveHelp = res => {

	const view = {
		engines: engines.engines.map(engine => {

			return {
				patterns: engine.patterns,
				baseURL:  engine.baseURL
			}

		}),
		version: constants.version
	}

	fs.readFile(constants.paths.HELP_PATH, (err, template) => {

		if (err) {
			throw Error('failed to load help template')
		}

		res
		.set('Content-Type', 'text/html')
		.status(httpStatus.ok)
		.send(mustache.render(template.toString( ), view))
		.end( )

	})

}





/*
	redirectBrowser :: object -> object -> undefined

	redirect the browser to another search engine. The major
	action this application performs.

*/

const redirectBrowser = (res, redirected) => {

	redirectBrowser.precond(res, redirected)

	const onlyEngine = redirected.searchTerms.replace(/\s/g).length === 0

	res
	.status(httpStatus.found)
	.set('Location', onlyEngine ? redirected.baseURL : redirected.queryURL)
	.end( )

}

redirectBrowser.precond = (res, redirected) => {

	if (is.undefined(redirected)) {
		logger.error("redirectBrowser: redirected was undefined")
	}

}





var search = (req, res) => {
	/*
		redirect the url.
	*/

	const redirected    = rd.redirect(req.query.q || "")
	const requestedHelp = redirected.baseURL === utils.relative('help.html') // TODO FIX

	requestedHelp
		? serveHelp(res)
		: redirectBrowser(res, redirected)

}





module.exports = search
