
const a = function (str, val) {
	return Object.prototype.toString.call(val).toLowerCase() ===
		"[object " + str.toLowerCase() + "]"
}




module.exports = {
	'a': a,
	'array':  function (val) {
		return a('array', val)
	},
	'boolean': function (val) {
		return a('boolean', val)
	},
	'date': function (val) {
		return a('date', val)
	},
	'error': function (val) {
		return a('error', val)
	},
	'function': function (val) {
		return a('function', val)
	},
	'null': function (val) {
		return a('null', val)
	},
	'number': function (val) {
		return a('number', val)
	},
	'object': function (val) {
		return a('object', val)
	},
	'regexp': function (val) {
		return a('regexp', val)
	},
	'string': function (val) {
		return a('string', val)
	},
	'undefined': function (val) {
		return a('undefined', val)
	},
	'what': function (val) {
		return Object.prototype.toString.call(val).toLowerCase().slice(8, -1)
	}
}
