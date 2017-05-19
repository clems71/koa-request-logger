/**
 * Create a console backend
 *
 * @param  {Object}  opts
 * @param  {Boolean} opts.json If set, each log will be json encoded before
 * being dumped to console output.
 * 
 * @return {Backend}
 */
module.exports = function consoleBackend({ json = false } = {}) {
  if (json) {
    return logPacket => {
      console.log(JSON.stringify(logPacket));
    };
  }

  return logPacket => {
    console.log(
      `${logPacket.status} ${logPacket.method} ${logPacket.path} - ${logPacket.responseTime}ms`
    );
  };
};
