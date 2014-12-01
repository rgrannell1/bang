

const fs      = require('fs')
const is      = require('is')
const url     = require('url')
const http    = require('http')
const path    = require('path')

const utils   = require('./utils')
const engines = require('./engines.js')

const logger  = utils.logger





const findEngine = function (rawQuery) {

	return engines.engines
		.filter(function (engine) {
			return engine.regexp.test(rawQuery)
		})
		.concat(engines.fallback)[0]
}





/*
	string -> string

	given the search terms and possibly
	a search engine bang operator return a
	url that queries that given engine,
	or default to google.

	From a bang query ("!w monkey") generate a proper query
	("wikipedia.org/?q=monkey") and the base url ("wikipedia.org")
*/

const redirect = function (rawQuery) {

	if (!is.string(rawQuery)) {
		logger.error("redirect: rawQuery is not a string (type: " + is.what(rawQuery) + ")")
	}

	if (/!about/i.test(rawQuery)) {
		/*
			a special case, since it doesn't redirect to the base
			url if no search terms are given. Display a help page.
		*/

		const fpath = path.dirname(require.main.filename) + "/help.html"

		return {
			queryURL:    fpath,
			hostname:    fpath,
			searchTerms: ""
		}
	}

	const engine = findEngine(rawQuery)

	const searchTerms = engine.extractSearchTerms(rawQuery)
	const queryURL    = url.parse(engine.asQueryURL(searchTerms), true)

	return {
		queryURL:    queryURL.href,
		hostname:    queryURL.protocol + '//' + queryURL.hostname + '/',
		searchTerms: searchTerms
	}

}






module.exports = {
	redirect: redirect
}
