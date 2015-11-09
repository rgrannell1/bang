
Bang 4.3.1
---------------------------------------------------------------------------------
Date:

ENHANCEMENTS:

* Added Docker file.

* .





Bang 3.3.1
---------------------------------------------------------------------------------
Date:

ENHANCEMENTS:

* Now detects all whitespace when checking if an engine was supplied.

* Added named http status codes to tidy source code.

* Updated much of the source code to use ES6.

* Logging no longer uses string interpolation excessively.

* Code now validated using strict mode.

* Code now validated using eslint.

* Moved logging to stdout, for easier use with bunyan's CLI tool.

BUG-FIXES:

* Now accounts for missing responses for search suggestions.





Bang 2.3.1
---------------------------------------------------------------------------------
Date: 2015-10-28

ENHANCEMENTS:

- Added Google Keep support.

- Added Google Inbox support.




Bang 2.2.1
---------------------------------------------------------------------------------
Date: 2015-5-25

BUG-FIXES:

* Now logs to stderr only, to avoid permission problems.




Bang 2.2.0
---------------------------------------------------------------------------------
Date: 2015-5-25

ENHANCEMENTS:

- Bang can now only be accessed from localhost.

- Added a docopt bin script for starting the docopt server.





Bang 2.1.0
---------------------------------------------------------------------------------
Date: 2015-3-4

ENHANCEMENTS:

- Added preliminary implementation of search suggestions to bang.bas
- Added Google Calender support.bas
- Improved error-message logging.
- Help page now uses HTML templating via mustache.
- Bang! now logs uptime on shutdown.
- Improved route structure.
- Refactored code-base to improve modularity, extensibility.
- Bang now uses path.join to build local URLS, potentially fixing Windows incompatability.
- Now uses /search?q={terms} to collect search terms from the browser address bar.
- Supports setting the baseURL for a search engine manually, to facilitate services with a path component. Closes #2, #3.
- Now accepts port number as an optional command-line argument.





#### 23th November 2014

- Added support for pocket.

#### 25th December 2013
- Added '@' alias for localhost redirection to a specified port number.

#### 28th December 2013
- Added bangs for stackoverflow and sloane sequences.

#### 29th December 2013
- Added bangs for RottenTomatoes.

#### 1st January 2014

- First change of the year. Added full name aliases, and case insensitivity.

#### 3rd January 2014

- Refactored code to use current ECMAscript 6 features.

#### 7th January 2014

- Added support for duckduckgo.

#### 12th January 2014

- Added OED and dictionary.reference support.

#### 6th February 2014

- Updated the cronjob script to work on every
computer, not just my own. Rewrote in python.
- Removed kickasstorrents bang, since it's been banned in Ireland.
- Removed install.html, as it is currently broken.

#### 18th January 2014

- Added google "I'm feeling lucky!" search, which
redirects to their guess for the closest page to your terms.

#### 19th January 2014

- Added support for stack-exchange metasearch.

#### 26th January 2014

- Added version number 0.2.0, for compatability with node
package structure.

#### 3 March 2014

- Added a locally-hosted help page under "!about". Incremented
to 0.3.1.

#### 5 March 2014

- Added gmail support.

#### 8 March 2014

- Changed localhost reference from 127.0.0.1 to localhost. Incremented
to 0.3.4.

#### 10 March 2014

- Fixed the last version, bumped to 0.3.5. Test added to prevent the same
bug occurring again.

#### 11 March 2014

- Added documentation for installing on Chromium (no code changes needed).
- Bumped to 0.3.6, after fixing bug with non '!' prefixed patterns. A test was
added to ensure all patterns have this prefix.

#### 20 March 2014

- Moved to the semantic versioning 2.0.0 standard, which means future version
numbers will have precise meanings.

#### 21 March 2014

- Released 0.4.6, which improved internal tests and error message support.
- Released 0.5.6, and added "open source report card" engine support.
- Released 0.6.6, which adds version numbers to the about page and improves the generation
of help pages internally.
- Released 0.7.6, which adds better patterns for stack exchange sites (stackmath, stackubuntu...).
Also adds better regular expression escaping to patterns.

#### 22 March 2014

- Releases 0.8.6, which adds links to the dynamically generated help page.

#### 24 March 2014

- Release 0.8.7, which fixes an issue with gmail support not working with search.

#### 25 March 2014

- Released 0.8.8, which fixes an breaking bug involving redeclaration of a const. Tests to
ensure this won't happen again will be added at a later date.

#### 2 April 2014

- Released 0.9.8, and implemented support for google news.

#### 8 April 2014

- Released 0.10.9, a substantial release. Added support for german, canadian and us amazon
sites. Fixed a potential issue with google news, and added tests to ensure all base url's work.

#### 10 April 2014

- Released 0.11.9 which adds support for colorhexa - a site for looking up colour hex codes.

### 13 April 2014

- Released 0.11.10, which now escapes URI components. This fixes issues with search terms containing special characters.

### 15 April 2014

- Released 0.12.10, which adds support for channel9.

### 18 April 2014

- Released 0.13.10, which adds support for reddit.
- Released 0.14.10, which adds support for Rdocumentation.

### 3 May 2014

- Released 15.10, which addeds support for antonym search.

### 17 May 2014

- Bumped to 1.0.0; Bang! is stable and feature complete for the near future.