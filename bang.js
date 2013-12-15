
/*
	Bang! JS
	A node server for redirecting queries to other search engines.
	Similar to duckduckgo's system for redirecting, but doesn't require
	relaying through their servers.
*/

var url = require('url')
var http = require('http')

var consts = {
	port: 8125,
	wordBoundary: '(\s|$)',
	engines: {
		"!w": function (searchTerm) {
			return "https://en.wikipedia.org/wiki/" + searchTerm
		},
		"!g": function (searchTerm) {
			return "https://encrypted.google.com/search?hl=en&q=" + searchTerm
		},
		"!tw": function (searchTerm) {
			return "https://twitter.com/search?q="+ searchTerm
		},
		"!gh": function (searchTerm) {
			return "https://github.com/search?q=" + searchTerm + "&ref=cmdform"
		}
	}
}

var redirect = function (searchTerms) {
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
		var isMatch = bangRegExp.test(searchTerms)

		if (isMatch) {

			var searchTerms = searchTerms.replace(bang, '')
			var redirecter = consts.engines[bang]

			return redirecter(searchTerms)
		}
	}

	var redirecter = consts.engines['!g']

	return redirecter(searchTerms)
}




http.createServer( function (request, response) {

	var searchTerms = url.parse(request.url, true).query.q

	if (searchTerms !== undefined) {

		var redirectURL = redirect(searchTerms)

		response.statusCode = 302
		response.setHeader('Location', redirectURL)
	}

	response.end('')

} ).
listen(consts.port)

console.log('bang! js server listening at http://127.0.0.1:' + consts.port + '/')
