import Connection from "../shared/class/Connection";

import <%= controllerName %> from "../entities/<%= entityName %>/<%= controllerName %>";
import <%= businessName %> from "../entities/<%= entityName %>/<%= businessName %>";

const providers = (() => {
  const <%= controllerInstanceName %> = new <%= controllerName %>();
  const connection = new Connection();
  const <%= entityNameLowerCase %>Business = new <%= businessName %>(<%= controllerInstanceName %>);

  return {
    connection,
    <%= controllerInstanceName %>,
    <%= entityNameLowerCase %>Business
  };
})();

export default providers;
