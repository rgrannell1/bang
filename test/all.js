
const assert =
	require("assert")
const enginesFile =
	require('../lib/engines.js')
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

	for (key in engines) {
		if (!engines.hasOwnProperty(key)) {
			continue
		}

		var engine = engines[key]

		var siteUrl = engine.hostName
		console.log(url.parse(siteUrl))

		dns.resolve4(siteUrl, function (err, addresses) {
			if (err) {
				console.log(err)
				console.log("couldn't resolve URL. This could be a problem with the url " + siteUrl)
			}
		})
	}

} )()
