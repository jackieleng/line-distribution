'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Percentage for a single member
var linePercentageSchema = Schema({
  member: {type: String, required: true},
  percentage: Number,
  duration_ms: Number
});

// TODO: make own model after all?
// Line distribution for all members
var lineDistributionSchema = Schema({
  source: String,
  distribution: [linePercentageSchema]
});

var songSchema = Schema({
  title: {type: String, required: true},
  artists: [{type: Schema.Types.ObjectId, ref: 'Artist'}],
  duration_ms: Number,
  //linedistributions: {type: Array, default: []}
  lineDistributions: [lineDistributionSchema]
});

var artistSchema = Schema({
  name: {type: String, required: true},
  //songs: [{type: Schema.Types.ObjectId, ref: 'Song'}]
  //songs: [songSchema]
});

module.exports = {
  Artist: mongoose.model('Artist', artistSchema),
  Song: mongoose.model('Song', songSchema)

  // Unsure if necessary. We could just make an endpoint
  // songs/<songid>/linedistributions on which we can implement `list` and
  // `create` methods. A api/linedistributions endpoint would then not be very
  // necessary.
  //LineDistribution: mongoose.model('LineDistribution', lineDistributionSchema)
}
