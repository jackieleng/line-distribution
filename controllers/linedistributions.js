'use strict';
var LineDistribution = require('../models').LineDistribution

module.exports = {
  all: async function(ctx) {
    ctx.body = await LineDistribution.find({});
  },

  fetch: async function(ctx, ldid) {
    ctx.body = await LineDistribution.findOne({_id: ldid});
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
