
const assert = require("assert")
const enginesFile = require('../lib/engines.js')

const isRegExp = function (rexp) {
	return Object.prototype.toString.call(rexp) === "[object RegExp]"
}

const engines = enginesFile.engines

for (key in engines) {
	if (!engines.hasOwnProperty(key)) {
		continue
	}

	var engine = engines[key]

	assert(
		isRegExp(engine.regexp),
		"non regular-expression regexpr field" +
		JSON.stringify(engine, null, 4))

}

