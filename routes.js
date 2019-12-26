'use strict';

const Router = require('koa-router');
const home = require('./controllers/home');
const songs = require('./controllers/songs');
const artists = require('./controllers/artists');
const lineDistributions = require('./controllers/line-distributions');
//var linedists = require('./linedists');

// routes
var router = new Router();
router
  .get('/', home.index)

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

  .get('/lineDistributions', lineDistributions.all)
  .get('/lineDistributions/:id', lineDistributions.fetch)
  .post('/lineDistributions', lineDistributions.add)

  .get('/lineDistributionsByArtist/:artistid', lineDistributions.byArtist)
;

module.exports.router = router;
