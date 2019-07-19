import <%= entityName %> from './<%= entityName %>';
import * as swagger from 'swagger-express-ts';
import * as express from 'express';
import HealthCheck from './HealthCheck';
import server from '../shared/server';

export default {
  /**
   * Start routes of server
   */
  initRoutes() {
    server.use('/<%= entityNameLowerCase %>', <%= entityName %>);
    server.use('/<%= entityNameLowerCase %>/api-docs/swagger', express.static('swagger'));
    server.use('/<%= entityNameLowerCase %>/docs', express.static('docs'));
    server.use(
      '/api-docs/swagger/assets',
      express.static('node_modules/swagger-ui-dist'),
    );
    server.use(
      swagger.express({
        definition: {
          info: {
            title: '<%= projectName %>',
            version: '0.0.1',
          },
          basePath: '/<% entityNameLowerCase %>',
        },
      }),
    );
    server.use('/health', HealthCheck);
  }
};
