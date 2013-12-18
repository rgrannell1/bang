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

var url = require('url')
var http = require('http')

const consts = ( function () {

	const engines = {
		"!am": function (terms) {
			return "http://www.amazon.co.uk/s/ref=nb_sb_noss_2?" +
				"url=search-alias%3Daps&field-keywords=" + terms
		},
		"!fb": function (terms) {
			return "https://www.facebook.com/search/results.php?q=" + terms
		},
		"!g": function (terms) {
			return "https://encrypted.google.com/search?hl=en&q=" + terms
		},
		"!gh": function (terms) {
			return "https://github.com/search?q=" + terms +
				"&ref=cmdform"
		},
		"!gi": function (terms) {
			return "https://encrypted.google.com/search?tbm=isch&q=" + terms +
			"&tbs=imgo:1"
		},
		"!gs": function (terms) {
			return "http://scholar.google.com/scholar?q=" + terms +
				"&btnG=Search&as_sdt=800000000001&as_sdtp=on"
		},
		"!kat": function (terms) {
			return "http://kickass.to/usearch/" + terms + "/"
		},
		"!tw": function (terms) {
			return "https://twitter.com/search?q="+ terms
		},
		"!w": function (terms) {
			return "https://en.wikipedia.org/wiki/" + terms
		},
		"!wa": function (terms) {
			return "http://www.wolframalpha.com/input/?i=" + terms
		},
		"!yt": function (terms) {
			return "https://www.youtube.com/results?search_query=" + terms +
				"&sm=3"
		}
	}

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

	for (var bang in consts.engines) {
		if (!consts.engines.hasOwnProperty(bang)) {
			continue
		}

		var bangRegExp = new RegExp(
			bang +
			consts.wordBoundary +
			"|" +
			bang.toUpperCase() +
			consts.wordBoundary

		var bangRegExp = new RegExp(bangPattern)

		var containsBang = bangRegExp.test(terms)

		if (containsBang) {
			// redirect the query to the appropriate search engine.

			var terms = terms.
				replace(bangPattern, '').

			var redirector = consts.engines[bang]

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
			consts.engines['!g'](terms),
		baseURL:
			"https://encrypted.google.com/",
		terms:
			terms
	}
}





// ---------- http server ---------- //

http.createServer( function (request, response) {

	const terms = url.parse(request.url, true).query.q

	if (terms !== undefined) {

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
