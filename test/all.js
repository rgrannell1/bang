
const assert = require("assert")
const enginesFile = require('../lib/engines.js')


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
