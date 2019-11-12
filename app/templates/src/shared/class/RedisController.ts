import { createClient, RedisClient } from 'redis';
import { injectable } from 'inversify';
import { promisify } from 'util';
import env from '../../config/env';

@injectable()
export default class RedisController {
  client: RedisClient;
  private getAsync;

  constructor() {
    this.client = createClient({ url: env.redis_url });
    this.getAsync = promisify(this.client.get).bind(this.client);
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
