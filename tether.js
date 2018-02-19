// helpers
var _ = require('lodash');
var log = require('../core/log.js');

// let's create our own method
var method = {};

// prepare everything our method needs
method.init = function() {
  this.name = 'Tether';
  this.requiredHistory = this.tradingAdvisor.historySize;

  this.boughtAtPrice = undefined

  const fee = this.settings.fee * 2
  this.delta = (this.settings.profit + fee) / 2 / 100

  // define the indicators we need
  this.addIndicator('sma', 'SMA', this.settings.smaLength);
}

// what happens on every new candle?
method.update = function(candle) {
  // nothing!
}

// for debugging purposes: log the last calculated
// EMAs and diff.
method.log = function() {
}

method.check = function(candle) {
  const average = this.indicators.sma.result;
  const price = candle.close;

  if(!this.boughtAtPrice && (average - price) / average > this.delta) {
    log.debug('Average price is:', average);
    log.debug('Buying at price:', price);
    this.boughtAtPrice = price;
    this.advice('long')
  } else if(this.boughtAtPrice && (price - average) / average > this.delta) {
    log.debug('Average price is:', average);
    log.debug('Selling at price:', price);
    log.debug('Estimated profit:', price - this.boughtAtPrice);
    this.boughtAtPrice = undefined;
    this.advice('short');
  } else this.advice();
}

module.exports = method;

