import * as dotenv from 'dotenv';
import MongoNotConnectedException from '../shared/exceptions/MongoNotConnectedException';

dotenv.config();

if (!process.env.MONGO_DB || !process.env.MONGO_URL) {
  throw new MongoNotConnectedException();
}

export default {
  server_port: process.env.PORT,
  mongodb_url: process.env.MONGO_URL,
  mongodb_database_name: process.env.MONGO_DB,
  mongodb_extras: process.env.MONGO_SSL,
  redis_url: process.env.REDIS_URL,
  onpremise_url: process.env.ONPREMISE_URL,
  onpremise_token: process.env.ONPREMISE_TOKEN,
  app_token: process.env.APPLICATION_TOKEN
}