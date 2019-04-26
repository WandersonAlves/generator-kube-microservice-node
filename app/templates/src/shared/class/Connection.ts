import { connect, connection, Connection as MongoConnection } from 'mongoose';
import env from '../../config/env';
import MongoNotConnectedException from '../exceptions/MongoNotConnectedException';

export default class Connection {
  private db: MongoConnection;

  connect(): Promise<this> {
    return new Promise(async (resolve, reject) => {
      try {
        await connect(
          `${env.mongodb_url}/${env.mongodb_database_name}`
        );
        this.db = connection;
        if (this.db.readyState !== 1) {
          throw new MongoNotConnectedException();
        }
        resolve(this);
      } catch (err) {
        reject(err);
        process.exit(1);
      }
    });
  }

  getConnection() {
    return this.db;
  }

  disconnect(): Promise<any> {
    return this.db.close();
  }

  run(cb) {
    if (this.db.readyState === 1) {
      cb(this.db);
    } else {
      throw new MongoNotConnectedException();
    }
  }
}
