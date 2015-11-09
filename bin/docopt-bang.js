#!/usr/bin/env node

"use strict"




var doc = `
Usage:
	bang --port=<port>
	bang (-h | --help | --version)
`




var docopt     = require('docopt').docopt
var BangServer = require('../lib/bang')
var args       = docopt(doc)

var utils      = require('../lib/utils')
var logger     = utils.logger



try {

	BangServer([ ], {port: args['--port']} )

} catch (err) {

	logger.error({message: err.message}, 'uncaught exception.')

}





