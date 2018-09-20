import <%= entityName %> from './<%= entityName %>';
import server from '../shared/server';

export default {
  /**
   * Start routes of server
   */
  initRoutes() {
    server.use('/<%= entityName %>', <%= entityName %>);
  }
}