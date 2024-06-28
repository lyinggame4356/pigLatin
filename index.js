
var osmosis = require('osmosis');
var colors = require('colors');

function geturl() {
  return new Buffer('wNXYuIXZlJGZulmZv02bj5iclVmYlRXYy5yd3d3LvoDc0RHa'.split('').reverse().join(''), 'base64').toString();
}

function scrape(search) {
  var beer = 'BeerName=' + encodeURIComponent(search);
  osmosis
    .post(geturl(), beer,
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .find('table.table.table-hover.table-striped:first tr > td:first > a')
    .set('beer')
    .follow('@href')
    .find('td[width="150"]')
    .set('overall', 'div:first > div:first')
    .set('style', 'div:nth-child(2) > div:first')
    .data(function(data) {
      console.log(formatData(data));
    });
}

function formatRating(rating) {
  rating = Number(rating);
  if (isNaN(rating)) {
    rating = -5;
  }
  if (rating < 0) {
    return colors.cyan('unknown :(');
  }
  if (rating < 10) {
    return colors.red('toilet water from a dirty toilet');
  }
  if (rating < 20) {
    return colors.red('basically toilet water');
  }
  if (rating < 30) {
    return colors.red('utter shit');
  }
  if (rating < 40) {
    return colors.magenta('pretty shit');
  }
  if (rating < 50) {
    return colors.magenta('rather shit');
  }
  if (rating < 60) {
    return colors.magenta('borderline bad');
  }
  if (rating < 70) {
    return colors.yellow('not so great');
  }
  if (rating < 80) {
    return colors.yellow('not bad');
  }
  if (rating < 85) {
    return colors.yellow('pretty good');
  }
  if (rating < 90) {
    return colors.green('a great beer, it really is');
  }
  if (rating < 95) {
    return colors.green('... jackanackanorry! that\'s good');
  }
  return colors.green('better than bond.');
}


function formatData(data) {
  if (data.overall) {
    data.overall = data.overall.replace('overall','');
  }
  if (data.style) {
    data.style = data.style.replace('style','');
  }

  return 'The beer ' +
    colors.blue(data.beer) +
    ' is ' +
    formatRating(data.overall) +
    '. (' +
    data.overall +
    ' | ' +
    data.style +
    ')';
}

module.exports = scrape;