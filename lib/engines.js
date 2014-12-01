
// engines.js
// ==========

const fs     = require('fs')
const is     = require('is')
const url    = require('url')

const utils  = require('./utils.js')
const logger = utils.logger





/*
	joinPatterns :: [string] -> regex

	collapse each pattern that can be used to request an
	engine into a single regular expression.
*/

const joinPatterns = function (patterns) {

	const wordBoundary   = '([ 	]+|$|^)'

	const literalPattern =  patterns
		.map(function (pattern) {

			return [wordBoundary]
				.concat(
					pattern.split('').map(function (char) {
					    return '[' + char + ']'
					}) )
				.concat(wordBoundary)
				.join('')

		})
		.join('|')

	return new RegExp(literalPattern, 'i')

}





/*
	Engine :: [string] x string x string -> {
		regexp:          regex,
		patterns:        [string],
		hostname:        string
	}

	Constructor for search engines. Given patterns for a search engine
	(e.g !google, !g), a template string for querying that engine
	with search terms, and a template string for getting search suggestions
	from that engine, returns an engine object.

*/

const Engine = function (patterns, searchTemplate, suggestTemplate) {

	if (!is.array(patterns)) {
		logger.error("Engine: patterns was not an array.")
	} else {
		patterns.forEach(function (pattern) {
			if (!is.string(pattern)) {
				logger.error("Engine: pattern was not a string.")
			}
		})
	}

	if (!is.string(searchTemplate)) {
		logger.error("Engine: searchTemplate was not a string.")
	}

	if (!is.string(suggestTemplate)) {
		logger.error("Engine: suggestTemplate was not a string.")
	}





	return {
		regexp:          joinPatterns(patterns),

		suggestTemplate: suggestTemplate,
		searchTemplate:  searchTemplate,

		patterns:        patterns,
		hostname:        url.parse(searchTemplate, true).hostname + '/'
	}

}





const google = Engine(
	['!g', '!google'],
	"https://encrypted.google.com/search?hl=en&q={searchTerms}",
	"https://suggestqueries.google.com/complete/search?client=firefox&q={searchTerms}"
)




const engines = [

	Engine(
		['!about'],
		__dirname + "/help.html",
		""
	),

	Engine(
		['!se', '!stackexchange'],
		"http://stackexchange.com/search?q={searchTerms}",
		""
	),

	Engine(
		['@', '!local', '!localhost'],
		"http://localhost:{searchTerms}",
		""
	),

	Engine(
		['!', '!lucky'],
		"https://encrypted.google.com/search?hl=en&btnI=I&q={searchTerms}",
		""
	),

	Engine(
		['!am', '!amuk', '!amazon', '!amazonuk'],
		"http://www.amazon.co.uk/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={searchTerms}",
		"http://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q={searchTerms}"),

	Engine(
		['!amus', '!amusa', '!amazonusa'],
		"http://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={searchTerms}",
		""
	),

	Engine(
		['!amca', '!amazonca', '!amazoncanada'],
		"http://www.amazon.ca/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={searchTerms}",
		""
	),

	Engine(
		['!amde', '!amazonde', '!amazondeutsch', '!amazongermany'],
		"http://www.amazon.de/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={searchTerms}",
		""
	),

	Engine(
		['!anti', '!antonym', '!opposite'],
		"http://www.synonym.com/antonyms/{searchTerms}/",
		""
	),

	Engine(
		['!uex', '!askubuntu', '!stackubuntu'],
		"http://askubuntu.com/search?q={searchTerms}",
		""
	),

	Engine(
		['!bf', '!bookfinder'],
		"http://www.bookfinder.com/search/?author=&title={searchTerms}" +
		"&lang=en&submit=Begin+search&new_used=*&destination=ie" +
		"&currency=EU&mode=basic&st=sr&ac=qr",
		""
	),

	Engine(
		['!ch', '!colorhexa', '!colourhexa', '!colour', '!color'],
		"http://www.colorhexa.com/{searchTerms}",
		""
	),

	Engine(
		['!di', '!dic', '!dict', '!dictionary'],
		"http://dictionary.reference.com/browse/{searchTerms}?s=t",
		""
	),

	Engine(
		['!ddg', '!duckduckgo'],
		"https://duckduckgo.com/?q={searchTerms}",
		""
	),

	Engine(
		["!osrc", "!opensourcereportcard"],
		"http://osrc.dfm.io/{searchTerms}",
		""
	),

	Engine(
		['!fb', '!facebook'],
		"https://www.facebook.com/search/results.php?q={searchTerms}",
		""
	),

	google,

	Engine(
		['!gm', '!gmail'],
		"https://mail.google.com/mail/u/0/?pli=1#search/{searchTerms}",
		""
	),

	Engine(
		['!gn', '!googlenews'],
		"https://news.google.com/news/search?q={searchTerms}&btnG=Search+News",
		""
	),

	Engine(
		['!gh', '!github'],
		"https://github.com/search?q={searchTerms}&ref=cmdform",
		""
	),

	Engine(
		['!gi', '!images', '!googleimages'],
		"https://encrypted.google.com/search?tbm=isch&q={searchTerms}&tbs=imgo:1",
		""
	),

	Engine(
		['!gs', '!scholar', '!googlescholar'],
		"http://scholar.google.com/scholar?q={searchTerms}&btnG=Search&as_sdt=800000000001&as_sdtp=on",
		""
	),

	Engine(
		['!mex', '!stackmath'],
		'http://math.stackexchange.com/search?q={searchTerms}',
		""
	),

	Engine(
		['!ch9', '!channel9'],
		'http://channel9.msdn.com/search?term={searchTerms}',
		""
	),

	Engine(
		['!oed', '!oxforddict','!oxforddictionary'],
		"http://www.oxforddictionaries.com/definition/english/{searchTerms}?q={searchTerms}",
		""
	),

	Engine(
		['!pkt', '!pocket'],
		"http://getpocket.com/a/queue/grid/{searchTerms}/",
		""
	),

	Engine(
		['!rd', '!rdoc', '!rdocs', '!rdocumentation'],
		"http://www.rdocumentation.org/advanced_search?utf8=%E2%9C%93&q={searchTerms}&package_name=&function_name=&title=&description=&author=",
		""
	),

	Engine(
		['!r', '!reddit'],
		"http://www.reddit.com/search?q={searchTerms}",
		""
	),

	Engine(
		['!rot', '!rottentomatoes'],
		"http://www.rottentomatoes.com/search/?search={searchTerms}&sitesearch=rt",
		""
	),

	Engine(
		['!sl', '!sloane'],
		"http://oeis.org/search?q={searchTerms}",
		""
	),

	Engine(
		['!so', '!stackoverflow'],
		"http://stackoverflow.com/search?q={searchTerms}",
		""
	),

	Engine(
		['!th', '!thesaurus'],
		"http://thesaurus.com/browse/{searchTerms}",
		""
	),

	Engine(
		['!tw', '!twitter'],
		"https://twitter.com/search?q={searchTerms}",
		""
	),

	Engine(
		['!w', '!wikipedia'],
		"https://en.wikipedia.org/wiki/{searchTerms}",
		"http://en.wikipedia.org/w/api.php?action=opensearch&search={searchTerms}"),

	Engine(
		['!wa', '!wolframalpha'],
		 "http://www.wolframalpha.com/input/?i={searchTerms}",
		 ""
		),

	Engine(
		['!yt', '!youtube'],
		"https://www.youtube.com/results?search_query={searchTerms}&sm=3",
		""
	)
]





module.exports = {
	engines:  engines,
	fallback: google
}
