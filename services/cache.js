const mongoose = require("mongoose");
const util = require("util");
const redis = require("redis");

const promisify = util.promisify;

const redisClient = redis.createClient("redis://127.0.0.1:6379");

redisClient.hget = promisify(redisClient.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (
  options = { topLevelCacheKey: Date.now() }
) {
  this.cachable = true;
  this.topLevelCacheKey = JSON.stringify(options.topLevelCacheKey);

  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.cachable) {
    return exec.apply(this, arguments);
  }

  const query = this.getQuery();
  const collectionName = this.mongooseCollection.name;

  const cacheKey = JSON.stringify({
    ...query,
    collectionName,
  });

  const cacheResult = await redisClient.hget(this.topLevelCacheKey, cacheKey);

  if (cacheResult) {
    const cacheResultParsed = JSON.parse(cacheResult);

    if (Array.isArray(cacheResultParsed)) {
      return cacheResultParsed.map((c) => {
        return new this.model(c);
      });
    }

    return new this.model(cacheResultParsed);
  }

  const result = await exec.apply(this, arguments);

  redisClient.hset(this.topLevelCacheKey, cacheKey, JSON.stringify(result));

  return result;
};

module.exports = {
  clearCache(topLevelCacheKey) {
    redisClient.del(JSON.stringify(topLevelCacheKey));
  },
};
