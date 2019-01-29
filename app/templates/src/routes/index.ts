import <%= entityName %> from './<%= entityName %>';
import HealthCheck from './HealthCheck';
import server from '../shared/server';

export default {
  /**
   * Start routes of server
   */
  initRoutes() {
    server.use('/<%= entityNameLowerCase %>', <%= entityName %>);
    server.use('/health', HealthCheck);
  }
};
