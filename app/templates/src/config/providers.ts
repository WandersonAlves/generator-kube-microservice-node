import Connection from "../shared/class/Connection";
import RemoteController from "../shared/class/RemoteController";

import <%= controllerName %> from "../entities/<%= entityName %>/<%= controllerName %>";
import <%= businessName %> from "../entities/<%= entityName %>/<%= businessName %>";

const providers = (() => {
  const <%= controllerInstanceName %> = new <%= controllerName %>();
  const connection = new Connection();
  const remoteController = new RemoteController();
  const <%= entityNameLowerCase %>Business = new <%= businessName %>(<%= controllerInstanceName %>);

  return {
    connection,
    <%= controllerInstanceName %>,
    <%= entityNameLowerCase %>Business,
    remoteController
  };
})();

export default providers;
