class RedisAsyncWrapper {
  constructor() {
    const redis = require("redis");
    this.redisClient = redis.createClient();
    this.redisClient.on("error", function (error) {
      console.error(error);
    });
  }
  async get(key) {
    return new Promise((resolve, reject) => {
      this.redisClient.get(key, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  }
  async set(key, param) {
    return new Promise((resolve, reject) => {
      this.redisClient.set(key, param, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  }
}
module.exports = RedisAsyncWrapper;
