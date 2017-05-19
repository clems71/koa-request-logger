const { omit } = require('lodash');
const { parse } = require('bytes');

/**
 * Create a mongodb backend
 *
 * @param  {MongoDb.Db} db A mongodb native driver `Db` object.
 * @param  {Object}     opts
 * @param  {String}     opts.collection The mongodb collection name that
 * will be used to write the logs to.
 * @param  {Boolean}    opts.capped If set to true (default) it will create
 * a capped collection, thus limiting the max capacity of the collection.
 * Old logs will be destroyed once the limit is reached.
 * @param  {String}     opts.maxSize If capped, it sets the maximum size
 * of the collection. It can be set as a string with proper extension (eg
 * 1GB, 100MB, etc...).
 * @param  {Number}     opts.maxEntries If capped, this is the max number
 * of log entries that can live in the collection at some point.
 *
 * @return {Backend}
 */
module.exports = async function mongodbBackend(
  db,
  {
    collection = 'http-logs',
    capped = true,
    maxSize = '1GB',
    maxEntries = 10e6
  } = {}
) {
  const col = await db.createCollection(
    collection,
    capped
      ? {
          capped: true,
          size: parse(maxSize),
          max: maxEntries
        }
      : undefined
  );

  return async logPacket => {
    // timestamp is not needed, it will be available inside
    // the _id field added by MongoDB driver
    const logPacketWithoutTimestamp = omit(logPacket, 'timestamp');
    await col.insertOne(logPacketWithoutTimestamp, { w: 0 });
  };
};
