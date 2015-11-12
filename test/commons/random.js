
"use strict"




var constants = require('./constants')





var random = {
	bangURL: { }
}





random.fromSet = (upperLength, charset) => {

	var out = [ ]
	var len = Math.floor(Math.random( ) * upperLength)

	for (var ith = 0; ith < len; ++ith) {
		out[ith] = charset[Math.floor(Math.random( ) * charset.length)]
	}

	return out.join('')

}





random.bangURL.search = (port, upperLength) => {
	return 'http://localhost:' + port + '/search?q=' + random.fromSet(upperLength, constants.usedUnicode)
}






module.exports = random
