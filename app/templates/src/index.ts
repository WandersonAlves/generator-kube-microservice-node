import 'reflect-metadata';
import * as sourceMapSupport from 'source-map-support';

import { InversifyExpressServer } from 'inversify-express-utils';

import env from './config/env';
import middleware from './shared/middlewares';
import injectionContainer from './config/inversify.config';
import Connection from './shared/class/Connection';
import REFERENCES from './config/inversify.references';

sourceMapSupport.install();
process.on('unhandledRejection', console.log);

const server = new InversifyExpressServer(injectionContainer);
const mongoConn = injectionContainer.get<Connection>(REFERENCES.Connection);

server.setConfig(app => {
  middleware.initMiddlewares(app);
  middleware.initCustomRoutes(app);
});

server.setErrorConfig(app => {
  middleware.initExceptionMiddlewares(app);
});

const bootstrapedServer = server.build();

bootstrapedServer.listen(env.server_port, async () => {
  await mongoConn.connect();
  console.log(`Opening the gates in ${env.server_port}`);
});

process.on('SIGINT', () => {
  mongoConn.disconnect();
  process.exit(1);
});
