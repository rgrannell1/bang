
"use strict"




var is             = require('is')
var URL            = require('url')

var constants      = require('./commons/constants')




var engineTools = { }





/*
	given a word, create a regexp that checks for that word
	surrounded by whitespace.
*/

engineTools.asPatternRegExp = word => {

	engineTools.asPatternRegExp.precond(word)

	var WORD_BOUNDARY = constants.regex.WORD_BOUNDARY
	var escapedWord   = word.split('').map(char => `[${char}]`).join('')

	return new RegExp(WORD_BOUNDARY + escapedWord + WORD_BOUNDARY, 'i')

}

engineTools.asPatternRegExp.precond = word => {

	is.always.string(word)

	var metacharacters = [']', '\\', '^', '-']

	word.split('').forEach(char => {

		var isMetacharacter = metacharacters.indexOf(char) !== -1

		if (isMetacharacter) {
			throw Error(`${char} in ${word} is a metacharacter and cannot currently be escaped.`)
		}

	})

}





/*
	given a query and patterns, remove all occurrences of that
	engine's patterns from the query.
*/

engineTools.extractSearchTerms = (rawQuery, patterns) => {

	engineTools.extractSearchTerms.precond(rawQuery, patterns)

	return patterns.reduce((query, pattern) => {
		return query.replace(engineTools.asPatternRegExp(pattern), '')
	}, rawQuery)

}

engineTools.extractSearchTerms.precond = (rawQuery, patterns) => {

	is.always.string(rawQuery)
	is.always.array(patterns)

}





/*
	given a query, check if it matches any pattern supplied
	(with an added word boundary).
*/

engineTools.testQueryMatch = (rawQuery, patterns) => {

	engineTools.testQueryMatch.precond(rawQuery, patterns)

	return patterns.some(pattern => {
		return engineTools.asPatternRegExp(pattern).test(rawQuery)
	})

}

engineTools.testQueryMatch.precond = (rawQuery, patterns) => {

	is.always.string(rawQuery)
	is.always.array(patterns)

}





/*
	find a default engine from the list of supplied engines.
*/

engineTools.defaultEngine = engines => {

	engineTools.defaultEngine.precond(engines)

	for (var ith = 0; ith < engines.length; ++ith) {

		if (engines[ith].isDefault) {
			return engines[ith]
		}

	}

	throw Error('could not find default search engine.')
}

engineTools.defaultEngine.precond = engines => {
	is.always.array(engines)
}






/*
	given a query and a list of engines, find the
	first matching engine object. Fallback to a default engine.
*/

engineTools.findMatchingEngine = (rawQuery, engines) => {

	engineTools.findMatchingEngine.precond(rawQuery)

	var matchingEngines = engines.filter(engine => {
		return engineTools.testQueryMatch(rawQuery, engine.patterns)
	})

	return matchingEngines.length > 0
		? matchingEngines[0]
		: engineTools.defaultEngine(engines)

}

engineTools.findMatchingEngine.precond = rawQuery => {
	is.always.string(rawQuery)
}





/*
	given the search terms supplied in a query, and an engine,
	return the redirected search URL.
*/

engineTools.searchTermsToUrl = (searchTerms, engine) => {

	engineTools.searchTermsToUrl.precond(searchTerms, engine)

	return searchTerms.length === 0
		? engine.baseUrl
		: URL.parse(engine.searchTemplate.replace(/{searchTerms}/g, searchTerms), true).href

}

engineTools.searchTermsToUrl.precond = (searchTerms, engine) => {

	is.always.string(searchTerms)
	is.always.object(engine)

}





/*
	given the search terms supplied in a query, and an engine,
	return the redirected suggest URL.
*/

engineTools.suggestTermsToUrl = (searchTerms, engine) => {

	engineTools.suggestTermsToUrl.precond(searchTerms, engine)

	engineTools.searchTermsToUrl.precond(searchTerms, engine)

	return searchTerms.length === 0
		? engine.baseUrl
		: URL.parse(engine.suggestTemplate.replace(/{searchTerms}/g, searchTerms), true).href

}

engineTools.suggestTermsToUrl.precond = (searchTerms, engine) => {

	is.always.string(searchTerms)
	is.always.object(engine)

}





module.exports = engineTools
