

"use strict"




var fs = require('fs')



var constants = {
	paths: { }
}

constants.paths.HELP_PATH   = 'public/html/help-template.html'
constants.paths.ENGINE_DATA = 'lib/data/engines.js'

constants.version           = require('../../package.json').version






module.exports = constants
