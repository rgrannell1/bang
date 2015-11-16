
"use strict"





var URL = require('url')





var toBaseUrl = url => {

	var parsed = URL.parse(url, true)
	return `${parsed.protocol}//${parsed.hostname}/`

}





var Engine = engine => {

	return {
		isDefault:       engine.isDefault       || false,
		suggestTemplate: engine.suggestTemplate || "",
		searchTemplate:  engine.searchTemplate  || "",
		patterns:        engine.patterns,
		baseUrl:         engine.baseUrl         || toBaseUrl(engine.searchTemplate)
	}

}

Engine.precond = engine => {

	is.always.object(engine)

}




module.exports = Engine
