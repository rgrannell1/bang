
// engines.js
// ==========

const fs  = require('fs')
const url = require('url')






const makeEngine = function (patterns, queryForm) {
	/*
		take the bang patterns, join them into one regular
		expression, and return a regexp : callback pair.
	*/

	const wordBoundary = '([ 	]+|$|^)'

	const patternText =
		patterns.
		map(function (pattern) {

			var escapedPattern = ''

			for (var ith = 0; ith < pattern.length; ith++) {
				escapedPattern += '[' + pattern.charAt(ith) + ']'
			}

			return wordBoundary + escapedPattern + wordBoundary
		}).
		reduce(function (pattern_1, pattern_2) {
			return pattern_1 + '|' + pattern_2
		})

	const patternRegExp = new RegExp(patternText, 'i')

	const asResponse = function (queryForm) {
		// convert the query template to a function that
		// takes query terms and returns a formatted query

		return function (terms) {
			return queryForm.replace(/{searchTerms}/g, terms)
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
		['!se', '!stackexchange'],
		"http://stackexchange.com/search?q={searchTerms}"),

	makeEngine(
		['@', '!local', '!localhost'],
		"http://localhost:{searchTerms}"),

	makeEngine(
		['!', '!lucky'],
		"https://encrypted.google.com/search?hl=en&btnI=I&q={searchTerms}"),

	makeEngine(
		['!am', '!amuk', '!amazon', '!amazonuk'],
		"http://www.amazon.co.uk/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={searchTerms}"),

	makeEngine(
		['!amus', '!amusa', '!amazonusa'],
		"http://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={searchTerms}"),

	makeEngine(
		['!amca', '!amazonca', '!amazoncanada'],
		"http://www.amazon.ca/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={searchTerms}"),

	makeEngine(
		['!amde', '!amazonde', '!amazondeutsch', '!amazongermany'],
		"http://www.amazon.de/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={searchTerms}"),

	makeEngine(
		['!anti', '!antonym', '!opposite'],
		"http://www.synonym.com/antonyms/{searchTerms}/"),

	makeEngine(
		['!uex', '!askubuntu', '!stackubuntu'],
		"http://askubuntu.com/search?q={searchTerms}"),

	makeEngine(
		['!bf', '!bookfinder'],
		"http://www.bookfinder.com/search/?author=&title={searchTerms}" +
		"&lang=en&submit=Begin+search&new_used=*&destination=ie" +
		"&currency=EU&mode=basic&st=sr&ac=qr"),

	makeEngine(
		['!ch', '!colorhexa', '!colourhexa', '!colour', '!color'],
		"http://www.colorhexa.com/{searchTerms}"),

	makeEngine(
		['!di', '!dic', '!dict', '!dictionary'],
		"http://dictionary.reference.com/browse/{searchTerms}?s=t"),

	makeEngine(
		['!ddg', '!duckduckgo'],
		"https://duckduckgo.com/?q={searchTerms}"),

	makeEngine(
		["!osrc", "!opensourcereportcard"],
		"http://osrc.dfm.io/{searchTerms}"),

	makeEngine(
		['!fb', '!facebook'],
		"https://www.facebook.com/search/results.php?q={searchTerms}"),

	makeEngine(
		['!g', '!google'],
		"https://encrypted.google.com/search?hl=en&q={searchTerms}"),

	makeEngine(
		['!gm', '!gmail'],
		"https://mail.google.com/mail/u/0/?pli=1#search/{searchTerms}"
	),

	makeEngine(
		['!gn', '!googlenews'],
		"https://news.google.com/news/search?q={searchTerms}&btnG=Search+News"
	),

	makeEngine(
		['!gh', '!github'],
		"https://github.com/search?q={searchTerms}&ref=cmdform"),

	makeEngine(
		['!gi', '!images', '!googleimages'],
		"https://encrypted.google.com/search?tbm=isch&q={searchTerms}&tbs=imgo:1"),

	makeEngine(
		['!gs', '!scholar', '!googlescholar'],
		"http://scholar.google.com/scholar?q={searchTerms}&btnG=Search&as_sdt=800000000001&as_sdtp=on"),

	makeEngine(
		['!mex', '!stackmath'],
		'http://math.stackexchange.com/search?q={searchTerms}'),

	makeEngine(
		['!ch9', '!channel9'],
		'http://channel9.msdn.com/search?term={searchTerms}'
		),

	makeEngine(
		['!oed', '!oxforddict','!oxforddictionary'],
		"http://www.oxforddictionaries.com/definition/english/{searchTerms}?q={searchTerms}"),

	makeEngine(
		['!pkt', '!pocket'],
		"http://getpocket.com/a/queue/grid/{searchTerms}/"),

	makeEngine(
		['!rd', '!rdoc', '!rdocs', '!rdocumentation'],
		"http://www.rdocumentation.org/advanced_search?utf8=%E2%9C%93&q={searchTerms}&package_name=&function_name=&title=&description=&author="
	),

	makeEngine(
		['!r', '!reddit'],
		"http://www.reddit.com/search?q={searchTerms}"),

	makeEngine(
		['!rot', '!rottentomatoes'],
		"http://www.rottentomatoes.com/search/?search={searchTerms}&sitesearch=rt"),

	makeEngine(
		['!sl', '!sloane'],
		"http://oeis.org/search?q={searchTerms}"),

	makeEngine(
		['!so', '!stackoverflow'],
		"http://stackoverflow.com/search?q={searchTerms}"),

	makeEngine(
		['!th', '!thesaurus'],
		"http://thesaurus.com/browse/{searchTerms}"),

	makeEngine(
		['!tw', '!twitter'],
		"https://twitter.com/search?q={searchTerms}"),

	makeEngine(
		['!w', '!wikipedia'],
		"https://en.wikipedia.org/wiki/{searchTerms}"),

	makeEngine(
		['!wa', '!wolframalpha'],
		 "http://www.wolframalpha.com/input/?i={searchTerms}"),

	makeEngine(['!yt', '!youtube'],
		"https://www.youtube.com/results?search_query={searchTerms}&sm=3")
]





module.exports = {
	engines:
		engines
}
