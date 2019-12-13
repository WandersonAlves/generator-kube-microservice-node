import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import * as morgan from 'morgan';
import * as express from 'express';

import exception from './Exception';
import unauthorized from './Unauthorized';
import notFound from './404';

export default {
  initMiddlewares(server: express.Application) {
    server.use(compression());
    server.use(bodyParser.json());
    server.use(cors());
    if (process.env.NODE_ENV !== 'production') {
      server.use(morgan('tiny'));
    }
    // server.use(unauthorized);
  },
  initExceptionMiddlewares(server: express.Application) {
    server.use(notFound);
    server.use(exception);
  },
  initCustomRoutes(server: express.Application) {
    return null;
  },
};
