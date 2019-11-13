import { createClient, RedisClient } from 'redis';
import { injectable } from 'inversify';
import { promisify } from 'util';
import env from '../../config/env';

@injectable()
export default class RedisController {
  client: RedisClient;
  private getAsync: (key: string) => Promise<string>;

  constructor() {
    this.client = createClient({ url: env.redis_url });
    this.getAsync = promisify(this.client.get).bind(this.client);
  }
  /**
   * Returns a promise that resolve with cache or concrete data from a given callback function
   *
   * Example
   * ```typescript
   * const redisKey = 'randomKey';
   * const expireInSeconds = 1000; // 1seg TTL
   * return res.status(OK).send(
   *   await this.redis.withRedis({ key: redisKey, expires: expireInSeconds }, async () => {
   *     return this.find({});
   *   }),
   * );
   * ```
   * @param params.key Redis Key
   * @param params.expires TTL value for given key
   * @param callback Function that returns something and save it on redis in case cache is empty
   */
  async withRedis<T>(params: { key: string; expires?: number }, callback: () => Promise<T>) {
    const cache = await this.get(params.key);
    if (!cache) {
      const result = await callback();
      if (params.expires) {
        this.setex(params.key, result, params.expires);
      } else {
        this.set(params.key, result);
      }
      return result;
    }
    return cache;
  }
  /**
   * Get a value from a key in redis using GET command
   * @param key Key
   * @param defaultValue Return this if no value for given key are found
   */
  get<T>(key: string, defaultValue?: T): Promise<T> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.getAsync(key);
        if (result) {
          resolve(JSON.parse(result));
        } else {
          resolve(defaultValue);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
  /**
   * Set a key in redis using SET command
   * @param key Key
   * @param value Value
   */
  set(key: any, value: any) {
    this.client.set(key, JSON.stringify(value));
  }
  /**
   * Set a key in redis using SETEX command
   *
   * Useful to set a expire timer on key
   * @param key Key
   * @param value Value
   * @param ttl Time To Live (in seconds)
   */
  setex(key: any, value: any, ttl: number) {
    this.client.setex(key, ttl, JSON.stringify(value));
  }
}
