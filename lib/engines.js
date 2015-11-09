#!/usr/bin/env node

"use strict"





const is     = require('is')
const url    = require('url')
const utils  = require('./utils')
const path   = require('path')
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

{

	/*
		joinPatterns :: [string] -> regex

		collapse each pattern that can be used to request an
		engine into a single regular expression.

	*/

	let joinPatterns = patterns => {

		const wordBoundary   = '([ 	]+|$|^)'

		const literalPattern =  patterns
			.map(pattern => {

				return [wordBoundary]
					.concat(
						pattern.split('').map(char => `[${char}]`))
					.concat(wordBoundary)
					.join('')

			})
			.join('|')

		return new RegExp(literalPattern, 'i')

	}

	var Engine = engine => {

		if (!is.array(engine.patterns)) {
			logger.error("Engine: patterns was not an array.")
		} else {
			engine.patterns.forEach(pattern => {
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

}





const google = Engine({
	patterns:        ['!g', '!google'],
	searchTemplate:  "https://encrypted.google.com/search?hl=en&q={searchTerms}",
	baseURL:         "",
	suggestTemplate: "https://suggestqueries.google.com/complete/search?client=firefox&q={searchTerms}"
})





const engines = [
	{
		patterns:        ['!about'],
		searchTemplate:  path.join(__dirname, "help.html"),
		suggestTemplate: ""
	},

	{
		patterns:        ['!se', '!stackexchange'],
		searchTemplate:  "http://stackexchange.com/search?q={searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['@', '!local', '!localhost'],
		searchTemplate:  "http://localhost:{searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!', '!lucky'],
		searchTemplate:  "https://encrypted.google.com/search?hl=en&btnI=I&q={searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!am', '!amuk', '!amazon', '!amazonuk'],
		searchTemplate:  "http://www.amazon.co.uk/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={searchTerms}",
		suggestTemplate: "http://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q={searchTerms}"
	},
	{
		patterns:        ['!amus', '!amusa', '!amazonusa'],
		searchTemplate:  "http://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!amca', '!amazonca', '!amazoncanada'],
		searchTemplate:  "http://www.amazon.ca/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!amde', '!amazonde', '!amazondeutsch', '!amazongermany'],
		searchTemplate:  "http://www.amazon.de/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords={searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!anti', '!antonym', '!opposite'],
		searchTemplate:  "http://www.synonym.com/antonyms/{searchTerms}/",
		suggestTemplate: ""
	},

	{
		patterns:        ['!uex', '!askubuntu', '!stackubuntu'],
		searchTemplate:  "http://askubuntu.com/search?q={searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!bf', '!bookfinder'],
		searchTemplate:  "http://www.bookfinder.com/search/?author=&title={searchTerms}" +
			"&lang=en&submit=Begin+search&new_used=*&destination=ie" + "&currency=EU&mode=basic&st=sr&ac=qr",
		suggestTemplate: "",
	},

	{
		patterns:        ['!cl', '!calendar'],
		searchTemplate:  "https://www.google.com/calendar/render?q={searchTerms}",
		baseURL:         "https://www.google.com/calendar",
		suggestTemplate: ""
	},

	{
		patterns:        ['!ch', '!colorhexa', '!colourhexa', '!colour', '!color'],
		searchTemplate:  "http://www.colorhexa.com/{searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!di', '!dic', '!dict', '!dictionary'],
		searchTemplate:  "http://dictionary.reference.com/browse/{searchTerms}?s=t",
		suggestTemplate: ""
	},

	{
		patterns:        ['!ddg', '!duckduckgo'],
		searchTemplate:  "https://duckduckgo.com/?q={searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ["!osrc", "!opensourcereportcard"],
		searchTemplate:  "http://osrc.dfm.io/{searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!fb', '!facebook'],
		searchTemplate:  "https://www.facebook.com/search/results.php?q={searchTerms}",
		suggestTemplate: ""
	},

	google,

	{
		patterns:        ['!gm', '!gmail'],
		searchTemplate:  "https://mail.google.com/mail/u/0/?pli=1#search/{searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!gn', '!googlenews'],
		searchTemplate:  "https://news.google.com/news/search?q={searchTerms}&btnG=Search+News",
		suggestTemplate: ""
	},

	{
		patterns:        ['!gh', '!github'],
		searchTemplate:  "https://github.com/search?q={searchTerms}&ref=cmdform",
		suggestTemplate: ""
	},

	{
		patterns:        ['!gi', '!images', '!googleimages'],
		searchTemplate:  "https://encrypted.google.com/search?tbm=isch&q={searchTerms}&tbs=imgo:1",
		suggestTemplate: ""
	},

	{
		patterns:        ['!gs', '!scholar', '!googlescholar'],
		searchTemplate:  "http://scholar.google.com/scholar?q={searchTerms}&btnG=Search&as_sdt=800000000001&as_sdtp=on",
		suggestTemplate: ""
	},

	{
		patterns:        ['!in', '!inbox', '!googleinbox'],
		searchTemplate:  "https://inbox.google.com/search/{searchTerms}?cid=imp",
		suggestTemplate: ""
	},

	{
		patterns:        ['!kp', '!keep', '!googlekeep'],
		searchTemplate:  "https://keep.google.com/#search/text={searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!mex', '!stackmath'],
		searchTemplate:  'http://math.stackexchange.com/search?q={searchTerms}',
		suggestTemplate: ""
	},

	{
		patterns:        ['!ch9', '!channel9'],
		searchTemplate:  'http://channel9.msdn.com/search?term={searchTerms}',
		suggestTemplate: ""
	},

	{
		patterns:        ['!oed', '!oxforddict','!oxforddictionary'],
		searchTemplate:  "http://www.oxforddictionaries.com/definition/english/{searchTerms}?q={searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!pkt', '!pocket'],
		searchTemplate:  "http://getpocket.com/a/queue/grid/{searchTerms}/",
		suggestTemplate: ""
	},

	{
		patterns:        ['!rd', '!rdoc', '!rdocs', '!rdocumentation'],
		searchTemplate:  "http://www.rdocumentation.org/advanced_search?utf8=%E2%9C%93&q={searchTerms}&package_name=&function_name=&title=&description=&author=",
		suggestTemplate: "",
	},

	{
		patterns:        ['!r', '!reddit'],
		searchTemplate:  "http://www.reddit.com/search?q={searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!rot', '!rottentomatoes'],
		searchTemplate:  "http://www.rottentomatoes.com/search/?search={searchTerms}&sitesearch=rt",
		suggestTemplate: ""
	},

	{
		patterns:        ['!sl', '!sloane'],
		searchTemplate:  "http://oeis.org/search?q={searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!so', '!stackoverflow'],
		searchTemplate:  "http://stackoverflow.com/search?q={searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!th', '!thesaurus'],
		searchTemplate:  "http://thesaurus.com/browse/{searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!tw', '!twitter'],
		searchTemplate:  "https://twitter.com/search?q={searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!w', '!wikipedia'],
		searchTemplate:  "https://en.wikipedia.org/wiki/{searchTerms}",
		suggestTemplate: "http://en.wikipedia.org/w/api.php?action=opensearch&search={searchTerms}"

	},
	{
		patterns:        ['!wa', '!wolframalpha'],
		searchTemplate:  "http://www.wolframalpha.com/input/?i={searchTerms}",
		suggestTemplate: ""
	},

	{
		patterns:        ['!yt', '!youtube'],
		searchTemplate:  "https://www.youtube.com/results?search_query={searchTerms}&sm=3",
		suggestTemplate: ""
	}
]
.map(Engine)





module.exports = {
	engines:  engines,
	fallback: google
}
