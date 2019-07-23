const REFERENCES = {
  <%= businessName %>: Symbol.for('<%= businessName %>'),
  <%= controllerName %>: Symbol.for('<%= controllerName %>'),
  <%= modelName %>: Symbol.for('<%= modelName %>'),
  Connection: Symbol.for('Connection'),
  RemoteController: Symbol.for('RemoteController'),
};

export default REFERENCES;
