#!/usr/bin/env node

const path = require('path')



const relative = function () {

	const args = Array.prototype.slice.call(arguments)
	return path.resolve.apply( null, [__dirname].concat(args) )

}

module.exports = {
	relative: relative
}
