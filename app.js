'use strict';

const Koa = require('koa');
const route = require('koa-route');
const logger = require('koa-logger');
const json = require('koa-json')
const bodyParser = require('koa-bodyparser');
const db = require('./db');  // This connects to mongodb
const songs = require('./controllers/songs');
const artists = require('./controllers/artists');
const linedistributions = require('./controllers/linedistributions');
//var linedists = require('./linedists');

const app = new Koa();

// logger (should be near top)

app.use(logger());

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// body parser (parsed in ctx.request.body)

app.use(bodyParser());

// prettify JSON response with /?pretty

app.use(json({pretty: false, param: 'pretty', spaces: 2}));

// routes  # TODO: use koa-router

app.use(route.get('/', index));
app.use(route.post('/', index));
app.use(route.get('/artists/', artists.all));
app.use(route.get('/artists/:artistid', artists.fetch));

app.use(route.get('/songs/', songs.all));
app.use(route.get('/songs/:songid', songs.fetch));
app.use(route.post('/songs/', songs.add));
app.use(route.put('/songs/:songid', songs.update));
//app.use(route.patch('/songs/:id', songs.modify));
app.use(route.delete('/songs/:songid', songs.remove));

//app.use(route.get('/linedists/', linedists.all));
app.use(route.get('/songs/:songid/linedistributions', linedistributions.all));
app.use(route.get('/songs/:songid/linedistributions/:ldid', linedistributions.fetch));
app.use(route.post('/songs/:songid/linedistributions', linedistributions.add));

// response

function index(ctx) {
  ctx.body = 'Home';
};

app.listen(3000);

// TODO: enable debug mode for dev
