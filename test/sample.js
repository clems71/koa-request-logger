const Koa = require('koa');
const route = require('koa-route');

const app = new Koa();

const koaRequestLogger = require('..');
const consoleBackend = require('../backends/console');

// logger setup
app.use(koaRequestLogger(consoleBackend()));

app.use(
  route.get('/', ctx => {
    ctx.body = {
      status: 'up',
      info: 'sample server to test koa-request-logger'
    };
  })
);

app.listen(8080);
console.log('listening on port 8080');
