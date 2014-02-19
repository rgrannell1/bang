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



var consts = ( function () {
	/*
		each search engine has a set of patterns that can be used
		as a case-insensitive regular expression for the search engine,
		and a function that takes the terms and returns the URL
		with the search term attatched.
	*/

	const makeEngine = function (patterns, response) {
		return { patterns: patterns, response: response }
	}

	const _engines = [
		makeEngine(['!se', '!sex'], function (terms) {

				return "http://stackexchange.com/search?q=" + terms

		}),
		makeEngine(
			['@', '!local', '!localhost'], function (terms) {

				return "http://127.0.0.1:" + terms

		}),
		makeEngine(
			['!', '!lucky'], function (terms) {

				return "https://encrypted.google.com/search?hl=en&btnI=I&q=" + terms

		}),
		makeEngine(
			['!am', '!amuk', '!amazon', '!amazonuk'], function (terms) {

				return "http://www.amazon.co.uk/s/ref=nb_sb_noss_2?" +
				"url=search-alias%3Daps&field-keywords=" + terms

		}),
		makeEngine(
			['!uex', '!askubuntu'], function (terms) {

				return 'http://askubuntu.com//search?q=' + terms

		}),
		makeEngine(
			['!bf', '!bookfinder'], function (terms) {

				return "http://www.bookfinder.com/search/?author=&title=" +
					terms +
					"&lang=en&submit=Begin+search&new_used=*&destination=ie" +
					"&currency=EU&mode=basic&st=sr&ac=qr"

		}),
		makeEngine(
			['!di', '!dic', '!dict', '!dictionary'], function (terms) {

				return "http://dictionary.reference.com/browse/" + terms + "?s=t"

		}),
		makeEngine(
			['!ddg', '!duckduckgo'], function (terms) {

				return "https://duckduckgo.com/?q=" + terms

		}),
		makeEngine(
			['!fb', '!facebook'], function (terms) {

				return "https://www.facebook.com/search/results.php?q=" + terms

		}),
		makeEngine(
			['!g', '!google'], function (terms) {

				return "https://encrypted.google.com/search?hl=en&q=" + terms

		}),
		makeEngine(
			['!gh', '!github'], function (terms) {

				return "https://github.com/search?q=" + terms + "&ref=cmdform"

		}),
		makeEngine(
			['!gi', 'images', '!googleimages'], function (terms) {

				return "https://encrypted.google.com/search?tbm=isch&q=" + terms + "&tbs=imgo:1"

		}),
		makeEngine(
			['!gs', 'scholar', '!googlescholar'], function (terms) {

				return "http://scholar.google.com/scholar?q=" + terms +
						"&btnG=Search&as_sdt=800000000001&as_sdtp=on"

		}),
		makeEngine(
			['!mex', '!mathexchange'], function (terms) {

				return 'http://math.stackexchange.com/search?q=' + terms

		}),
		makeEngine(
			['!oed', 'oxforddict','oxforddictionary'], function (terms) {

				return "http://www.oxforddictionaries.com/definition/english/" + terms + "?q=" + terms

		}),
		makeEngine(
			['!rot', '!rottentomatoes'], function (terms) {

				return "http://www.rottentomatoes.com/search/?search=" + terms + "&sitesearch=rt"

		}),
		makeEngine(
			['!sl', '!sloane'], function (terms) {

				return "http://oeis.org/search?q=" + terms

		}),
		makeEngine(
			['!so', '!sex', '!stackoverflow'], function (terms) {

				return "http://stackoverflow.com/search?q=" + terms

		}),
		makeEngine(
			['!th', '!thesaurus'], function (terms) {

				return "http://thesaurus.com/browse/" + terms

			}
		),
		makeEngine(
			['!tw', '!twitter'], function (terms) {

				return "https://twitter.com/search?q="+ terms

		}),
		makeEngine(
			['!w', '!wikipedia'], function (terms) {

				return "https://en.wikipedia.org/wiki/" + terms

		}),
		makeEngine(
			['!wa', '!wolframalpha'], function (terms) {

				return  "http://www.wolframalpha.com/input/?i=" + terms

		}),
		makeEngine(['!yt', '!youtube'], function (terms) {

			return "https://www.youtube.com/results?search_query=" + terms + "&sm=3"

		})
	]

	return {
		port: 8125,
		wordBoundary: '([ 	]+|$)',
		engines: _engines
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
