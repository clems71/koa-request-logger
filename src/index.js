const { get, now } = require('lodash');
const { lookup } = require('geoip-lite');

/**
 * Create a request logger middleware.
 *
 * @param  {Backend} logBackend
 *
 * @param  {Object}  opts
 * @param  {Boolean} opts.geoTracking if set to true (default) it will log
 * country information too. This is extracted from IP.
 *
 * @return {KoaMiddleware}
 */
module.exports = function koaRequestLogger(
  logBackend,
  { geoTracking = true } = {}
) {
  if (!logBackend) {
    throw Error('A proper logging backend should be provided');
  }

  return async (ctx, next) => {
    let logPacket = {
      path: ctx.path,
      method: ctx.method,
      origin: ctx.get('origin'),
      userAgent: ctx.get('user-agent'),
      ip: ctx.ip,
      timestamp: 0,
      responseTime: 0,
      status: 0
    };

    if (geoTracking) {
      const geo = lookup(logPacket.ip);
      logPacket.country = get(geo, 'country', undefined);
    }

    const t0 = now();
    ctx.state.requestLog = logPacket;
    await next();
    const t1 = now();

    // Add more details now that all middleware executed
    ctx.state.requestLog.timestamp = t0;
    ctx.state.requestLog.responseTime = t1 - t0;
    ctx.state.requestLog.status = ctx.status;

    // Persist somewhere, depending on backend used - not our problem here!
    await logBackend(ctx.state.requestLog);
  };
};
