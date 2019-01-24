import Connection from "../shared/class/Connection";

import <%= controllerName %> from "../entities/<%= entityName %>/<%= controllerName %>";

const providers = (() => {
  const <%= controllerInstanceName %> = new <%= controllerName %>();
  const connection = new Connection();

  return {
    <%= controllerInstanceName %>,
    connection
  }
})();

export default providers;