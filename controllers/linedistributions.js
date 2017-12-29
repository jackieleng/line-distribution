'use strict';
var LineDistribution = require('../models').LineDistribution
var Song = require('../models').Song

module.exports = {
  all: async function(ctx) {
    ctx.body = await LineDistribution.find({}).populate('song');
  },

  byArtist: async function(ctx) {
    var songs = await Song.find({artists: ctx.params.artistid}).populate('artists');
    let lines = await LineDistribution.find({song: {$in: songs}}).populate('song');

    // Fixup the fact that we can't populate refs in refs (artists in this case)
    lines.forEach(function(line) {
      let song = songs.find(song => song._id.equals(line.song._id));
      line.song.artists = song.artists;
    });
    ctx.body = lines;
    // ctx.body = await LineDistribution.find({"song.artists": ctx.params.artistid});
  },

  fetch: async function(ctx) {
    ctx.body = await LineDistribution.findById(ctx.params.id);
  },

  add: async function(ctx) {
    var body = ctx.request.body;
    console.log(body);
    var song = await fetchSong(ctx, ctx.params.songid);
    console.log(song);
    song.lineDistributions.push(body);
    // TODO: validate line dist and update db
    await song.save();
    ctx.body = song.lineDistributions;
  }
}
