
"use strict"




var bangServer = require('bang/app/bang')
var request    = require('request')




var constants = {
	PORT:               8125,
	REQUEST_INTERVAL:   250,
	REDIRECT_STATUS:    307,

	NO_PATTERN_TESTS:   1000,
	TEST_DURATION:      10 * (60 * 1000),
	UPPER_QUERY_LENGTH: 10,

	UNICODE_UPPER_BOUND: 65536
}





var randomText = ( ) => {

	var len = Math.floor(Math.random( ) * constants.UPPER_QUERY_LENGTH)

	var out = ''

	for (var ith = 0; ith < len; ++ith) {
		out += String.fromCharCode(Math.floor(Math.random( ) * constants.UNICODE_UPPER_BOUND))
	}

	return out

}





var randomUrl = { }

randomUrl.normalQuery = ( ) => {

	var path = randomText( )
	return `http://localhost:${constants.PORT}/search?q=${path}`

}





var callServer = (url, callback) => {

	console.log( url )

	request({url, followRedirect: false}, (err, res, body) => {

		if (err) {
			throw err
		} else if (!res) {
			throw Error('empty server response.')
		} else {

			if (res.statusCode !== constants.REDIRECT_STATUS) {
				throw Error(`invalid response code ${res.statusCode}`)
			}

			callback( )

		}

	})

}





var fuzzTest = { }

fuzzTest.noPattern = (ticksLeft, callback) => {

	var recur = ticksLeft => {

		if (ticksLeft === 0) {
			callback( )
		} else {

			setTimeout(( ) => {

				callServer(randomUrl.normalQuery( ), ( ) => {
					recur(ticksLeft - 1)
				})

			}, constants.REQUEST_INTERVAL)

		}

	}

	recur(ticksLeft)

}





describe('server redirection.', function ( ) {

	this.timeout(constants.TEST_DURATION)

	it('always returns a 3xx status, and never throws an error.', done => {

		bangServer({port: constants.PORT, trace: false}, (app, server) => {

			fuzzTest.noPattern(constants.NO_PATTERN_TESTS, ( ) => {
				done( )
			})

		})

	})

})
