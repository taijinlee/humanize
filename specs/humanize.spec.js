var should = require('should');
var humanize = require('../humanize');
process.env.TZ = 'America/Los_Angeles';

describe('humanize:', function() {

  describe('#pad', function() {
    it('should be able to pad on the left', function() {
      humanize.pad(123, 4, '0').should.equal('0123');
      humanize.pad('abcd', 3, 'c').should.equal('abcd');
      humanize.pad('cool', 7, 'Blah').should.equal('BBBcool');
    });

    it('should be able to pad on the right', function() {
      humanize.pad(123, 4, '0', 'right').should.equal('1230');
      humanize.pad('abcd', 3, 'c', 'right').should.equal('abcd');
      humanize.pad('cool', 7, 'Blah', 'right').should.equal('coolBBB');
    });
  });


  describe('#time', function() {
    it('should be able to get the current time', function() {
      // I'm not sure how to make this better yet ...
      parseInt(humanize.time()).should.equal(parseInt(new Date().getTime() / 1000, 10));
    });
  });

  describe('#date', function() {
    var timestamps = require('./dateData.js')().timestamps;

    it('should be able to accept timestamp, js date object, or nothing', function() {
      var timestamp = 514088627;
      var today = new Date();
      humanize.date('Y-m-d').should.equal(today.getFullYear() + '-' + humanize.pad(today.getMonth() + 1, 2, '0') + '-' + humanize.pad(today.getDate(), 2, '0'));
      humanize.date('Y-m-d', timestamp).should.equal('1986-04-16');
      humanize.date('Y-m-d', new Date(timestamp * 1000)).should.equal('1986-04-16');
    });

    it('should be able to print out escaped characters', function() {
      var timestamp = 514088627;
      var today = new Date();
      humanize.date('Y-m-d\\Y\\z\\d').should.equal(today.getFullYear() + '-' + humanize.pad(today.getMonth() + 1, 2, '0') + '-' + humanize.pad(today.getDate(), 2, '0') + 'Yzd');
      humanize.date('Y-m-d\\Y\\z\\d', timestamp).should.equal('1986-04-16Yzd');
      humanize.date('Y-m-d\\Y\\z\\d', new Date(timestamp * 1000)).should.equal('1986-04-16Yzd');
    });

    it('should be able to replace correct information', function() {
      for (var timestamp in timestamps) {
        for (var dateVal in timestamps[timestamp]) {
          var info = 'timestamp: ' + timestamp + ' dateVal: ' + dateVal;
          humanize.date(dateVal, timestamp).should.eql(timestamps[timestamp][dateVal], info);
        }
      }
    });

  });


  describe('#numberFormat', function() {
    var number = 1234567.1234567;
    var negNumber = -1234567.1234567;
    it('should default using 2 decimals, "." as decimal point, "," as thousands separator', function() {
      humanize.numberFormat(number).should.equal('1,234,567.12');
    });

    it('should be able to deal with different number of decimals properly + rounding', function() {
      humanize.numberFormat(number, 0).should.equal('1,234,567');
      humanize.numberFormat(number, 3).should.equal('1,234,567.123');
      humanize.numberFormat(number, 4).should.equal('1,234,567.1235');
      humanize.numberFormat(number, 5).should.equal('1,234,567.12346');
      humanize.numberFormat(number, 6).should.equal('1,234,567.123457');
      humanize.numberFormat(number, 7).should.equal('1,234,567.1234567');
      humanize.numberFormat(number, 8).should.equal('1,234,567.12345670');
      humanize.numberFormat(number, 9).should.equal('1,234,567.123456700');

      humanize.numberFormat(negNumber, 0).should.equal('-1,234,567');
      humanize.numberFormat(negNumber, 3).should.equal('-1,234,567.123');
      humanize.numberFormat(negNumber, 4).should.equal('-1,234,567.1235');
      humanize.numberFormat(negNumber, 5).should.equal('-1,234,567.12346');
      humanize.numberFormat(negNumber, 6).should.equal('-1,234,567.123457');
      humanize.numberFormat(negNumber, 7).should.equal('-1,234,567.1234567');
      humanize.numberFormat(negNumber, 8).should.equal('-1,234,567.12345670');
      humanize.numberFormat(negNumber, 9).should.equal('-1,234,567.123456700');
    });

    it('should be able to deal with negative decimals as if they were positive', function() {
      humanize.numberFormat(number, -3).should.equal(humanize.numberFormat(number, 3));
    });

    it('should be able to change the decimal point to a different string', function() {
      humanize.numberFormat(number, 3, 'P').should.equal('1,234,567P123');
      humanize.numberFormat(number, 3, ',').should.equal('1,234,567,123');
      humanize.numberFormat(number, 3, 'what?').should.equal('1,234,567what?123');
    });

    it('should be able to change the thousands separator to a different string', function() {
      humanize.numberFormat(number, 3, '.', '.').should.equal('1.234.567.123');
      humanize.numberFormat(number, 3, ',', '.').should.equal('1.234.567,123');
      humanize.numberFormat(number, 3, '.', 'huh?').should.equal('1huh?234huh?567.123');
    });
  });

  describe('#naturalDay', function() {
    // fill in later...
  });

  describe('#naturalTime', function() {
    // fill in later...
  });

  describe('#ordinal', function() {
    it('should be able to return the correct ordinal string', function() {
      var tests = {
        0: '0th',
        1: '1st',
        2: '2nd',
        3: '3rd',
        4: '4th',
        5: '5th',
        11: '11th',
        12: '12th',
        13: '13th',
        21: '21st',
        31: '31st',
        32: '32nd',
        43: '43rd',
        '87 Street': '87th',
        '223 APT 23': '223rd',
        'APT': '0th',
        '-1': '-1st',
        '-2': '-2nd',
        '-3': '-3rd'
      };

      for (var num in tests) {
        humanize.ordinal(num).should.equal(tests[num]);
      }
    });
  });


  describe('#filesize', function() {
    it('should be able to use the defaults properly', function() {
      humanize.filesize(12).should.equal('12 bytes');
      humanize.filesize(1021).should.equal('1,021 bytes');
      humanize.filesize(1024).should.equal('1.00 Kb');

      humanize.filesize(Math.pow(1024, 2)).should.equal('1.00 Mb');
      humanize.filesize(Math.pow(1024, 3)).should.equal('1.00 Gb');
      humanize.filesize(Math.pow(1024, 4)).should.equal('1.00 Tb');
      humanize.filesize(Math.pow(1024, 5)).should.equal('1.00 Pb');
      humanize.filesize(Math.pow(1024, 6)).should.equal('1,024.00 Pb');
      humanize.filesize(1234567890).should.equal('1.15 Gb');
    });

    it('should be able to change kilo to a different value', function() {
      humanize.filesize(12, 1000).should.equal('12 bytes');
      humanize.filesize(1021, 1000).should.equal('1.02 Kb');
      humanize.filesize(1024, 1000).should.equal('1.02 Kb');
      humanize.filesize(Math.pow(1024, 2), 1000).should.equal('1.05 Mb');
      humanize.filesize(Math.pow(1024, 3), 1000).should.equal('1.07 Gb');
      humanize.filesize(Math.pow(1024, 4), 1000).should.equal('1.10 Tb');
      humanize.filesize(Math.pow(1024, 5), 1000).should.equal('1.13 Pb');
      humanize.filesize(Math.pow(1024, 6), 1000).should.equal('1,152.92 Pb');
      humanize.filesize(1234567890, 1000).should.equal('1.23 Gb');
    });
  });


  describe('#linebreaks', function() {
    it('should wrap the string with <p> tags', function() {
      humanize.linebreaks('').should.equal('<p></p>');
    });

    it('should remove new lines at beginning and end', function() {
      humanize.linebreaks("Foo\n\nBar\n\n\n").should.equal('<p>Foo</p><p>Bar</p>');
      humanize.linebreaks("\n\r\n\rFoo\n\nBar").should.equal('<p>Foo</p><p>Bar</p>');
    });

    it('should change all new lines into <br> tags', function() {
      humanize.linebreaks("Foo\nBar").should.equal('<p>Foo<br />Bar</p>');
      humanize.linebreaks("Foo\nBar\r\nBlah").should.equal('<p>Foo<br />Bar<br />Blah</p>');
    });

    it('should change all multi-new lines into <p> tags', function() {
      humanize.linebreaks("Foo\n\nBar").should.equal('<p>Foo</p><p>Bar</p>');
      humanize.linebreaks("Foo\n\n\nBar").should.equal('<p>Foo</p><p>Bar</p>');
      humanize.linebreaks("Foo\n\n\r\nBar").should.equal('<p>Foo</p><p>Bar</p>');
      humanize.linebreaks("Foo\n\n\r\n\rBar").should.equal('<p>Foo</p><p>Bar</p>');
    });
  });

  describe('#nl2br', function() {
    it('should change any type of new line into a <br />', function() {
      humanize.nl2br('').should.equal('');
      humanize.nl2br("\n").should.equal('<br />');
      humanize.nl2br("\r").should.equal('<br />');
      humanize.nl2br("\r\n").should.equal('<br />');
      humanize.nl2br("Foo\nBar").should.equal('Foo<br />Bar');
      humanize.nl2br("\r\nFoo\nBar\n").should.equal('<br />Foo<br />Bar<br />');
      humanize.nl2br("\r\r\n\nFoo\nBar\n\n\r\n\r").should.equal('<br /><br /><br />Foo<br />Bar<br /><br /><br /><br />');
    });
  });

  describe('#truncatechars', function() {
    it('should be able to truncate characters properly', function() {
      humanize.truncatechars('foobar', 0).should.equal('…');
      humanize.truncatechars('foobar', 1).should.equal('f…');
      humanize.truncatechars('foobar', 2).should.equal('fo…');
      humanize.truncatechars('foobar', 3).should.equal('foo…');
      humanize.truncatechars('foobar', 4).should.equal('foob…');
    });
  });

  describe('#truncatewords', function() {
    it('should be able to truncate words properly', function() {
      humanize.truncatewords('a b c d e', 0).should.equal('…');
      humanize.truncatewords('a b c d e', 1).should.equal('a…');
      humanize.truncatewords('a b c d e', 2).should.equal('a b…');
      humanize.truncatewords('a b c d e', 3).should.equal('a b c…');
      humanize.truncatewords('a b c d e', 4).should.equal('a b c d…');
    });
  });



});
