'use strict';
var models = require('../models');
var Song = models.Song;

/* Fetch song by ID
 * @param {object} ctx - The koa context
 * @param {string} songid - Song ID
 * @returns {object} Song object
 */
async function fetchSong(ctx, songid) {
  let res;
  try {
    res = await Song.findOne({_id: songid}).populate('artists');
  } catch (err) {
    console.log(err.message);
    ctx.throw(404, "Song not found.");
  }
  if (res === null) {
    ctx.throw(404, `No song found with id ${songid}`);
  }
  return res;
}

module.exports = {
  fetchSong: fetchSong,

  all: async function(ctx) {
    ctx.body = await Song.find({}).populate('artists');
  },

  fetch: async function(ctx, songid) {
    ctx.body = await fetchSong(ctx, songid);
  },

  // TODO: fix this function
  add: async function(ctx) {
    var body = ctx.request.body;
    console.log(body);
    var song = new Song(body);
    console.log(song);
    await song.save();
    ctx.body = song;
  },

  update: async function(songid) {
  },

  remove: async function(songid) {
  }
}
