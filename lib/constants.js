#!/usr/bin/env node

"use strict"



var constants = {
	paths: { }
}

constants.paths.HELP_PATH = 'public/html/help-template.html'
constants.version         =  require('../package.json').version





module.exports = constants
