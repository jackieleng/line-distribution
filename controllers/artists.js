'use strict';
var models = require('../models');
var Artist = models.Artist;

module.exports = {
  all: async function(ctx) {
    ctx.body = await Artist.find({});
  },

  fetch: async function(ctx) {
    ctx.body = await Artist.findById(ctx.params.id);
  },

  add: async function(ctx) {
    let body = ctx.request.body;
    let artist = new Artist(body);
    await artist.save();
    ctx.body = artist;
  },

  remove: async function(ctx) {
    await Artist.findByIdAndRemove(ctx.params.id);
    ctx.response.status = 204;
  },
}
