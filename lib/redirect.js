
const fs      = require('fs')
const url     = require('url')
const http    = require('http')
const path    = require('path')

const engines = require('./engines.js')





const redirect = function (searchTerms) {
	/*
		string -> string

		given the search terms and possibly
		a search engine bang operator return a
		url that queries that given engine,
		or default to google.

		From a bang query ("!w monkey") generate a proper query
		("wikipedia.org/?q=monkey") and the base url ("wikipedia.org")
	*/

	if (/!about/i.test(searchTerms)) {
		/*
			a special case, since it doesn't redirect to the base
			url if no search terms are given. Display a help page.
		*/

		const fpath = path.dirname(require.main.filename) + "/help.html"

		return {
			queryURL: fpath,
			hostname: fpath,
			terms:    ""
		}
	}

	return engines.engines
		.filter(function (engine) {
			return engine.regexp.test(searchTerms)
		})
		.map(function (engine) {

			const terms    = encodeURIComponent(searchTerms.replace(engine.regexp, ''))
			const queryURL = url.parse(engine.asQueryURL(terms), true)

			return {
				queryURL: queryURL.href,
				hostname: queryURL.protocol + '//' + queryURL.hostname + '/',
				terms:    terms
			}

		})
		.concat({
			queryURL: "https://encrypted.google.com/search?hl=en&q=" + searchTerms,
			hostname: "https://encrypted.google.com/",
			terms:    searchTerms
		})[0]

}






module.exports = {
	redirect: redirect
}
