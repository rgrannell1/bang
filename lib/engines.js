// engines.js
// ==========

const fs = require('fs')
const url = require('url')
const path = require('path')

const writeJSON = function (outFile, obj) {

	const stringified = "var helpData = " + JSON.stringify(obj, null, 4)

	fs.writeFile(outFile, stringified, function (err) {

		if (err) {
			console.log(err)
		} else {

		}

	})
}

const makeEngine = function (patterns, queryForm) {
	/*
		take the bang patterns, join them into one regular
		expression, and return a regexp : callback pair.
	*/

	const wordBoundary = '([ 	]+|$)'

	const patternText =
		patterns.
		map(function (pattern) {
			return pattern + wordBoundary
		}).
		reduce(function (pattern_1, pattern_2) {
			return pattern_1 + '|' + pattern_2
		})

	const patternRegExp = new RegExp(patternText, 'i')

	const asResponse = function (queryForm) {
		// convert the query template to a function that
		// takes query terms and returns a formatted query

		return function (terms) {
			return queryForm.
            replace(/{{ TERMS }}/g, terms)
		}
	}

	var hostName =
		url.parse(queryForm, true).hostname + '/'

	return {
		regexp:
			patternRegExp,
		response:
			asResponse(queryForm),
		patterns:
			patterns,
		hostName:
			hostName
	}
}

const engines = [

	makeEngine(
		['!about'],
		__dirname + "/help.html"
	),

	makeEngine(
		['!se', '!sex'],
		"http://stackexchange.com/search?q={{ TERMS }}"),

	makeEngine(
		['@', '!local', '!localhost'],
		"http://localhost:{{ TERMS }}"),

	makeEngine(
		['!', '!lucky'],
		"https://encrypted.google.com/search?hl=en&btnI=I&q={{ TERMS }}"),

	makeEngine(
		['!am', '!amuk', '!amazon', '!amazonuk'],
		"http://www.amazon.co.uk/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={{ TERMS }}"),

	makeEngine(
		['!uex', '!askubuntu'],
		"http://askubuntu.com//search?q={{ TERMS }}"),

	makeEngine(
		['!bf', '!bookfinder'],
		"http://www.bookfinder.com/search/?author=&title={{ TERMS }}" +
		"&lang=en&submit=Begin+search&new_used=*&destination=ie" +
		"&currency=EU&mode=basic&st=sr&ac=qr"),

	makeEngine(
		['!di', '!dic', '!dict', '!dictionary'],
		"http://dictionary.reference.com/browse/{{ TERMS }}?s=t"),

	makeEngine(
		['!ddg', '!duckduckgo'],
		"https://duckduckgo.com/?q={{ TERMS }}"),

	makeEngine(
		['!fb', '!facebook'],
		"https://www.facebook.com/search/results.php?q={{ TERMS }}"),

	makeEngine(
		['!g', '!google'],
		"https://encrypted.google.com/search?hl=en&q={{ TERMS }}"),

	makeEngine(
		['!gm', '!gmail'],
		"https://mail.google.com/mail/u/0/?pli=1#search/{{ TERM }}"
	),

	makeEngine(
		['!gh', '!github'],
		"https://github.com/search?q={{ TERMS }}&ref=cmdform"),

	makeEngine(
		['!gi', '!images', '!googleimages'],
		"https://encrypted.google.com/search?tbm=isch&q={{ TERMS }}&tbs=imgo:1"),

	makeEngine(
		['!gs', '!scholar', '!googlescholar'],
		"http://scholar.google.com/scholar?q={{ TERMS }}&btnG=Search&as_sdt=800000000001&as_sdtp=on"),

	makeEngine(
		['!mex', '!mathexchange'],
		'http://math.stackexchange.com/search?q={{ TERMS }}'),

	makeEngine(
		['!oed', '!oxforddict','!oxforddictionary'],
		"http://www.oxforddictionaries.com/definition/english/{{ TERMS }}?q={{ TERMS }}"),

	makeEngine(
		['!rot', '!rottentomatoes'],
		"http://www.rottentomatoes.com/search/?search={{ TERMS }}&sitesearch=rt"),

	makeEngine(
		['!sl', '!sloane'],
		"http://oeis.org/search?q={{ TERMS }}"),

	makeEngine(
		['!so', '!stackoverflow'],
		"http://stackoverflow.com/search?q={{ TERMS }}"),

	makeEngine(
		['!th', '!thesaurus'],
		"http://thesaurus.com/browse/{{ TERMS }}"),

	makeEngine(
		['!tw', '!twitter'],
		"https://twitter.com/search?q={{ TERMS }}"),

	makeEngine(
		['!w', '!wikipedia'],
		"https://en.wikipedia.org/wiki/{{ TERMS }}"),

	makeEngine(
		['!wa', '!wolframalpha'],
		 "http://www.wolframalpha.com/input/?i={{ TERMS }}"),

	makeEngine(['!yt', '!youtube'],
		"https://www.youtube.com/results?search_query={{ TERMS }}&sm=3")
]

/*
	write the engine data to a json file for
	the help files sake.
*/



writeJSON(
	path.join(__dirname, "help-data.js"),
	engines.map(function (engine) {

		return {
			patterns:
				engine.patterns,
			hostName:
				engine.hostName
		}

	}) )









module.exports = {
	engines:
		engines
}
