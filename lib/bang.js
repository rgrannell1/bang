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

const consts = ( function () {

	/*
		each search engine has a set of patterns that can be used
		as a case-insensitive regular expression for the search engine,
		and a function that takes the terms and returns the URL
		with the search term attatched.
	*/

	const engines = [
		{
			patterns:
				['@'],
			response:
				function (terms) {
					return "http://127.0.0.1:" + terms
				}
		},
		{
			patterns:
				['!am', '!amuk', '!amazonuk'],
			response:
				function (terms) {
					return "http://www.amazon.co.uk/s/ref=nb_sb_noss_2?" +
						"url=search-alias%3Daps&field-keywords=" + terms
				}
		},
		{
			patterns:
				['!bf', '!bookfinder'],
			response:
				function (terms) {
					return "http://www.bookfinder.com/search/?author=&title=" +
						terms +
						"&lang=en&submit=Begin+search&new_used=*&destination=ie" +
						"&currency=EU&mode=basic&st=sr&ac=qr"
				}
		},
		{
			patterns:
				['!fb', '!facebook'],
			response:
				function (terms) {
					return "https://www.facebook.com/search/results.php?q=" + terms
				}
		},
		{
			patterns:
				['!g', '!google'],
			response:
				function (terms) {
					return "https://encrypted.google.com/search?hl=en&q=" + terms
				}
		},
		{
			patterns:
				['!gh', '!github'],
			response:
				function (terms) {
					return "https://github.com/search?q=" + terms +
						"&ref=cmdform"
				}
		},
		{
			patterns:
				['!gi', '!googleimages'],
			response:
				function (terms) {
					return "https://encrypted.google.com/search?tbm=isch&q=" + terms +
						"&tbs=imgo:1"
				}
		},
		{
			patterns:
				['!gs', '!googlescholar'],
			response:
				function (terms) {
					return "http://scholar.google.com/scholar?q=" + terms +
						"&btnG=Search&as_sdt=800000000001&as_sdtp=on"
				}
		},
		{
			patterns:
				['!kat', '!kickasstorrents'],
			response:
				function (terms) {
					return "http://kickass.to/usearch/" + terms + "/"
				}
		},
		{
			patterns:
				['!rt', '!rottentomatoes'],
			response:
				function (terms) {
					return "http://www.rottentomatoes.com/search/?search=" +
						terms + "&sitesearch=rt"
				}
		},
		{
			patterns:
				['!sl', '!sloane'],
			response:
				function (terms) {
					return "http://oeis.org/search?q=" + terms
				}
		},
		{
			patterns:
				['!so', '!stackoverflow'],
			response:
				function (terms) {
					return "http://stackoverflow.com/search?q=" + terms
				}
		},
		{
			patterns:
				['!tw', '!twitter'],
			response:
				function (terms) {
					return "https://twitter.com/search?q="+ terms
				}
		},
		{
			patterns:
				['!w', '!wikipedia'],
			response:
				function (terms) {
					return "https://en.wikipedia.org/wiki/" + terms
				}
		},
		{
			patterns:
				['!wa', '!wolframalpha'],
			response:
				function (terms) {
					return  "http://www.wolframalpha.com/input/?i=" + terms
				}
		},
		{
			patterns:
				['!yt', '!youtube'],
			response:
				function (terms) {
					return "https://www.youtube.com/results?search_query=" + terms +
						"&sm=3"
				}
		}
	]

	return {
		port: 8125,
		wordBoundary: '([ 	]+|$)',
		engines: engines
	}

} )()

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

		// build up a regular expression.

		var bangPattern = engine.
			patterns.
			map(function (pattern) {
				return pattern + consts.wordBoundary
			}).
			reduce(function (left, right) {
				return left + '|' + right
			})

		var bangRegExp = new RegExp(bangPattern, 'i')
		var containsBang = bangRegExp.test(terms)

		if (containsBang) {
			// redirect the query to the appropriate search engine.

			var terms = terms.
				replace(bangRegExp, '')

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
		const hasNoSearchTerms =
			redirected.terms.replace(/ /g, '').length === 0

		response.statusCode = 302

		if (hasNoSearchTerms) {
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
