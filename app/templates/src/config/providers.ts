import <%= controllerName %> from "../entities/<%= entityName %>/<%= controllerName %>";

const providers = (() => {
  const <%= controllerInstanceName %> = new <%= controllerName %>();

  return {
    <%= controllerInstanceName %>,
  }
})();

export default providers;