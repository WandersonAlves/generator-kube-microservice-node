import server from '../index';

import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import * as morgan from 'morgan';

import exception from './exception';
import notFound from './404';

export default {
  initMiddlewares() {
    server.use(compression());
    server.use(bodyParser.json());
    server.use(cors());
    if (process.env.NODE_ENV !== 'production') {
      server.use(morgan('tiny'));
    }
  },
  initExceptionMiddlewares() {
    server.use(notFound);
    server.use(exception);
  }
}