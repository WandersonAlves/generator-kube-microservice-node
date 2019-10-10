const REFERENCES = {
  <%= controllerName %>: Symbol.for('<%= controllerName %>'),
  <%= serviceName %>: Symbol.for('<%= serviceName %>'),
  Connection: Symbol.for('Connection'),
  RemoteController: Symbol.for('RemoteController'),
};

export default REFERENCES;
