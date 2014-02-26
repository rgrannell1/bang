// engines.js
// ==========

const makeEngine = function (patterns, response) {
	/*
		take the bang patterns, join them into one regular
		expression, and return a regexp : callback pair.
	*/

	const wordBoundary =  '([ 	]+|$)'

	const patternText =
		patterns.
		map(function (pattern) {
			return pattern + wordBoundary
		}).
		reduce(function (pattern_1, pattern_2) {
			return pattern_1 + '|' + pattern_2
		})

	const patternRegExp = new RegExp(patternText, 'i')

	return {
		regexp:
			patternRegExp,
		response:
			response,
		patterns:
			patterns
	}
}

const engines = [
	makeEngine(['!se', '!sex'], function (terms) {

		return "http://stackexchange.com/search?q=" + terms
	}),
	makeEngine(
		['@', '!local', '!localhost'], function (terms) {

		return "http://127.0.0.1:" + terms
	}),
	makeEngine(
		['!', '!lucky'], function (terms) {

		return "https://encrypted.google.com/search?hl=en&btnI=I&q=" + terms
	}),
	makeEngine(
		['!am', '!amuk', '!amazon', '!amazonuk'], function (terms) {

		return "http://www.amazon.co.uk/s/ref=nb_sb_noss_2?" +
			"url=search-alias%3Daps&field-keywords=" + terms
	}),
	makeEngine(
		['!uex', '!askubuntu'], function (terms) {

		return 'http://askubuntu.com//search?q=' + terms
	}),
	makeEngine(
		['!bf', '!bookfinder'], function (terms) {

		return "http://www.bookfinder.com/search/?author=&title=" +
			terms +
			"&lang=en&submit=Begin+search&new_used=*&destination=ie" +
			"&currency=EU&mode=basic&st=sr&ac=qr"
	}),
	makeEngine(
		['!di', '!dic', '!dict', '!dictionary'], function (terms) {

		return "http://dictionary.reference.com/browse/" + terms + "?s=t"
	}),
	makeEngine(
		['!ddg', '!duckduckgo'], function (terms) {

		return "https://duckduckgo.com/?q=" + terms
	}),
	makeEngine(
		['!fb', '!facebook'], function (terms) {

		return "https://www.facebook.com/search/results.php?q=" + terms
	}),
	makeEngine(
		['!g', '!google'], function (terms) {

		return "https://encrypted.google.com/search?hl=en&q=" + terms
	}),
	makeEngine(
		['!gh', '!github'], function (terms) {

		return "https://github.com/search?q=" + terms + "&ref=cmdform"
	}),
	makeEngine(
		['!gi', 'images', '!googleimages'], function (terms) {

		return "https://encrypted.google.com/search?tbm=isch&q=" + terms + "&tbs=imgo:1"
	}),
	makeEngine(
		['!gs', 'scholar', '!googlescholar'], function (terms) {

		return "http://scholar.google.com/scholar?q=" + terms +
			"&btnG=Search&as_sdt=800000000001&as_sdtp=on"
	}),
	makeEngine(
		['!mex', '!mathexchange'], function (terms) {

		return 'http://math.stackexchange.com/search?q=' + terms
	}),
	makeEngine(
		['!oed', 'oxforddict','oxforddictionary'], function (terms) {

		return "http://www.oxforddictionaries.com/definition/english/" + terms + "?q=" + terms
	}),
	makeEngine(
		['!rot', '!rottentomatoes'], function (terms) {

		return "http://www.rottentomatoes.com/search/?search=" + terms + "&sitesearch=rt"
	}),
	makeEngine(
		['!sl', '!sloane'], function (terms) {

		return "http://oeis.org/search?q=" + terms
	}),
	makeEngine(
		['!so', '!sex', '!stackoverflow'], function (terms) {

		return "http://stackoverflow.com/search?q=" + terms
	}),
	makeEngine(
		['!th', '!thesaurus'], function (terms) {

		return "http://thesaurus.com/browse/" + terms
	}),
	makeEngine(
		['!tw', '!twitter'], function (terms) {

		return "https://twitter.com/search?q="+ terms
	}),
	makeEngine(
		['!w', '!wikipedia'], function (terms) {

		return "https://en.wikipedia.org/wiki/" + terms
	}),
	makeEngine(
		['!wa', '!wolframalpha'], function (terms) {

		return  "http://www.wolframalpha.com/input/?i=" + terms
	}),
	makeEngine(['!yt', '!youtube'], function (terms) {

		return "https://www.youtube.com/results?search_query=" + terms + "&sm=3"
	})
]

module.exports = {
	engines:
		engines
}
