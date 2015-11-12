
"use strict"



var util       = require('util')
var request    = require('request')
var bangServer = require('bang/app/bang')

var random     = require('../commons/random')
var constants  = require('../commons/constants')
var logger     = require('../logging/logger')




var config = {
	PORT:               8125,
	REQUEST_INTERVAL:   0,
	REDIRECT_STATUS:    307,

	TESTS:              10 * 1000,
	TEST_DURATION:      10 * (60 * 1000),
	UPPER_QUERY_LENGTH: 100,

	UNICODE_UPPER_BOUND: 65536
}

config.SERVER_ARGS = {

	port:  config.PORT,
	trace: false,
	fatalErrorHandler: (errors, err) => {

		logger.error({
			err
		}, 'Bang! server threw an error for a query')

		errors.push(err)

	}
}





var callServer = (url, callback) => {

	request({url, followRedirect: false, agent: false}, (err, res, body) => {

		setTimeout(callback, 0, {
			err,
			statusCode: res ? res.statusCode : null,
			url
		})

	})

}





var fuzzTest = { }

fuzzTest.noPattern = (ticksLeft, callback) => {

	var testResults   = [ ]
	var startingTicks = ticksLeft

	var recur = ticksLeft => {

		if (ticksLeft === 0) {

			setTimeout(callback, startingTicks, testResults)

		} else {

			setTimeout(( ) => {

				var url = random.bangURL.search(config.PORT, config.UPPER_QUERY_LENGTH)

				callServer(url, testResult => {

					testResults.push(testResult)
					recur(ticksLeft - 1)

				})

			}, config.REQUEST_INTERVAL)

		}

	}

	recur(ticksLeft)

}





describe(`# server redirection (n = ${config.TESTS})`, function ( ) {

	var testResults
	var serverErrors = [ ]

	this.timeout(config.TEST_DURATION)





	before(done => {

		config.SERVER_ARGS.fatalErrorHandler =
			config.SERVER_ARGS.fatalErrorHandler.bind({ }, serverErrors)

		bangServer(config.SERVER_ARGS, (app, server) => {

			fuzzTest.noPattern(config.TESTS, (results) => {

				testResults = results
				done( )

			})

		})

	})

	it(`completed requests always have responses with a redirect status.`, ( ) => {

		testResults.forEach(result => {

			var errString = result.err
				? ` with ${result.err.toString( )}`
				: ''

			if (result.statusCode && result.statusCode !== config.REDIRECT_STATUS) {
				throw Error(`server responsed ${result.statusCode} for ${result.url}${errString}`)
			}

		})

	})

	it("never triggers fatal server errors", ( ) => {

		if (serverErrors.length > 0) {

			throw Error( util.inspect(serverErrors, {
				depth: null
			}) )

		}

	})

})