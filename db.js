'use strict';

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/kpop', {useMongoClient: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("We're connected to mongodb!");
});

module.exports = db;
