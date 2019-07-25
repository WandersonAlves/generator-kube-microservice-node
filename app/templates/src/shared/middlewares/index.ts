// import '../../swaggerModels/<%= entityName %>SwaggerModel';

import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import * as morgan from 'morgan';
import * as express from 'express';
import * as swagger from 'swagger-express-ts';

import exception from './Exception';
import unauthorized from './Unauthorized';
import notFound from './404';

export default {
  initMiddlewares(server) {
    server.use(compression());
    server.use(bodyParser.json());
    server.use(cors());
    if (process.env.NODE_ENV !== 'production') {
      server.use(morgan('tiny'));
    }
    // server.use(unauthorized);
  },
  initExceptionMiddlewares(server) {
    server.use(notFound);
    server.use(exception);
  },
  initCustomRoutes(server) {
    // server.use('/<%= entityNameLowerCase %>/api-docs/swagger', express.static('swagger'));
    // server.use('/<%= entityNameLowerCase %>/docs', express.static('docs'));
    // server.use(
    //   '/api-docs/swagger/assets',
    //   express.static('node_modules/swagger-ui-dist'),
    // );
    // server.use(
    //   swagger.express({
    //     definition: {
    //       info: {
    //         title: '<%= projectName %>',
    //         version: '0.0.1',
    //       },
    //       basePath: '/<%= entityNameLowerCase %>',
    //     },
    //   }),
    // );
  },
};
