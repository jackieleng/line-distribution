// TODO: this script doesn't work because `disconnect()` is called
// asynchronously and will be executed before the DB objects are created.
// It needs to be wrapped in async or using promises
'use strict';

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/kpop');
console.log("We're connected to mongodb!");

var models = require('../models');

// Generate artists
const artists = {
  blackpink: new models.Artist({name: 'Blackpink'}),
  twice: new models.Artist({name: 'Twice'}),
};
Object.entries(artists).forEach(function([ , artist]) {
  artist.save();
});

// Generate songs
const songs = {
  aiiyl: new models.Song({
    title: "As If It's Your Last",
    artists: artists.blackpink,
  }),
  pwf: new models.Song({
    title: "Playing With Fire",
    artists: artists.blackpink,
  }),
  tt: new models.Song({
    title: "TT",
    artists: artists.twice,
  }),
};
Object.entries(songs).forEach(function([ , song]) {
  song.save();
});

// Generate line distributions
const lines = [
  new models.LineDistribution({
    song: songs.aiiyl,
    source: "Internet",
    distribution: [
      { member: "Jennie", percentage: 25 },
      { member: "Jisoo", percentage: 25 },
      { member: "Lisa", percentage: 25 },
      { member: "Rose", percentage: 25 }
    ],
  }),
  new models.LineDistribution({
    song: songs.pwf,
    source: "Internet",
    distribution: [
      { member: "Jennie", percentage: 25 },
      { member: "Jisoo", percentage: 15 },
      { member: "Lisa", percentage: 40 },
      { member: "Rose", percentage: 20 }
    ],
  }),
  new models.LineDistribution({
    song: songs.tt,
    source: "Internet",
    distribution: [
      { member: "Tzuyu", percentage: 10, },
      { member: "Momo", percentage: 10, },
      { member: "Sana", percentage: 10, },
      { member: "Mina", percentage: 10, },
      { member: "Nayeon", percentage: 10, },
      { member: "Dahyun", percentage: 10, },
      { member: "Jihyo", percentage: 10, },
      { member: "Chaeyeong", percentage: 10, },
      { member: "Jeongyeon", percentage: 10, },
    ],
  }),
];
lines.forEach(function(lineDistribution) {
  lineDistribution.save();
});


console.log("Done");
mongoose.disconnect();
console.log("Disconnected");
