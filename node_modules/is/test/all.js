
const is = require('../lib/is.js')



console.assert(is.string(''))
console.assert(is.string('string'))
console.assert(is.a('string', 'string'))

console.assert(is.number(-1))
console.assert(is.number(0))
console.assert(is.number(+1))
console.assert(is.a('number', +1))

console.assert(is.number(NaN))
console.assert(is.number(+Infinity))
console.assert(is.number(-Infinity))
console.assert(is.a('number', +Infinity))

console.assert(is.function(Math.max))

console.assert(is.undefined(undefined))
console.assert(is.null(null))

console.assert( is.object({}) )
console.assert( is.object({a: 1, b:2}) )
