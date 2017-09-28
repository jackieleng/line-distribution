'use strict';

// This is a bad idea. Since it is one-to-one, just embed line dist into song

var db = require('./db')
var linedists = db.get('linedists');

module.exports.all = function *(next) {
  var dists =  yield linedists.find({});
  if (dists.length === 0) {
    this.throw(404, "No line dists found.")
    console.log(dists);
  }
  this.body = dists;
};
