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
  var price = candle.close;

  if(price < this.settings.buyPrice && !this.boughtAtPrice) {
    log.debug('Buy price is:', this.settings.buyPrice)
    log.debug('Buying at price:', price);
    this.boughtAtPrice = price
    this.advice('long')
  } else if(price > this.settings.sellPrice && this.boughtAtPrice) {
    log.debug('Sell price is:', this.settings.sellPrice);
    log.debug('Selling at price:', price);
    log.debug('Estimated profit:', price - this.boughtAtPrice);
    this.boughtAtPrice = undefined
    this.advice('short')
  } else this.advice()
}

module.exports = method;

