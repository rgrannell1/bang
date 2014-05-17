
const path =
	require('path')

const fs =
	require('fs')

const engines =
	require('./engines.js').engines

const writeAsJSON = function (outFile, obj) {

	const stringified = "var helpData = " + JSON.stringify(obj, null, 4)

	fs.writeFile(outFile, stringified, function (err) {

		if (err) {
			console.log(err)
		}

	})
}

/*
	write the engine data to a json file for
	the help files sake.
*/

writeAsJSON(
	path.join(__dirname, "help-data.js"),
	engines.map(function (engine) {

		return {
			patterns:
				engine.patterns,
			hostName:
				engine.hostName
		}

	})
)