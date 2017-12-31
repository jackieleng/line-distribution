'use strict';
var LineDistribution = require('../models').LineDistribution
var Song = require('../models').Song

/*
 * Sum line distributions percentages by member.
 */
function sumLineDistributions(lines) {
  let sumDistribs = {};
  // TODO: better to use Array.prototype.reduce
  // or use the agg methods from mongodb?
  lines.forEach(function(line) {
    line.distribution.forEach(function(elm) {
      if (sumDistribs[elm.member] === undefined) {
        sumDistribs[elm.member] = {};
        sumDistribs[elm.member].count = 1;
        sumDistribs[elm.member].sumPercentage = elm.percentage;
      } else {
        sumDistribs[elm.member].count++;
        sumDistribs[elm.member].sumPercentage += elm.percentage;
      }
    });
  });
  return sumDistribs;
}

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

    let stats = ctx.query.stats;
    switch(stats) {
      case 'sum':
      case 'avg':
        let sumDistribs = sumLineDistributions(lines);

        if (stats === 'avg') {
          Object.entries(sumDistribs).forEach(function([k, v]) {
            v.averagePercentage = v.sumPercentage / v.count;
            delete v.sumPercentage;
          });
          ctx.body = sumDistribs;
        } else {
          ctx.body = sumDistribs;
        }
        break;
      case 'max':
        // TODO: take the max of all members, i.e.
        // just like avg/sum, but the max over all line dists
      case undefined:
        ctx.body = lines;
        break;
      default:
        break;
    }
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
