Bang! v0.11.10
===========

[![Build Status](https://travis-ci.org/rgrannell1/bang.png?branch=master)](https://travis-ci.org/rgrannell1/bang)

Bang! (an homage to Bing) is a metasearch engine. It uses shorthands
like "!w Alpaca" or "! how to buy an Alpaca" to search other search engines
and websites and brings you straight to your results.

**Bang!** is inspired by DuckDuckGo's '!' syntax, but with some key differences. **Bang!**
is locally hosted, so you don't need to give your query to DuckDuckGo for processing. **Bang!** is also more
performant than using a third-party for redirection, and can also redirect to locally hosted webapps
running on specific ports using "@ 8910" syntax.

**Bang!** is currently supported on new versions of Firefox and Chromium / Chrome.

<img src="example.gif"> </img>

### 1 Requirements

* Firefox (tested on >= v26) or Chromium/Chrome >= v32
* Ubuntu, or possibly another UNIX distro. (tested on Ubuntu 13.10)
* Node.js v0.10.20
* Node forever

### 2 Installation

First, download the repository from github.

```bash
git clone https://github.com/rgrannell1/bang
cd bang
```

*DEVELOPERS NOTE: Adding Bang! to your browser will be made easier in the future. The canonical
methods of using window.external.addSearchProvider or embedded search links do not reliably work
on my test hardware.*

#### 2.1 Firefox

Copy the "bang.xml" file into your "firefox/xxxxxxx.default/searchplugins" folder;
if it doesn't exist create it. You can then set the search engine to "Bang!"
in Firefox.

#### 2.2 Chromium / Chrome

Navigate to Chromium's search engine settings at the following url

```
chrome://settings/searchEngines
```

and add the following data to the form at the bottom of the page.

```
"Add a new search engine    keyword    URL with %s in place of query"

Bang!                       bang       http://localhost:8125/?q=%s
```

Hover over the new entry, and click "Make Default. Bang! should now be working.

#### 2.3 Install the Local Node Server

The node server can then be executed manually (it defaults to running on port
8125).

```bash
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
```

```bash
node lib/bang.js
```

For long-term use it is wise to set the node server to start automatically
after restart using crontab Node forever is required to restart the script
in the event of a crash, so install it.

```bash
sudo npm install forever -g
```
Now edit the crontab and add the following line to the end

```bash
crontab -e
@reboot /home/user/bang/bang-cronjob.py
```
Replacing the example path with the location of the cronjob on your machine.

Make sure to replace the mock URL with your real URL. Now you need to reboot (eventually) to start the cron job,
and then you should be ready to go!

### 3 License

The MIT License

Copyright (c) 2013 Ryan Grannell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### 4 Versioning

All versions post 0.3.6 comply with the Semantic Versioning 2.0.0 standard.
