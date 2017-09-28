'use strict';
var models = require('../models');
var Artist = models.Artist;

module.exports = {
  all: async function(ctx) {
    ctx.body = await Artist.find({});
  },

  fetch: async function(ctx, artistId) {
    ctx.body = await Artist.findOne({_id: artistId});
  }
}
