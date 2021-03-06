#!/usr/bin/env node

"use strict"




var doc = `
Usage:
	bang [-p X | --port X] [-t | --trace] [-s | --silent]
	bang (-h | --help | --version)

Description:

	Bang is a redirect-server redirects queries to a relevant search engine based on
	engine flags.

Options:
	-p X, --port X    the port to run the server from [default: 8025]
	-t, --trace       should details about individual requests be logged?
	-s, --silent      only display error output.
	-h, --help        display these help files.
`




var docopt     = require('docopt').docopt
var bangServer = require('../app/bang')
var args       = docopt(doc)





bangServer({

	port:   args['--port'],
	trace:  args['--trace'],
	silent: args['--silent']

}, ( ) => {

})
