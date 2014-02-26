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
	.
*/

;( function () {
	"use strict"
} )()

var url = require('url')
var http = require('http')
var engines = require('./engines.js')

var consts = ( function () {
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

		var engine = consts.engines[ith]
		var queryContainsBang = engine.regexp.test(terms)

		if (queryContainsBang) {
			// redirect the query to the appropriate search engine.

			var terms = terms.
				replace(engine.regexp, '')

			var redirector = engine.response

			var fullURL = url.parse(
				redirector(terms), true)

			var baseURL =
				fullURL.protocol + '//' +
				fullURL.hostname + '/'

			return {
				fullURL:
					fullURL.href,
				baseURL:
					baseURL,
				terms:
					terms
			}
		}
	}

	// default to encrypted google.

	return {
		fullURL:
			( function (terms) {
				return "https://encrypted.google.com/search?hl=en&q=" + terms

			} )(terms),
		baseURL:
			"https://encrypted.google.com/",
		terms:
			terms
	}
}





// ---------- http server ---------- //

http.createServer( function (request, response) {

	const terms = url.parse(request.url, true).query.q

	if (typeof terms !== 'undefined') {

		const redirected = redirect(terms)
		const emptySearchTerms =
			redirected.terms.replace(/ /g, '').length === 0

		/*
			set the http response status to 302 (found)
			and set the location to the parsed query.
		*/

		response.statusCode = 302

		if (emptySearchTerms) {
			// redirect to the host itself.

			response.setHeader(
				'Location', redirected.baseURL)

		} else {
			// query the host with the given search terms.

			response.setHeader(
				'Location', redirected.fullURL)
		}
	}

	response.end('')

} ).
listen(consts.port)

exclaim.startup(consts.port)
