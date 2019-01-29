import { connect, connection, Connection as MongoConnection } from 'mongoose';
import env from '../../config/env';
import MongoNotConnectedException from '../exceptions/MongoNotConnectedException';

export default class Connection {

  private db: MongoConnection;

  connect(): Promise<this> {
    return new Promise(async (resolve, reject) => {
      try {
        await connect(`${env.mongodb_url}/${env.mongodb_database_name}${env.mongodb_extras}`, {
          poolSize: 10,
          bufferMaxEntries: 0,
          bufferCommands: false
        });
        this.db = connection;
        if (this.db.readyState !== 1) {
          throw new MongoNotConnectedException();
        }
        resolve(this);
      }
      catch (err) {
        reject(err);
        process.exit(1);
      }
    });
  }

  disconnect(): Promise<any> {
    return this.db.close();
  }

  getConnection() {
    return this.db;
  }

  run(cb) {
    if (this.db.readyState === 1) {
      cb(this.db);
    }
    else {
      throw new MongoNotConnectedException();
    }
  }
}
