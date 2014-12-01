

const fs      = require('fs')
const is      = require('is')
const url     = require('url')
const http    = require('http')
const path    = require('path')

const utils   = require('./utils')
const engines = require('./engines.js')

const logger  = utils.logger










/*
	findEngine :: string -> engine

	find a search engine matching a particular query, if any
	special flags are present (e.g !tw). Default to google.
*/

const findEngine = function (rawQuery) {

	return engines.engines
		.filter(function (engine) {
			return engine.regexp.test(rawQuery)
		})
		.concat(engines.fallback)[0]
}




/*
	asQueryURL :: string x engine -> url

	apply the user's search terms to their choice search engine's template string,
	and return the url object.
*/

const asQueryURL = function (searchTerms, engine) {
	return url.parse(engine.searchTemplate.replace(/{searchTerms}/g, searchTerms), true)
}





/*
	asSuggestionURL :: string x engine -> url
*/

const asSuggestionURL = function (searchTerms, engine) {
	return url.parse(engine.suggestTemplate.replace(/{searchTerms}/g, searchTerms), true)
}





/*
	extractSearchTerms :: string x engine -> url

	remove the engine flag from the raw search query, yielding
	just the terms the user wants to search for.
*/

const extractSearchTerms = function (rawQuery, engine) {
	return encodeURIComponent(rawQuery.replace(engine.regexp, ''))
}





/*
	redirectToHelp

	since help doesn't take search terms it needs special handling.
*/

const redirectToHelp = function () {

	const fpath = path.dirname(require.main.filename) + "/help.html"

	return {
		queryURL:    url.parse(fpath, true).href,
		hostname:    fpath,
		searchTerms: ""
	}

}









/*
	string -> string

	given the search terms and possibly
	a search engine bang operator, return a
	url that queries that given engine.
	default to google.

	From a bang query ("!w monkey") generate a proper query
	("wikipedia.org/?q=monkey") and the base url ("wikipedia.org")
*/

const redirect = function (rawQuery) {

	if (!is.string(rawQuery)) {
		logger.error("redirect: rawQuery is not a string (type: " + is.what(rawQuery) + ")")
	}





	if (/!about/i.test(rawQuery)) {

		return redirectToHelp()

	} else {

		const engine      = findEngine(rawQuery)

		const searchTerms = extractSearchTerms(rawQuery, engine)
		const queryURL    = asQueryURL(searchTerms, engine)

		return {
			queryURL:    queryURL.href,
			hostname:    queryURL.protocol + '//' + queryURL.hostname + '/',
			searchTerms: searchTerms
		}

	}

}






module.exports = {
	redirect: redirect
}
