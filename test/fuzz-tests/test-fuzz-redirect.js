
"use strict"



var bangServer = require('bang/app/bang')
var request    = require('request')

var random     = require('../commons/random')
var constants  = require('../commons/constants')
var logger     = require('../logging/logger')




var config = {
	PORT:               8125,
	REQUEST_INTERVAL:   0,
	REDIRECT_STATUS:    307,

	NO_PATTERN_TESTS:   10000,
	TEST_DURATION:      10 * (60 * 1000),
	UPPER_QUERY_LENGTH: 100,

	UNICODE_UPPER_BOUND: 65536
}

config.SERVER_ARGS = {

	port:  config.PORT,
	trace: false,
	fatalErrorHandler: err => {

		logger.error({
			err
		}, 'Bang! server threw an error for a query')

	}
}





var callServer = (url, callback) => {

	request({url, followRedirect: false, agent: false}, (err, res, body) => {

		setTimeout(( ) => {

			callback({
				err,
				statusCode: res ? res.statusCode : null,
				url
			})

		}, 0)

	})

}





var fuzzTest = { }

fuzzTest.noPattern = (ticksLeft, callback) => {

	var testResults   = [ ]
	var startingTicks = ticksLeft

	var recur = ticksLeft => {

		if (ticksLeft === 0) {
			callback(testResults, startingTicks)
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





describe('# server redirection.', function ( ) {

	var testResults;
	this.timeout(config.TEST_DURATION)

	before(done => {

		bangServer(config.SERVER_ARGS, (app, server) => {

			fuzzTest.noPattern(config.NO_PATTERN_TESTS, (results) => {

				testResults = results
				done( )

			})

		})

	})

	it(`requests always have responses with a redirect status.`, ( ) => {

		testResults.forEach(result => {

			if (result.statusCode && result.statusCode !== config.REDIRECT_STATUS) {
				throw Error(`server responsed ${result.statusCode} for ${result.url} with ${result.err.toString( )}`)
			}

		})

	})

})
