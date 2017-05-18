# koa-request-logger

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

This is a Koa v2 middleware that logs all incoming requests. The library includes multiple logging backends:

- MongoDB : `require('koa-request-logger/backends/mongodb')`
- Console : `require('koa-request-logger/backends/console')`

The default log packet (the data that is logged to backend) includes the following fields:

- `path` : path without query string
- `method` : `'GET'`, `'POST'`, ...
- `origin` : origin of the request (can be an empty string)
- `userAgent` : user agent header
- `ip` : raw IP address (can be IPv6)
- `responseTime` : response time in ms
- `status` : integer status code
- `timestamp` : JavaScript timestamp (UNIX timestamp in ms)

If `geoTracking` is set to `true` in `requestLogger` options (the default), the log packet will also include a country field

- `country` : country code in ISO Alpha-2 representation

Please note that a backend might ignore some of these fields when storing logs.

## Console backend example

```js
const Koa = require('koa');

const requestLogger = require('koa-request-logger');
const consoleBackend = require('koa-request-logger/backends/console');

const app = new Koa();

// logger setup
app.use(requestLogger(consoleBackend()));

// all the following middleware go here
// ....
// ....
// ....

app.listen(8080);
console.log('listening on port 8080');
```
