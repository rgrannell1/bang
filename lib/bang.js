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










var app = express()

app.get('/help-data.js', function (req, res) {
	/*
		Serve help-data.js to the client asyncronously.
	*/

	fs.readFile(path.join(__dirname, '/help-data.js'), function (err, file) {
		err ? console.log(err) : res.send(file)
	})

})

app.get('/suggest/:searchTerms', function (req, res) {
	/*
		find some suggestions.
	*/


})

app.get('/search/:searchTerms', function (req, res) {
	/*
		redirect the URL.
	*/

	const searchTerms = req.params.searchTerms

	if (is.undefined(searchTerms)) {
		return
	}

	const redirected = rd.redirect(searchTerms)
	const onlyEngine = redirected.terms.trim.length === 0

	const helpPath   = path.join(__dirname , 'help.html')

	if (redirected.hostName === helpPath) {

		fs.readFile(helpPath, function (err, data) {

			if (err) {
				console.log(err)
				return
			}

			res.set('Content-Type', 'text/html').send(data).end()

		})

	} else {

		res
		.status(302)
		.set('Location', onlyEngine? redirected.hostName : redirected.expandedURL)
		.end()

	}

})

app.use(function (err, _, _, _) {
	console.log(err.stack)
})





app.listen(constants.port)
exclaim.startup(constants.port, constants.version)
