'use strict';
var fetchSong = require('./songs').fetchSong

module.exports = {
  all: async function(ctx, songid) {
    const song = await fetchSong(ctx, songid);
    ctx.body = song.lineDistributions;
  },

  fetch: async function(ctx, songid, ldid) {
    // TODO: you only need to fetch the ldid from linedists
    const song = await fetchSong(ctx, songid);
    const dists = song.lineDistributions.filter(function(x) {
      return x._id === ldid;
    });
    if (dists.length === 0) {
      ctx.throw(404);
    }
    ctx.body = dists[0];  // TODO: needs proper error handling
  },

  add: async function(ctx, songid) {
    var body = ctx.request.body;
    console.log(body);
    var song = await fetchSong(ctx, songid);
    console.log(song);
    song.lineDistributions.push(body);
    // TODO: validate line dist and update db
    await song.save();
    ctx.body = song.lineDistributions;
  }
}
