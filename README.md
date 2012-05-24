# humanize #

Javascript string formatter for human readability. Blatently stolen from @milanvrekic/JS-humanize

Can be loaded via AMD or in node directly.

## Installation ##

    npm install humanize

## Functions available: ##

 - humanize.time (current time in seconds)
 - humanize.date (a la php)
 - humanize.numberFormat
 - humanize.naturalDay
 - humanize.naturalTime
 - humanize.ordinal
 - humanize.filesize
 - humanize.linebreaks
 - humanize.nl2br
 - humanize.truncatechars
 - humanize.truncatewords

## Usage: ##
```javascript
var humanize = require('humanize');
humanize.date('Y-m-d'); // 'yyyy-mm-dd'
humanize.filesize(1234567890); // '1.15 Gb'
```
