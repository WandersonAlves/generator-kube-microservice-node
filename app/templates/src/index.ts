import { EventEmitter } from 'events';
import 'reflect-metadata';
import * as mongoose from 'mongoose';
import * as sourceMapSupport from 'source-map-support';
import { logger } from './shared/utils/logger';
import ServerFactory from './server/ServerFactory';

import { InversifyExpressServer } from 'inversify-express-utils';

import env from './config/env';
import injectionContainer from './config/inversify.config';
import Connection from './shared/class/Connection';
import REFERENCES from './config/inversify.references';

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', true);

sourceMapSupport.install();
process.on('unhandledRejection', console.error);

logger.info('Configuring server');
const server = new InversifyExpressServer(injectionContainer);
const mongoConn = injectionContainer.get<Connection>(REFERENCES.Connection);
const eventBus = injectionContainer.get<EventEmitter>(REFERENCES.EventBus);

server.setConfig(app => {
  ServerFactory.initExternalMiddlewares(app);
});

server.setErrorConfig(app => {
  ServerFactory.initExceptionMiddlewares(app);
});

logger.info('Bootstraping server');
const bootstrapedServer = server.build();

bootstrapedServer.listen(env.server_port, async () => {
  await mongoConn.connect();
  eventBus.emit('mongoConnection');
  logger.info(`Server up and running on ${env.server_port}`);
});

process.on('SIGINT', async () => {
  await mongoConn.disconnect();
  process.exit(1);
});
