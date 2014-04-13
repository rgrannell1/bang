
const fs =
	require('fs')

const url =
	require('url')

const http =
	require('http')

const engines =
	require('./engines.js')

const path =
	require('path')

const redirect = function (terms) {
	/*
		string -> string
		given the search terms and possibly
		a search engine bang operator return a
		url that queries that given engine,
		or default to google.
	*/

	for (var ith in engines.engines) {
		if (!engines.engines.hasOwnProperty(ith)) {
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

		var engine = engines.engines[ith]
		var queryContainsBang = engine.regexp.test(terms)

		if (queryContainsBang) {

			/*
				From a bang query ("!w monkey") generate a proper query
				("wikipedia.org/?q=monkey") and the base url ("wikipedia.org")
			*/

			var terms = encodeURIComponent(terms.replace(engine.regexp, ''))

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

module.exports = {
	redirect:
		redirect
}
