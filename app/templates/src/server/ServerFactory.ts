import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import { RouteNotFoundMiddleware, ExceptionMiddleware } from './middlewares';

export default {
  initExternalMiddlewares(server: express.Application) {
    server.use(compression());
    server.use(bodyParser.json());
    server.use(cors());
  },
  initExceptionMiddlewares(server: express.Application) {
    server.use(RouteNotFoundMiddleware);
    server.use(ExceptionMiddleware);
  },
};
