
is v1.0.0
====================

Is.js wraps the following useful but cryptic one-liner for finding out the
type of a value in a way more reliable than `typeof`.

```js
Object.prototype.toString.call(val)
```

## Installation

```js
git clone https://github.com/rgrannell1/is.git
cd is
```

## Usage

Is.js is both a node.js and a web-JavaScript library.

```js
const is = require('is')

is.a         :: string x any -> boolean
is.what      :: any -> string

is.array     :: any -> boolean
is.boolean   :: any -> boolean
is.date      :: any -> boolean
is.error     :: any -> boolean
is.function  :: any -> boolean
is.null      :: any -> boolean
is.number    :: any -> boolean
is.object    :: any -> boolean
is.regexp    :: any -> boolean
is.string    :: any -> boolean
is.undefined :: any -> boolean

```

## License

'is' is released under the MIT licence.

The MIT License (MIT)

Copyright (c) 2014 Ryan Grannell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Versioning

All versions post-release will be compliant with the Semantic Versioning 2.0.0 standard.

http://semver.org/
