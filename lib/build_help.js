
const engines = require('./engines.js')

const makeTags = function (normal, attr) {
	// create functions that create html tags.

	const tag = function (name) {
		/*
			create a tag function wraps content in a
			named tag.
		*/

		return function (content) {
			return "<" + name + ">" +
				content +
			"</" + name + ">"
		}
	}

	const attrTag = function (name) {
		/*
			create a tag function that creates attributes.
		*/

		return function (attr, content) {
			return "<" + name + " " + attr + ">" +
				content +
			"</" + name + ">"
		}
	}

	that = {}

	for (name in normal) {
		if (!normal.hasOwnProperty(name)) {
			continue
		}

		that[name] = tag(name)
	}

	for (name in attr) {
		if (!attr.hasOwnProperty(name)) {
			continue
		}

		that[name] = attrTag(name)
	}

	return that
}

const tags = makeTags(
	["html", "body", "ul", "li"],
	[""]
)

const pageText = ( function () {

	var listElements = ""
	var engines = engine.engines

	for (engine in engines) {
		if (!engines.hasOwnProperty(engine)) {
			continue
		}
	}





} )()
