import server from './shared/server';
import router from './routes';
import env from './config/env';
import middleware from './shared/server/middlewares';
import * as figlet from 'figlet';
import Connection from './shared/class/Connection';

import * as sourceMapSupport from 'source-map-support';

sourceMapSupport.install();
process.on('unhandledRejection', console.log);

const mongoConn = new Connection();

middleware.initMiddlewares();
router.initRoutes();
middleware.initExceptionMiddlewares();

server.listen(env.server_port, () => {
  mongoConn.connect();
  console.log("\x1b[31m", figlet.textSync('<%= projectName %>', {
    font: 'Fire Font-s',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }), "\x1b[0m");
  console.log(`Opening the gates in ${env.server_port}`);
});