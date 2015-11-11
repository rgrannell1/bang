
"use strict"




var bangServer = require('bang/app/bang')
var request    = require('request')




var config = {
	PORT:             8125,
	REQUEST_INTERVAL: 50,
	REDIRECT_STATUS:  307,

	NO_PATTERN_TESTS: 1000,
	TEST_DURATION:    10 * (60 * 1000)
}





var randomText = ( ) => {
	return 'test'
}





var randomUrl = { }

randomUrl.normalQuery = ( ) => {
	return `http://localhost:${config.PORT}/search/?q={randomText( )}`
}

randomUrl.patternQuery = ( ) => {

}






var callServer = (url, callback) => {

	request({url, followRedirect: false}, (err, res, body) => {

		if (err) {
			throw err
		} else if (!res) {
			throw Error('empty server response.')
		} else {

			if (res.statusCode !== config.REDIRECT_STATUS) {
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

				callServer(randomUrl.normalQuery( ), recur.bind({ }, ticksLeft - 1))

			}, config.REQUEST_INTERVAL)

		}

	}

	recur(ticksLeft)

}





describe('server redirection.', function ( ) {

	this.timeout(config.TEST_DURATION)

	it('always returns a 3xx status, and never throws an error.', done => {

		bangServer({port: config.PORT, trace: false}, (app, server) => {

			fuzzTest.noPattern(config.NO_PATTERN_TESTS, ( ) => {
				done( )
			})

		})

	})

})
