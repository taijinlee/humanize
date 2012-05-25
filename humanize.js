
(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `humanize` variable.
  var previousHumanize = root.humanize;

  var humanize = {};
  var undefinedString = 'undefined';

  if (typeof exports !== undefinedString) {
    if (typeof module !== undefinedString && module.exports) {
      exports = module.exports = humanize;
    }
    exports.humanize = humanize;
  } else {
    if (typeof define === 'function' && define.amd) {
      define('humanize', function() {
        return humanize;
      });
    }
    root.humanize = humanize;
  }

  humanize.noConflict = function() {
    root.humanize = previousHumanize;
    return this;
  };

  humanize.time = function() {
    return new Date().getTime() / 1000;
  }

  /* helper for humanize.date */
  var _pad = function(str, count) {
    str = String(str);
    if (str.length >= count) { return str; }
    return new Array((++count) - str.length).join('0') + str;
  };
  /**
   * PHP-inspired date
   */
  humanize.date = function(format, timestamp) {
    var jsdate = ((typeof timestamp === undefinedString) ? new Date() : // Not provided
                  (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
                  new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
                 );

    var formatChr = /\\?([a-z])/gi;
    var formatChrCb = function (t, s) {
      return f[t] ? f[t]() : s;
    };

    var shortDayTxt = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'];
    var monthTxt = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var f = {
      /* Day */
      // Day of month w/leading 0; 01..31
      d: function () { return _pad(f.j(), 2); },

      // Shorthand day name; Mon..Sun
      D: function () { return f.l().slice(0, 3); },

      // Day of month; 1..31
      j: function () { return jsdate.getDate(); },

      // Full day name; Monday..Sunday
      l: function () { return shortDayTxt[f.w()] + 'day'; },

      // ISO-8601 day of week; 1[Mon]..7[Sun]
      N: function () { return f.w() || 7; },

      // Ordinal suffix for day of month; st, nd, rd, th
      S: function () {
        var j = f.j();
        return j > 4 && j < 21 ? 'th' : {1: 'st', 2: 'nd', 3: 'rd'}[j % 10] || 'th';
      },

      // Day of week; 0[Sun]..6[Sat]
      w: function () { return jsdate.getDay(); },

      // Day of year; 0..365
      z: function () {
        var a = new Date(f.Y(), f.n() - 1, f.j());
        var b = new Date(f.Y(), 0, 1);
        return Math.round((a - b) / 86400) + 1;
      },

      /* Week */
      // ISO-8601 week number
      W: function () {
        var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
        var b = new Date(a.getFullYear(), 0, 4);
        return _pad(1 + Math.round((a - b) / 86400 / 7), 2);
      },

      /* Month */
      // Full month name; January..December
      F: function () { return monthTxt[jsdate.getMonth()]; },

      // Month w/leading 0; 01..12
      m: function () { return _pad(f.n(), 2); },

      // Shorthand month name; Jan..Dec
      M: function () { return f.F().slice(0, 3); },

      // Month; 1..12
      n: function () { return jsdate.getMonth() + 1; },

      // Days in month; 28..31
      t: function () { return (new Date(f.Y(), f.n(), 0)).getDate(); },

      /* Year */
      // Is leap year?; 0 or 1
      L: function () { return new Date(f.Y(), 1, 29).getMonth() === 1 || 0; },

      // ISO-8601 year
      o: function () {
        var n = f.n();
        var W = f.W();
        return f.Y() + (n === 12 && W < 9 ? -1 : n === 1 && W > 9);
      },

      // Full year; e.g. 1980..2010
      Y: function () { return jsdate.getFullYear(); },

      // Last two digits of year; 00..99
      y: function () { return (String(f.Y())).slice(-2); },

      /* Time */
      // am or pm
      a: function () { return jsdate.getHours() > 11 ? 'pm' : 'am'; },

      // AM or PM
      A: function () { return f.a().toUpperCase(); },

      // Swatch Internet time; 000..999
      B: function () {
        var H = jsdate.getUTCHours() * 3600; // Hours
        var i = jsdate.getUTCMinutes() * 60; // Minutes
        var s = jsdate.getUTCSeconds(); // Seconds
        return _pad(Math.floor((H + i + s + 3600) / 86.4) % 1000, 3);
      },

      // 12-Hours; 1..12
      g: function () { return f.G() % 12 || 12; },

      // 24-Hours; 0..23
      G: function () { return jsdate.getHours(); },

      // 12-Hours w/leading 0; 01..12
      h: function () { return _pad(f.g(), 2); },

      // 24-Hours w/leading 0; 00..23
      H: function () { return _pad(f.G(), 2); },

      // Minutes w/leading 0; 00..59
      i: function () { return _pad(jsdate.getMinutes(), 2); },

      // Seconds w/leading 0; 00..59
      s: function () { return _pad(jsdate.getSeconds(), 2); },

      // Microseconds; 000000-999000
      u: function () { return _pad(jsdate.getMilliseconds() * 1000, 6); },

      // DST observed?; 0 or 1
      I: function () {
        // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
        // If they are not equal, then DST is observed.
        var Y = f.Y();
        return 0 + ((new Date(Y, 0) - Date.UTC(Y, 0)) !== (new Date(Y, 6) - Date.UTC(Y, 6)));
      },

      // Difference to GMT in hour format; e.g. +0200
      O: function () {
        var tzo = jsdate.getTimezoneOffset();
        var tzoNum = Math.abs(tzo);
        return (tzo > 0 ? '-' : '+') + _pad(Math.floor(tzoNum / 60) * 100 + tzoNum % 60, 4);
      },

      // Difference to GMT w/colon; e.g. +02:00
      P: function () {
        var O = f.O();
        return (O.substr(0, 3) + ':' + O.substr(3, 2));
      },

      // Timezone offset in seconds (-43200..50400)
      Z: function () { return -jsdate.getTimezoneOffset() * 60; },

      // Full Date/Time, ISO-8601 date
      c: function () { return 'Y-m-d\\Th:i:sP'.replace(formatChr, formatChrCb); },

      // RFC 2822
      r: function () { return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb); },

      // Seconds since UNIX epoch
      U: function () { return jsdate.getTime() / 1000 || 0; }
    };    

    return format.replace(formatChr, formatChrCb);
  };


  /**
   * format number by adding thousands separaters and significant digits while rounding
   */
  humanize.numberFormat = function(number, decimals, decPoint, thousandsSep) {
    decimals = isNaN(decimals) ? 2 : Math.abs(decimals);
    decPoint = (typeof decPoint === undefinedString) ? '.' : decPoint;
    thousandsSep = (typeof thousandsSep === undefinedString) ? ',' : thousandsSep;

    var sign = number < 0 ? '-' : '';
    number = Math.abs(+number || 0)

    var intPart = parseInt(number.toFixed(decimals)) + '';
    var j = intPart.length > 3 ? intPart.length % 3 : 0;

    return sign + (j ? intPart.substr(0, j) + thousandsSep : '') + intPart.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep) + (decimals ? decPoint + Math.abs(number - intPart).toFixed(decimals).slice(2) : '');
  };


  /**
   * For dates that are the current day or within one day, return 'today', 'tomorrow' or 'yesterday', as appropriate.
   * Otherwise, format the date using the passed in format string.
   *
   * Examples (when 'today' is 17 Feb 2007):
   * 16 Feb 2007 becomes yesterday.
   * 17 Feb 2007 becomes today.
   * 18 Feb 2007 becomes tomorrow.
   * Any other day is formatted according to given argument or the DATE_FORMAT setting if no argument is given.
   */
  humanize.naturalDay = function(timestamp, format) {
    timestamp = (typeof timestamp === undefinedString) ? humanize.time() : timestamp;
    format = (typeof format === undefinedString) ? 'Y-m-d' : format;

    var oneDay = 86400;
    var d = new Date();

    var today = (new Date(d.getFullYear(), d.getMonth(), d.getDate())).getTime() / 1000;

    if (timestamp < today && timestamp >= today - oneDay) {
      return 'yesterday';
    } else if (timestamp >= today && timestamp < today + oneDay) {
      return 'today';
    } else if (timestamp >= today + oneDay && timestamp < today + 2 * oneDay) {
      return 'tomorrow';
    }

    return humanize.date(format, timestamp);
  };

  // TODO: FIX THIS
  /**
   * returns a string representing how many seconds, minutes or hours ago it was
   * falling back to a longer date format if the value is more than a day old.
   * In case the datetime value is in the future the return value will automatically use an appropriate phrase.
   *
   * Examples (when ‘now’ is 17 Feb 2007 16:30:00):
   *
   * 17 Feb 2007 16:30:00 becomes now.
   * 17 Feb 2007 16:29:31 becomes 29 seconds ago.
   * 17 Feb 2007 16:29:00 becomes a minute ago.
   * 17 Feb 2007 16:25:35 becomes 4 minutes ago.
   * 17 Feb 2007 15:30:29 becomes an hour ago.
   * 17 Feb 2007 13:31:29 becomes 2 hours ago.
   * 16 Feb 2007 13:31:29 becomes 1 day ago.
   * 17 Feb 2007 16:30:30 becomes 29 seconds from now.
   * 17 Feb 2007 16:31:00 becomes a minute from now.
   * 17 Feb 2007 16:34:35 becomes 4 minutes from now.
   * 17 Feb 2007 16:30:29 becomes an hour from now.
   * 17 Feb 2007 18:31:29 becomes 2 hours from now.
   * 18 Feb 2007 16:31:29 becomes 1 day from now.
   */
  humanize.naturalTime = function(timestamp, format) {
    timestamp = (typeof timestamp === undefinedString) ? humanize.time() : timestamp;
    format = (typeof format === undefinedString) ? 'g:ia' : format;

    var d = new Date();
    var today = (new Date(d.getFullYear(), d.getMonth(), d.getDate())).getTime() / 1000;
    var relativeTime = null;

    // if it is within today
    if (timestamp >= today && timestamp < today + 86400) {
      var now = humanize.time();
      var hour = 60 * 60;

      // if timestamp passed in was after an hour ago
      if (timestamp > now - hour) {
        var seconds = Math.round(timestamp - now);
        var minutes = Math.round(seconds/60);

        if (timestamp > now) {
          /* future */
          // if more than 60 minutes ago, report in hours
          if (!minutes) {
            relativeTime = 'in ' + seconds + ' seconds';
            if (seconds <= 10) {
              relativeTime = 'now'
            }
          } else {
            relativeTime = 'in ' + minutes + ' minutes';
            if (minutes === 1) {
              relativeTime = 'in one minute';
            } else if (minutes > 60) {
              relativeTime = 'in about ' + Math.round(minutes/60) + ' hours';
            }
          }

        } else {
          /* past */
          if (!minutes) {
            relativeTime = seconds + ' seconds ago';
            if (seconds <= 0) {
              relativeTime = 'just now'
            }
          } else {
            relativeTime = minutes + ' minutes ago';
            if (minutes === 1) {
              relativeTime = 'one minute ago';
            }
          }
        }
      }

    }

    return relativeTime ? relativeTime : humanize.date(format, timestamp);
  };

  /**
   * Converts an integer to its ordinal as a string.
   *
   * 1 becomes 1st
   * 2 becomes 2nd
   * 3 becomes 3rd etc
   */
  humanize.ordinal = function(number) {
    number = parseInt(number, 10);
    number = isNaN(number) ? 0 : number;
    var sign = number < 0 ? '-' : '';
    number = Math.abs(number);

    return sign + number + (number > 4 && number < 21 ? 'th' : {1: 'st', 2: 'nd', 3: 'rd'}[number % 10] || 'th');
  };

  /**
   * Formats the value like a 'human-readable' file size (i.e. '13 KB', '4.1 MB', '102 bytes', etc).
   *
   * For example:
   * If value is 123456789, the output would be 117.7 MB.
   */
  humanize.filesize = function(filesize, kilo, decimals, decPoint, thousandsSep) {
    kilo = (typeof kilo === undefinedString) ? 1024 : kilo;
    decimals = isNaN(decimals) ? 2 : Math.abs(decimals);
    decPoint = (typeof decPoint === undefinedString) ? '.' : decPoint;
    thousandsSep = (typeof thousandsSep === undefinedString) ? ',' : thousandsSep;
    if (filesize <= 0) { return '0 bytes'; }

    var thresholds = [1];
    var units = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb'];
    if (filesize < kilo) { return humanize.numberFormat(filesize, 0) + ' ' + units[0]; }

    for (var i = 1; i < units.length; i++) {
      thresholds[i] = thresholds[i-1] * kilo;
      if (filesize < thresholds[i]) {
        return humanize.numberFormat(filesize / thresholds[i-1], decimals, decPoint, thousandsSep) + ' ' + units[i-1];
      }
    }

    // use the last unit if we drop out to here
    return humanize.numberFormat(filesize / thresholds[units.length - 1], decimals, decPoint, thousandsSep) + ' ' + units[units.length - 1];
  };

  /**
   * Replaces line breaks in plain text with appropriate HTML
   * A single newline becomes an HTML line break (<br />) and a new line followed by a blank line becomes a paragraph break (</p>).
   * 
   * For example:
   * If value is Joel\nis a\n\nslug, the output will be <p>Joel<br />is a</p><p>slug</p>
   */
  humanize.linebreaks = function(str) {
    // remove beginning and ending newlines
    str = str.replace(/^([\n|\r]*)/, '');
    str = str.replace(/([\n|\r]*)$/, '');

    // normalize all to \n
    str = str.replace(/(\r\n|\n|\r)/g, "\n");

    // any consecutive new lines more than 2 gets turned into p tags
    str = str.replace(/(\n{2,})/g, '</p><p>');

    // any that are singletons get turned into br
    str = str.replace(/\n/g, '<br />');
    return '<p>' + str + '</p>';
  };

  /**
   * Converts all newlines in a piece of plain text to HTML line breaks (<br />).
   */
  humanize.nl2br = function(str) {
    return str.replace(/(\r\n|\n|\r)/g, '<br />');
  };

  /**
   * Truncates a string if it is longer than the specified number of characters.
   * Truncated strings will end with a translatable ellipsis sequence ('…').
   */
  humanize.truncatechars = function(string, length) {
    if (string.length <= length) { return string; }
    return string.substr(0, length) + '…';
  };

  /**
   * Truncates a string after a certain number of words.
   * Newlines within the string will be removed.
   */
  humanize.truncatewords = function(string, numWords) {
    var words = string.split(' ');
    if (words.length < numWords) { return string; }
    return words.slice(0, numWords).join(' ') + '…';
  };

}).call(this);
