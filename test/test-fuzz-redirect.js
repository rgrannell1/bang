
"use strict"



var bangServer = require('bang/app/bang')
var request    = require('request')

var random     = require('./commons/random')
var constants  = require('./commons/constants')
var logger     = require('./logging/logger')




var config = {
	PORT:               8125,
	REQUEST_INTERVAL:   0,
	REDIRECT_STATUS:    307,

	NO_PATTERN_TESTS:   1000,
	TEST_DURATION:      10 * (60 * 1000),
	UPPER_QUERY_LENGTH: 100,

	UNICODE_UPPER_BOUND: 65536
}





var randomUrl = { }

randomUrl.normalQuery = ( ) => {
	return 'http://localhost:' + config.PORT + '/search?q=' + random.fromSet(config.UPPER_QUERY_LENGTH, constants.usedUnicode)
}





var callServer = (url, callback) => {

	request({url, followRedirect: false, agent: false}, (err, res, body) => {

		if (!err && res) {
			if (res.statusCode !== config.REDIRECT_STATUS) {
				throw Error(`invalid response code ${res.statusCode}`)
			}

		}

		setTimeout(( ) => {

			var statusCode = res ? res.statusCode : null
			callServer({err, statusCode, url})

		}, 0)

	})

}





var fuzzTest = { }

fuzzTest.noPattern = (ticksLeft, callback) => {

	var testResults = [ ]

	var recur = ticksLeft => {

		if (ticksLeft === 0) {
			callback(testResults)
		} else {

			setTimeout(( ) => {

				callServer(randomUrl.normalQuery( ), testResult => {

					testResults.push(testResult)
					recur(ticksLeft - 1)

				})

			}, config.REQUEST_INTERVAL)

		}

	}

	recur(ticksLeft)

}





var summariseTestResults = testResults => {

	var summary = {
		statuses: { }
	}

	testResults.forEach(testData => {

	})

	return summary

}





describe('# server redirection.', function ( ) {

	this.timeout(config.TEST_DURATION)

	var serverConfig = {

		port:  config.PORT,
		trace: false,
		fatalErrorHandler: err => {

			logger.error({

			}, 'Bang! server threw an error for a query')

		}
	}

	it('always returns a 3xx status, and never throws an error.', done => {

		bangServer(serverConfig, (app, server) => {

			fuzzTest.noPattern(config.NO_PATTERN_TESTS, testResults => {
				done( )
			})

		})

	})

})
