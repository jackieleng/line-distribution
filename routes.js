'use strict';

const Router = require('koa-router');
const songs = require('./controllers/songs');
const artists = require('./controllers/artists');
const linedistributions = require('./controllers/linedistributions');
//var linedists = require('./linedists');

// home page
function index(ctx) {
  ctx.body = 'Home';
};

// routes
var router = new Router();
router
  .get('/', index)

  .get('/artists', artists.all)
  .get('/artists/:id', artists.fetch)
  .post('/artists', artists.add)
  .delete('/artists/:id', artists.remove)

  .get('/songs', songs.all)
  .get('/songs/:id', songs.fetch)
  .post('/songs', songs.add)
  .put('/songs/:id', songs.update)
//.patch('/songs/:id', songs.modify)
  .delete('/songs/:id', songs.remove)

  .get('/linedistributions', linedistributions.all)
  .get('/linedistributions/:id', linedistributions.fetch)
  .post('/linedistributions', linedistributions.add)

  .get('/linedistributionsByArtist/:artistid', linedistributions.byArtist)
;

module.exports.router = router;
