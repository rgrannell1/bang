
/*
	Bang! JS
	A node server for redirecting queries to other search engines.
	Similar to duckduckgo's system for redirecting, but doesn't require
	relaying through their servers.
*/

var url = require('url')
var http = require('http')

var consts = {
	port: 8126,
	wordBoundary: '(\s|$)',
	engines: {
		"!w": function (searchTerm) {
			return "https://en.wikipedia.org/wiki/" + searchTerm
		},
		"!g": function (searchTerm) {
			return "https://encrypted.google.com/search?hl=en&q=" + searchTerm
		},
		"!gi": function (searchTerm) {
			return ""
		},
		"!tw": function (searchTerm) {
			return "https://twitter.com/search?q="+ searchTerm
		},
		"!gh": function (searchTerm) {
			return "https://github.com/search?q=" + searchTerm + "&ref=cmdform"
		}
	}
}

var redirect = function (terms) {
	/*
		string -> string
		given the search terms and possibly
		a search engine designator return a
		url that queries that given engine.
	*/

	for (bang in consts.engines) {
		if (!consts.engines.hasOwnProperty(bang)) {
			continue
		}

		var bangRegExp = new RegExp(bang + consts.wordBoundary)
		var containsBang = bangRegExp.test(terms)

		if (containsBang) {
			// redirect the query to the appropriate search engine.

			var terms = terms.replace(bang, '')
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

	// default to encrypyed google.

	return {
		fullURL:
			consts.engines['!gh'](terms),
		baseURL:
			"https://encrypted.google.com/"
	}
}







http.createServer( function (request, response) {

	var terms = url.parse(request.url, true).query.q

	if (terms !== undefined) {

		var redirected = redirect(terms)

		var hasNoSearchTerms =
			redirected.terms.replace(/ /g, '').length === 0

		response.statusCode = 302

		if (hasNoSearchTerms) {

			response.setHeader(
				'Location', redirected.baseURL)

		} else {
			response.setHeader(
				'Location', redirected.fullURL)
		}
	}

	response.end('')

} ).
listen(consts.port)

console.log('bang! js server listening at http://127.0.0.1:' + consts.port + '/')
