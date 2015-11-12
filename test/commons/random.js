
"use strict"





var random = { }





random.fromSet = (upperLength, charset) => {

	var out = [ ]
	var len = Math.floor(Math.random( ) * upperLength)

	for (var ith = 0; ith < len; ++ith) {
		out[ith] = charset[Math.floor(Math.random( ) * charset.length)]
	}

	return out.join('')

}





module.exports = random
