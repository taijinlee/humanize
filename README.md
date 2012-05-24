# humanize #

Javascript data formatter for human readability.

Idea, name, and initial code blatently stolen from [milanvrekic/JS-humanize](http://github.com/milanvrekic/JS-humanize)

Can be loaded via AMD or in node directly.

## Installation ##

    npm install humanize

## Usage: ##
```javascript
var humanize = require('humanize');
humanize.date('Y-m-d'); // 'yyyy-mm-dd'
humanize.filesize(1234567890); // '1.15 Gb'
```

## Functions available: ##

####humanize.time()####
Retrieves the current time in seconds

####humanize.date(format [, timestamp or JS Date Object = new Date()])####
This is a port of [php.js date](http://phpjs.org/functions/date:380) and behaves exactly like [PHP's date](http://php.net/manual/en/function.date.php)

####humanize.numberFormat(number [, decimals = 2, decPoint = '.', thousandsSep = ','])####
Format a number to have decimal significant decimal places, using decPoint as the decimal separator, and thousandsSep as thousands separater

####humanize.naturalDay####

####humanize.naturalTime####

####humanize.ordinal(integer)####
Converts a number into its [ordinal representation](http://en.wikipedia.org/wiki/Ordinal_number_\(linguistics\)).

####humanize.filesize(filesize [, kilo = 1024, decimals = 2, decPoint = '.', thousnadsSep = ',']) ####
Converts a byte count to a human readable value using kilo as the basis, and numberFormat formatting

####humanize.linebreaks(string)####
Converts a string's newlines into properly formatted html ie. one new line -> br, two new lines -> p, entire thing wrapped in p

####humanize.nl2br(string)####
Converts a string's newlines into br's

####humanize.truncatechars(string, length)####
Truncates a string to length-1 and appends …. If string is shorter than length, then no-op

####humanize.truncatewords(string, numWords)####
Truncates a string to only include the first numWords words and appends …. If string has fewer words than newWords, then no-op
