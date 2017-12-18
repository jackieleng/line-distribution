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
  .get('/artists/:artistid', artists.fetch)

  .get('/songs', songs.all)
  .get('/songs/:songid', songs.fetch)
  .post('/songs', songs.add)
  .put('/songs/:songid', songs.update)
//.patch('/songs/:id', songs.modify)
  .delete('/songs/:songid', songs.remove)

//.get('/linedists/', linedists.all)
  .get('/linedistributions', linedistributions.all)
  .get('/linedistributions/:ldid', linedistributions.fetch)
  .post('/linedistributions', linedistributions.add);

module.exports.router = router;
