
/*
	Bang! JS
	A node server for redirecting queries to other search engines.
	Similar to duckduckgo's system for redirecting, but doesn't require
	relaying through their servers.
*/

var url = require('url')
var http = require('http')


var consts = ( function () {

	var engines = {
		"!w": function (terms) {
			return "https://en.wikipedia.org/wiki/" + terms
		},
		"!g": function (terms) {
			return "https://encrypted.google.com/search?hl=en&q=" + terms
		},
		"!gi": function (terms) {
			return "https://encrypted.google.com/search?tbm=isch&q=" + terms +
			"&tbs=imgo:1"
		},
		"!tw": function (terms) {
			return "https://twitter.com/search?q="+ terms
		},
		"!gh": function (terms) {
			return "https://github.com/search?q=" + terms +
				"&ref=cmdform"
		},
		"!yt": function (terms) {
			return "https://www.youtube.com/results?search_query=" + terms +
				"&sm=3"
		},
		"!am": function (terms) {
			return "http://www.amazon.co.uk/s/ref=nb_sb_noss_2?" +
				"url=search-alias%3Daps&field-keywords=" + terms
		},
		"!gs": function (terms) {
			return "http://scholar.google.com/scholar?q=" + terms +
				"&btnG=Search&as_sdt=800000000001&as_sdtp=on"
		},
		"!kat": function (terms) {
			return "http://kickass.to/usearch/" + terms + "/"
		},
		"!fb": function (terms) {
			return "https://www.facebook.com/search/results.php?q=" + terms
		}



	}

	return {
		port: 8125,
		wordBoundary: '(\s|$)',
		engines: engines
	}

} )()


var exclaim = {
	startup: function (port) {

		console.log(
			'bang! js server listening at http://127.0.0.1:' + port + '/')
	}
}

var redirect = function (terms) {
	/*
		string -> string
		given the search terms and possibly
		a search engine bang operator return a
		url that queries that given engine,
		or default to google.
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

	var terms = url.parse(request.url, true).query.q

	if (terms !== undefined) {

		var redirected = redirect(terms)

		var hasNoSearchTerms =
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
