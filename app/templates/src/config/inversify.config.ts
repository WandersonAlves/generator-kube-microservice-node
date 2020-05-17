import '../server/HealthCheck';
import '../controllers/<%= controllerName %>';

import { Container } from 'inversify';
import { EventEmitter } from 'events';

import Connection from '../shared/class/Connection';
import REFERENCES from './inversify.references';
import <%= serviceName %> from '../services/<%= serviceName %>';
import RemoteController from '../shared/class/RemoteController';
import RedisController from '../shared/class/RedisController';

const injectionContainer = new Container({ defaultScope: 'Singleton' });
const eventBus = new EventEmitter();

injectionContainer.bind(REFERENCES.Connection).to(Connection);
injectionContainer.bind(REFERENCES.RemoteController).to(RemoteController);
injectionContainer.bind(REFERENCES.RedisController).to(RedisController);
injectionContainer.bind(REFERENCES.EventBus).toConstantValue(eventBus);
injectionContainer.bind(REFERENCES.<%= serviceName %>).to(<%= serviceName %>);

export default injectionContainer;
