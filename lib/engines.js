
// engines.js
// ==========

const is     = require('is')
const url    = require('url')

const utils  = require('./utils')

const logger = utils.logger





/*
	Engine :: [string] x string x string -> {
		regexp:          regex,
		patterns:        [string],
		baseURL:         string
	}

	Constructor for search engines. Given patterns for a search engine
	(e.g !google, !g), a template string for querying that engine
	with search terms, and a template string for getting search suggestions
	from that engine, returns an engine object.

*/

const Engine = ( function () {

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






	return function (engine) {

		if (!is.array(engine.patterns)) {
			logger.error("Engine: patterns was not an array.")
		} else {
			engine.patterns.forEach(function (pattern) {
				if (!is.string(pattern)) {
					logger.error("Engine: pattern was not a string.")
				}
			})
		}

		if (!is.string(engine.searchTemplate)) {
			logger.error("Engine: searchTemplate was not a string.")
		}

		if (!is.undefined(engine.baseURL) && !is.string(engine.baseURL)) {
			logger.error("Engine: baseURL was not a string.")
		}

		if (!is.string(engine.suggestTemplate)) {
			logger.error("Engine: suggestTemplate was not a string.")
		}

		var parsedTemplate = url.parse(engine.searchTemplate, true)

		return {
			regexp:          joinPatterns(engine.patterns),

			suggestTemplate: engine.suggestTemplate,
			searchTemplate:  engine.searchTemplate,

			baseURL:         engine.baseURL
				? engine.baseURL
				: parsedTemplate.protocol + '//' + parsedTemplate.hostname + '/',

			patterns:        engine.patterns
		}

	}

} )()











const google = Engine({
	patterns:        ['!g', '!google'],
	searchTemplate:  "https://encrypted.google.com/search?hl=en&q={searchTerms}",
	baseURL:         "",
	suggestTemplate: "https://suggestqueries.google.com/complete/search?client=firefox&q={searchTerms}"
})

const engines = ( function () {

	/*
		The actual search engines
	*/


	return [

		Engine({
			patterns:        ['!about'],
			searchTemplate:  __dirname + "/help.html",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!se', '!stackexchange'],
			searchTemplate:  "http://stackexchange.com/search?q={searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['@', '!local', '!localhost'],
			searchTemplate:  "http://localhost:{searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!', '!lucky'],
			searchTemplate:  "https://encrypted.google.com/search?hl=en&btnI=I&q={searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!am', '!amuk', '!amazon', '!amazonuk'],
			searchTemplate:  "http://www.amazon.co.uk/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={searchTerms}",
			suggestTemplate: "http://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q={searchTerms}"
		}),
		Engine({
			patterns:        ['!amus', '!amusa', '!amazonusa'],
			searchTemplate:  "http://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!amca', '!amazonca', '!amazoncanada'],
			searchTemplate:  "http://www.amazon.ca/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!amde', '!amazonde', '!amazondeutsch', '!amazongermany'],
			searchTemplate:  "http://www.amazon.de/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!anti', '!antonym', '!opposite'],
			searchTemplate:  "http://www.synonym.com/antonyms/{searchTerms}/",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!uex', '!askubuntu', '!stackubuntu'],
			searchTemplate:  "http://askubuntu.com/search?q={searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!bf', '!bookfinder'],
			searchTemplate:  "http://www.bookfinder.com/search/?author=&title={searchTerms}" +
				"&lang=en&submit=Begin+search&new_used=*&destination=ie" + "&currency=EU&mode=basic&st=sr&ac=qr",
			suggestTemplate: "",
		}),

		Engine({
			patterns:        ['!cl', '!calendar'],
			searchTemplate:  "https://www.google.com/calendar/render?q={searchTerms}",
			baseURL:         "https://www.google.com/calendar",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!ch', '!colorhexa', '!colourhexa', '!colour', '!color'],
			searchTemplate:  "http://www.colorhexa.com/{searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!di', '!dic', '!dict', '!dictionary'],
			searchTemplate:  "http://dictionary.reference.com/browse/{searchTerms}?s=t",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!ddg', '!duckduckgo'],
			searchTemplate:  "https://duckduckgo.com/?q={searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ["!osrc", "!opensourcereportcard"],
			searchTemplate:  "http://osrc.dfm.io/{searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!fb', '!facebook'],
			searchTemplate:  "https://www.facebook.com/search/results.php?q={searchTerms}",
			suggestTemplate: ""
		}),

		google,

		Engine({
			patterns:        ['!gm', '!gmail'],
			searchTemplate:  "https://mail.google.com/mail/u/0/?pli=1#search/{searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!gn', '!googlenews'],
			searchTemplate:  "https://news.google.com/news/search?q={searchTerms}&btnG=Search+News",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!gh', '!github'],
			searchTemplate:  "https://github.com/search?q={searchTerms}&ref=cmdform",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!gi', '!images', '!googleimages'],
			searchTemplate:  "https://encrypted.google.com/search?tbm=isch&q={searchTerms}&tbs=imgo:1",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!gs', '!scholar', '!googlescholar'],
			searchTemplate:  "http://scholar.google.com/scholar?q={searchTerms}&btnG=Search&as_sdt=800000000001&as_sdtp=on",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!in', '!inbox', '!googleinbox'],
			searchTemplate:  "https://inbox.google.com/search/{searchTerms}?cid=imp",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!kp', '!keep', '!googlekeep'],
			searchTemplate:  "https://keep.google.com/#search/text={searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!mex', '!stackmath'],
			searchTemplate:  'http://math.stackexchange.com/search?q={searchTerms}',
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!ch9', '!channel9'],
			searchTemplate:  'http://channel9.msdn.com/search?term={searchTerms}',
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!oed', '!oxforddict','!oxforddictionary'],
			searchTemplate:  "http://www.oxforddictionaries.com/definition/english/{searchTerms}?q={searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!pkt', '!pocket'],
			searchTemplate:  "http://getpocket.com/a/queue/grid/{searchTerms}/",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!rd', '!rdoc', '!rdocs', '!rdocumentation'],
			searchTemplate:  "http://www.rdocumentation.org/advanced_search?utf8=%E2%9C%93&q={searchTerms}&package_name=&function_name=&title=&description=&author=",
			suggestTemplate: "",
		}),

		Engine({
			patterns:        ['!r', '!reddit'],
			searchTemplate:  "http://www.reddit.com/search?q={searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!rot', '!rottentomatoes'],
			searchTemplate:  "http://www.rottentomatoes.com/search/?search={searchTerms}&sitesearch=rt",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!sl', '!sloane'],
			searchTemplate:  "http://oeis.org/search?q={searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!so', '!stackoverflow'],
			searchTemplate:  "http://stackoverflow.com/search?q={searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!th', '!thesaurus'],
			searchTemplate:  "http://thesaurus.com/browse/{searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!tw', '!twitter'],
			searchTemplate:  "https://twitter.com/search?q={searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!w', '!wikipedia'],
			searchTemplate:  "https://en.wikipedia.org/wiki/{searchTerms}",
			suggestTemplate: "http://en.wikipedia.org/w/api.php?action=opensearch&search={searchTerms}"

		}),
		Engine({
			patterns:        ['!wa', '!wolframalpha'],
			searchTemplate:  "http://www.wolframalpha.com/input/?i={searchTerms}",
			suggestTemplate: ""
		}),

		Engine({
			patterns:        ['!yt', '!youtube'],
			searchTemplate:  "https://www.youtube.com/results?search_query={searchTerms}&sm=3",
			suggestTemplate: ""
		})
	]

} )()







module.exports = {
	engines:  engines,
	fallback: google
}
