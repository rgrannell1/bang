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
const url       = require('url')
const http      = require('http')
const engines   = require('./engines.js')
const rd        = require('./redirect.js')
const path      = require('path')
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

// ---------- http server ---------- //

var server = http.createServer( function (request, response) {

	if (request.url === "/help-data.js") {
		/*
			send the help-data.js resource to the client.
		*/

		const help_data_path = __dirname + '/help-data.js'

		response.write(fs.readFileSync(help_data_path))
	}

	const terms = url.parse(request.url, true).query.q

	if (typeof terms !== 'undefined') {

		const redirected = rd.redirect(terms)
		const hasNoTerms =
			redirected.terms.replace(/ /g, '').length === 0

		/*
			set the http response status to 302 (found)
			and set the location to the parsed query.
		*/

		response.statusCode = 302

		const localPath = __dirname + "/help.html"

		if (redirected.hostName === localPath) {

			response.setHeader('Content-Type', "text/html")
			response.write( fs.readFileSync(localPath) )

		} else {

			const redirectedURL =
				hasNoTerms ? redirected.hostName : redirected.expandedURL

			response.setHeader('Location', redirectedURL)
		}
	}

	response.end('')

} )

server.on("error", function (err) {

	console.log(
		"An error was thrown by the Bang! server executing on port " +
		constants.port + ":\n" )

	console.dir(err)
})







server.listen(constants.port)

exclaim.startup(constants.port, constants.version)
