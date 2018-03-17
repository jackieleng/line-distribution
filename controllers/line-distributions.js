'use strict';
var models = require('../models');
var LineDistribution = models.LineDistribution;
var Song = models.Song;

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
        sumDistribs[elm.member].count = 0;
        sumDistribs[elm.member].sumPercentage = 0;
      }
      sumDistribs[elm.member].count++;
      sumDistribs[elm.member].sumPercentage += elm.percentage;
    });
  });
  return sumDistribs;
}

/*
 * Max value of line distributions percentages by member.
 */
function maxLineDistributions(lines) {
  let memberStats = {};
  // TODO: better to use Array.prototype.reduce
  // or use the agg methods from mongodb?
  lines.forEach(function(line) {
    line.distribution.forEach(function(elm) {
      if (memberStats[elm.member] === undefined) {
        memberStats[elm.member] = {};
        memberStats[elm.member].count = 1;
        memberStats[elm.member].maxPercentage = elm.percentage;
      } else {
        memberStats[elm.member].count++;
        if (elm.percentage > memberStats[elm.member].maxPercentage) {
          memberStats[elm.member].maxPercentage = elm.percentage;
        }
      }
    });
  });
  return memberStats;
}

/*
 * Min value of line distributions percentages by member.
 */
function minLineDistributions(lines) {
  let memberStats = {};
  // TODO: better to use Array.prototype.reduce
  // or use the agg methods from mongodb?
  lines.forEach(function(line) {
    line.distribution.forEach(function(elm) {
      if (memberStats[elm.member] === undefined) {
        memberStats[elm.member] = {};
        memberStats[elm.member].count = 1;
        memberStats[elm.member].minPercentage = elm.percentage;
      } else {
        memberStats[elm.member].count++;
        if (elm.percentage < memberStats[elm.member].minPercentage) {
          memberStats[elm.member].minPercentage = elm.percentage;
        }
      }
    });
  });
  return memberStats;
}

async function lineDistributionByArtist(artistId, stats) {
  let songs = await Song.find({artists: artistId}).populate('artists');
  let lines = await LineDistribution.find({song: {$in: songs}}).populate('song');

  // Fixup the fact that we can't populate refs in refs (artists in this case)
  lines.forEach(function(line) {
    let song = songs.find(song => song._id.equals(line.song._id));
    line.song.artists = song.artists;
  });


  let distrib;
  switch(stats) {
    case 'sum':
      var sumDistribs = sumLineDistributions(lines);
      distrib = sumDistribs;
      break;
    case 'avg':
      var sumDistribs = sumLineDistributions(lines);
      Object.entries(sumDistribs).forEach(function([k, v]) {
        v.averagePercentage = v.sumPercentage / v.count;
        delete v.sumPercentage;
      });
      distrib = sumDistribs;
      break;
    case 'max':
      distrib = maxLineDistributions(lines);
      break;
    case 'min':
      distrib = minLineDistributions(lines);
      break;
    case undefined:
      distrib = lines;
      break;
    default:
      break;
  }
  return distrib;
}

module.exports = {
  all: async function(ctx) {
    ctx.body = await LineDistribution.find({}).populate('song');
  },

  /*
   * Fetch line distributions by `artistid`.
   *
   * This function also supports statistics using the `&stats=...` parameter.
   */
  byArtist: async function(ctx) {
    let artistId = ctx.params.artistid;
    let stats = ctx.query.stats;
    ctx.body = await lineDistributionByArtist(artistId, stats);
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
