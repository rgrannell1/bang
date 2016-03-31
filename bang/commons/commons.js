

"use strict"





var timer = ( ) => {

	var startTime = Date.now( )

	return ( ) => {
		return Date.now( ) - startTime
	}

}





module.exports = {
	timer
}
