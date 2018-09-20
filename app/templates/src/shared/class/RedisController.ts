import { createClient, RedisClient } from 'redis';
import { promisify } from 'util';
import env from '../../config/env';

export default class RedisController {
  private client: RedisClient;
  private getAsync;
  private setAsync;

  constructor() {
    this.client = createClient({url: env.redis_url});
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
  }

  getCache(key: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.getAsync(key);
        if (result) {
          resolve (JSON.parse(result));
        }
        else {
          resolve(null);
        }
      }
      catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }

  setCache(key: string, value: any, operation: string = 'EX', expireTimer = 15): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.setAsync(key, JSON.stringify(value), operation, expireTimer);
        resolve(true);
      }
      catch (err) {
        reject(err);
      }
    });
  }
}