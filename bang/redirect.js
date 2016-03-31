
"use strict"





var is             = require('is')
var logger         = require('../logging/logger')

var engineTools    = require('../engine-tools')
var enginePatterns = require('../data/engines.json')
var Engine         = require('../model/engine')





var redirect = {
	search:  { },
	suggest: { }
}

var engines = enginePatterns.map(Engine)





redirect.suggest.toSuggestEngine = (config, rawQuery) => {

	redirect.suggest.toSuggestEngine.precond(config, rawQuery)

	var matchingEngine = engineTools.findMatchingEngine(rawQuery, engines)
	var searchTerms    = engineTools.extractSearchTerms(rawQuery, matchingEngine.patterns)
	var lookupUrl      = engineTools.suggestTermsToUrl(searchTerms, matchingEngine)

	if (config.trace) {

		logger.info({

			rawQuery,
			searchTerms,
			lookupUrl

		}, 'suggestion.')

	}

	return lookupUrl

}

redirect.suggest.toSuggestEngine.precond = (config, rawQuery) => {

	is.always.object(config)
	is.always.string(rawQuery)

}




redirect.search.toSearchEngine = (config, rawQuery, res) => {

	redirect.search.toSearchEngine.precond(config, rawQuery, res)

	var matchingEngine = engineTools.findMatchingEngine(rawQuery, engines)
	var searchTerms    = engineTools.extractSearchTerms(rawQuery, matchingEngine.patterns)
	var redirectUrl    = engineTools.searchTermsToUrl(searchTerms, matchingEngine)

	if (config.trace) {

		logger.info({

			rawQuery,
			searchTerms,
			redirectUrl

		}, 'request redirected.')

	}

	return redirectUrl

}

redirect.search.toSearchEngine.precond = (config, rawQuery) => {

	is.always.object(config)
	is.always.string(rawQuery)

}






redirect.search.toHelpFile = (config, rawQuery) => {

	redirect.search.toHelpFile.precond(config, rawQuery)

	var redirectUrl = 'about'

	if (config.trace) {
		logger.info({rawQuery, redirectUrl}, 'request redirected.')
	}

	return redirectUrl

}

redirect.search.toHelpFile.precond = (config, rawQuery) => {

	is.always.object(config)
	is.always.string(rawQuery)

}




module.exports = redirect
