
"use strict"





var request    = require('request')

var redirect   = require('../redirect')
var httpStatus = require('../commons/http-status')
var logger     = require('../logging/logger')





var suggest = (config, req, res) => {

	var rawQuery  = req.query && req.query.q
		? req.query.q
		: ''

	var lookupUrl = redirect.suggest.toSuggestEngine(config, rawQuery)





	request(lookupUrl, (err, _, body) => {

		if (err) {

			logger.error({err, rawQuery, lookupUrl}, 'suggestion lookup failed.')

		} else if (!res) {

			logger.error({rawQuery, lookupUrl}, 'request recieved no response.')

		} else {

			res
			.set('Content-Type', 'application/x-suggestions+json')
			.send(body.toString( ))

		}

	})

}





module.exports = suggest
