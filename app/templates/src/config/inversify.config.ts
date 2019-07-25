import '../shared/middlewares/HealthCheck';
import '../entities/<%= entityName %>/<%= controllerName %>';

import { Container } from 'inversify';

import Connection from '../shared/class/Connection';
import REFERENCES from './inversify.references';
import <%= serviceName %> from '../entities/<%= entityName %>/<%= serviceName %>';
import <%= entityNameLowerCase %>Model from '../entities/<%= entityName %>/<%= modelName %>';
import RemoteController from '../shared/class/RemoteController';

const injectionContainer = new Container({ defaultScope: 'Singleton' });

injectionContainer.bind(REFERENCES.Connection).to(Connection);
injectionContainer.bind(REFERENCES.RemoteController).to(RemoteController);
injectionContainer.bind(REFERENCES.<%= serviceName %>).to(<%= serviceName %>);

injectionContainer.bind(REFERENCES.<%= modelName %>).toConstantValue(<%= entityNameLowerCase %>Model);

export default injectionContainer;
