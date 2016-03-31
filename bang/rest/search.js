
"use strict"





var redirect   = require('../redirect')
var httpStatus = require('../commons/http-status')





var search = (config, req, res) => {

	var rawQuery    = req.query && req.query.q
		? req.query.q
		: ''

	var helpRegex   = /[!]about/i

	var redirectUrl = helpRegex.test(rawQuery)
		? redirect.search.toHelpFile(config, rawQuery)
		: redirect.search.toSearchEngine(config, rawQuery)

	res
	.status(httpStatus.temporaryRedirect)
	.set('Location', redirectUrl)
	.end( )

}





module.exports = search
