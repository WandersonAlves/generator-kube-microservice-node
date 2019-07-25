const REFERENCES = {
  <%= controllerName %>: Symbol.for('<%= controllerName %>'),
  <%= serviceName %>: Symbol.for('<%= serviceName %>'),
  <%= modelName %>: Symbol.for('<%= modelName %>'),
  Connection: Symbol.for('Connection'),
  RemoteController: Symbol.for('RemoteController'),
};

export default REFERENCES;
