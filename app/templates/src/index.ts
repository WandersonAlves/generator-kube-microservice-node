import server from './shared/server';
import router from './routes';
import env from './config/env';
import middleware from './shared/server/middlewares';
import * as sourceMapSupport from 'source-map-support';
import injectionContainer from './config/inversify.config';
import Connection from './shared/class/Connection';
import REFERENCES from './config/inversify.references';

sourceMapSupport.install();
process.on('unhandledRejection', console.log);

const mongoConn = injectionContainer.get<Connection>(REFERENCES.Connection);

middleware.initMiddlewares();
router.initRoutes();
middleware.initExceptionMiddlewares();

server.listen(env.server_port, async () => {
  await mongoConn.connect();
  console.log(`Opening the gates in ${env.server_port}`);
});

process.on('SIGINT', () => {
  mongoConn.disconnect();
  process.exit(1);
});
