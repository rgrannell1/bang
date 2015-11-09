#!/usr/bin/env node

"use strict"





const is      = require('is')
const url     = require('url')

const utils   = require('./utils')
const engines = require('./engines.js')





/*
	findEngine :: string -> engine

	find a search engine matching a particular query, if any
	special flags are present (e.g !tw). Default to google.
*/

const findEngine = rawQuery => {

	return engines.engines
		.filter(engine => {
			return engine.regexp.test(rawQuery)
		})
		.concat(engines.fallback)[0]
}




/*
	asQueryURL :: string x engine -> url

	apply the user's search terms to their choice search engine's template string,
	and return the url object.
*/

const asQueryURL = (searchTerms, engine) => {
	return url.parse(engine.searchTemplate.replace(/{searchTerms}/g, searchTerms), true)
}





/*
	asSuggestionURL :: string x engine -> url
*/

const asSuggestionURL = (searchTerms, engine) => {
	return url.parse(engine.suggestTemplate.replace(/{searchTerms}/g, searchTerms), true)
}





/*
	extractSearchTerms :: string x engine -> url

	remove the engine flag from the raw search query, yielding
	just the terms the user wants to search for.
*/

const extractSearchTerms = (rawQuery, engine) => {
	return encodeURIComponent(rawQuery.replace(engine.regexp, ''))
}





/*
	extractBangPattern :: string x engine -> url

	keep the search engine flag entered by the user.
*/

const extractBangPattern = (rawQuery, engine) => {
	return encodeURIComponent(
		rawQuery
		.replace(
			rawQuery.replace(engine.regexp, ''), '')
		.trim( ))
}






/*
	redirectToHelp

	since help doesn't take search terms it needs special handling.
*/

const redirectToHelp = ( ) => {

	const fpath = __dirname + "/help.html"

	return {
		queryURL:    url.parse(fpath, true).href,
		baseURL:     fpath,
		searchTerms: "",
		bangPattern: "!about"
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

const redirect = rawQuery => {

	redirect.precond(rawQuery)

	if (/!about/i.test(rawQuery)) {

		return redirectToHelp( )

	} else {

		const engine        = findEngine(rawQuery)
		const searchTerms   = extractSearchTerms(rawQuery, engine)

		const queryURL      = asQueryURL(searchTerms, engine)
		const suggestionURL = asSuggestionURL(searchTerms, engine)

		return {
			queryURL:      queryURL.href,
			suggestionURL: suggestionURL.href,

			baseURL:       engine.baseURL,
			searchTerms:   searchTerms,

			rawQuery:      rawQuery,
			bangPattern:   extractBangPattern(rawQuery, engine)
		}

	}

}

redirect.precond = rawQuery => {

	is.always.string(rawQuery)

}




module.exports = {
	findEngine: findEngine,
	redirect:   redirect
}
