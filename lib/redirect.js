
const fs      = require('fs')
const url     = require('url')
const http    = require('http')
const path    = require('path')

const engines = require('./engines.js')





const redirect = function (terms) {
	/*
		string -> string

		given the search terms and possibly
		a search engine bang operator return a
		url that queries that given engine,
		or default to google.

		From a bang query ("!w monkey") generate a proper query
		("wikipedia.org/?q=monkey") and the base url ("wikipedia.org")
	*/


	if (/!about/i.test(terms)) {
		/*
			a special case, since it doesn't redirect to the base
			url if no search terms are given. Display a help page.
		*/

		const fpath = path.dirname(require.main.filename) + "/help.html"

		return {
			expandedURL: fpath,
			hostname:    fpath,
			terms:      ""
		}
	}

	return engines.engines
		.filter(function (engine) {
			return engine.regexp.test(terms)
		})
		.map(function (engine) {

			const terms       = encodeURIComponent(terms.replace(engine.regexp, ''))
			const expandedURL = url.parse(engine.response(terms), true)

			return {
				expandedURL: expandedURL.href,
				hostname:    expandedURL.protocol + '//' + expandedURL.hostname + '/',
				terms:       terms
			}

		})
		.concat({
			expandedURL: "https://encrypted.google.com/search?hl=en&q=" + terms,
			hostname:    "https://encrypted.google.com/",
			terms:       terms
		})[0]

}

module.exports = {
	redirect: redirect
}
