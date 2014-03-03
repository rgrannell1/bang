
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

;( function () {
	"use strict"
} )()

const fs = require('fs')
const url = require('url')
const http = require('http')
const engines = require('./engines.js')
const path = require('path')

const consts = ( function () {
	/*
		each search engine has a set of patterns that can be used
		as a case-insensitive regular expression for the search engine,
		and a function that takes the terms and returns the URL
		with the search term attatched.
	*/

	return {
		port:
			8125,
		engines:
			engines.engines
	}

})()

const exclaim = {
	startup: function (port) {

		console.log(
			'bang! js server listening at http://127.0.0.1:' + port + '/')
	}
}

const redirect = function (terms) {
	/*
		string -> string
		given the search terms and possibly
		a search engine bang operator return a
		url that queries that given engine,
		or default to google.
	*/

	for (var ith in consts.engines) {
		if (!consts.engines.hasOwnProperty(ith)) {
			continue
		}

		if (/!about/i.test(terms)) {
			/*
				a special case, since it doesn't redirect to the base
				url if no search terms are given. Display a help page.
			*/

			return {
				expandedURL:
					path.dirname(require.main.filename) + "/help.html",
				hostName:
					path.dirname(require.main.filename) + "/help.html",
				terms:
					""
			}
		}

		var engine = consts.engines[ith]
		var queryContainsBang = engine.regexp.test(terms)

		if (queryContainsBang) {

			/*
				From a bang query ("!w monkey") generate a proper query
				("wikipedia.org/?q=monkey") and the base url ("wikipedia.org")
			*/

			var terms = terms.
				replace(engine.regexp, '')

			var redirector = engine.response
			var expandedURL = url.parse(redirector(terms), true)

			var hostName =
				expandedURL.protocol + '//' + expandedURL.hostname + '/'

			return {
				expandedURL:
					expandedURL.href,
				hostName:
					hostName,
				terms:
					terms
			}
		}
	}

	// default to encrypted google.

	return {
		expandedURL:
			( function (terms) {
				return "https://encrypted.google.com/search?hl=en&q=" + terms

			} )(terms),
		hostName:
			"https://encrypted.google.com/",
		terms:
			terms
	}
}





// ---------- http server ---------- //

http.createServer( function (request, response) {

	if (request.url === "/help-data.js") {
		/*
			send the help-data.js resource to the client.
		*/

		const help_data_path = __dirname + '/help-data.js'

		response.write(fs.readFileSync(help_data_path))
	}

	const terms = url.parse(request.url, true).query.q

	if (typeof terms !== 'undefined') {

		const redirected = redirect(terms)
		const hasNoTerms =
			redirected.terms.replace(/ /g, '').length === 0

		/*
			set the http response status to 302 (found)
			and set the location to the parsed query.
		*/

		response.statusCode = 302

		if (redirected.hostName === "/home/ryan/bang.js/lib/help.html") {

			var localPath = __dirname + "/help.html"

			response.setHeader(
				'Content-Type', "text/html")

			response.write( fs.readFileSync(localPath) )

		} else if (hasNoTerms) {
			// redirect to the host itself.

			response.setHeader(
				'Location', redirected.hostName)

		} else {
			// query the host with the given search terms.

			response.setHeader(
				'Location', redirected.expandedURL)

		}
	}

	response.end('')

} ).
listen(consts.port)

exclaim.startup(consts.port)
