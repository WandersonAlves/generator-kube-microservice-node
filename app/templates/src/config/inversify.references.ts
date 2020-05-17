const REFERENCES = {
  <%= controllerName %>: Symbol.for('<%= controllerName %>'),
  <%= serviceName %>: Symbol.for('<%= serviceName %>'),
  Connection: Symbol.for('Connection'),
  RemoteController: Symbol.for('RemoteController'),
  RedisController: Symbol.for('RedisController'),
  EventBus: Symbol.for('EventBus'),
};

export default REFERENCES;
