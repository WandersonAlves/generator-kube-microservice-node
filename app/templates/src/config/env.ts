import * as dotenv from 'dotenv';

dotenv.config();

export default {
  server_port: process.env.PORT,
  mongodb_url: process.env.MONGO_URL,
  mongodb_database_name: process.env.MONGO_DB, // Optional
  mongodb_authsource: process.env.MONGO_AUTHSOURCE, // Optional
  mongodb_replset: process.env.MONGO_REPLSET, // Optional
  redis_url: process.env.REDIS_URL, // Only if you will use Redis
  service_auth: process.env.SERVICE_AUTH, // Only if you use Unauthorized middleware
  rabbitmq_url: process.env.RABBITMQ_URL, // Only if you use RabbitMQ
};
