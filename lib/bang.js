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
const http      = require('http')
const path      = require('path')
const express   = require('express')

const engines   = require('./engines.js')
const rd        = require('./redirect.js')
const constants = require('./constants.js')





// --------- write engine -------------- //

require('./write-as-json.js')

// --------- message -------------- //

const exclaim = {
	startup: function (port, version) {

		console.log(
			'Bang! ' + version + ' server listening at http://localhost:' + port + '/' + '\n' +
			'Ctr + c to terminate the server.' )
	}
}





const serveHelp = function (res) {

	fs.readFile(helpPath, function (err, data) {

		if (err) {
			console.log(err)
			return
		}

		res.set('Content-Type', 'text/html').send(data).end()

	})

}

const redirectBrowser = function (res, redirected) {

	const onlyEngine  = redirected.terms.replace(/ 	/g).length === 0

	res
	.status(302)
	.set('Location', onlyEngine? redirected.hostName : redirected.expandedURL)
	.end()

}

const relative = function () {
	return path.resolve.apply( null, [__dirname].concat(Array.prototype.slice.call(arguments)) )
}










var app = express()

app.use(function (err, _, _, _) {
	console.log(err.stack)
})

app.get('/help-data.js', function (req, res) {
	/*
		Serve help-data.js to the client asyncronously.
	*/

	fs.readFile(relative('help-data.js'), function (err, file) {
		err ? console.log(err) : res.send(file)
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

	const searchTerms   = req.params.searchTerms
	const redirected    = rd.redirect(searchTerms)

	const requestedHelp = redirected.hostName === relative('help.html')

	requestedHelp ?
		serveHelp(res, helpPath) :
		redirectBrowser(res, redirected)

})





app.listen(constants.port)
exclaim.startup(constants.port, constants.version)
