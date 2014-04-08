
const assert =
	require("assert")
const enginesFile =
	require('../lib/engines.js')
const rd =
	require('../lib/redirect.js')
const constants =
	require('../lib/constants.js')
const url =
	require('url')
const dns =
	require('dns')

is = {
	regExp:
		function (val) {
			return Object.prototype.toString.call(val) === "[object RegExp]"
		},
	array:
		function (val) {
			return Object.prototype.toString.call(val) === "[object Array]"
		},

}

;( function () {
	/*
		Are any of the bang-patterns repeated?
	*/

	const count = function (value, set) {
		var num = 0

		for (var ith = 0; ith < set.length; ith++) {
			if (set[ith] === value) {
				num += 1
			}
		}

		return num
	}

	const engines = enginesFile.engines

	var patternSet = []

	for (key in engines) {
		if (!engines.hasOwnProperty(key)) {
			continue
		}

		var engine = engines[key]
		patternSet = patternSet.concat(engine.patterns)

	}

	for (key in patternSet) {

		var pattern = patternSet[key]

		assert(
			count(pattern, patternSet) === 1,
			"duplicate bang pattern: " + pattern)

	}
} )()

;( function () {
	/*
		Check that every pattern begins with '!'.
	*/

	const engines = enginesFile.engines

	var patternSet = []

	for (key in engines) {
		if (!engines.hasOwnProperty(key)) {
			continue
		}

		var engine = engines[key]
		patternSet = patternSet.concat(engine.patterns)
	}

	for (key in patternSet) {

		var pattern = patternSet[key]

		assert(
			pattern.charAt(0) === "!" ||
			pattern === "@",
			"not prefixed with ! character : " + pattern)

	}

} )()

;( function () {
	/*
		Check if the pattern URs resolve. This test won't throw
		errors but will log any problems.
	*/

	const engines = enginesFile.engines

	engines.map(function (engine) {

		const siteUrl = engine.hostName
		dns.resolve4(siteUrl.replace('/', ''), function (err, addresses) {

			if (err) {
				console.log("note: couldn't resolve URL. This could be a problem with the url " + siteUrl)
			}
		})

	})

} )()

;( function () {
	/*
		Check that pattern substitution always works
	*/

	const randomTerms = function () {
		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'

		var string = ''

		for (var ith = 0; ith < Math.floor(Math.random() * chars.length); ith++) {
			var index = Math.floor(Math.random() * chars.length)
			string += chars.substring(index, index + 1)
		}

		return string
	}

	const randomEngine = function () {

		var patternPairs = []
		const engines = enginesFile.engines

		for (key in engines) {
			if (!engines.hasOwnProperty(key)) {
				continue
			}

			var engine = engines[key]
			var pattern = engine.patterns[Math.floor(Math.random() * engine.patterns.length)]

			patternPairs = patternPairs.concat( [{
				pattern: pattern,
				hostName: engine.hostName
			}] )
		}

		return patternPairs[Math.floor(Math.random() * patternPairs.length)]
	}

	const randomQuery = function () {

		const terms = randomTerms()
		var index = Math.floor(Math.random() * terms.length)
		const engine = randomEngine()

		if (index === 0) {
			var query = engine.pattern + " " + terms
		} else if (index === terms.length) {
			var query = terms + " " + engine.pattern
		} else {
			var query = terms.slice(0, index) + " " +
				engine.pattern + " " +
				terms.slice(index, terms.length)
		}

		return {
			pattern: engine.pattern,
			hostName: engine.hostName,
			terms: terms,
			query: query
		}
	}

	for (var ith = 0; ith < 100; ith++) {

		const testQuery = randomQuery()
		var testRedirect = rd.redirect(testQuery.query)

		assert(
			testQuery.terms === testRedirect.terms)
	}


})()

;( function () {
	/*
		check that the default port is always 8125.
	*/

	console.assert(constants.port === 8125)

} )()
