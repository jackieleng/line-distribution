'use strict';

const Koa = require('koa');
const logger = require('koa-logger');
const json = require('koa-json')
const bodyParser = require('koa-bodyparser');
const db = require('./db');  // This connects to mongodb
const router = require('./routes').router;

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

// add routes

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);

// TODO: enable debug mode for dev
