import { Container } from 'inversify';

import Connection from '../shared/class/Connection';
import REFERENCES from './inversify.references';
import <%= businessName %> from '../entities/<%= entityName %>/<%= businessName %>';
import <%= controllerName %> from '../entities/<%= entityName %>/<%= controllerName %>';
import <%= entityNameLowerCase %>Model from '../entities/<%= entityName %>/<%= modelName %>';
import RemoteController from '../shared/class/RemoteController';

const injectionContainer = new Container();

injectionContainer.bind(REFERENCES.Connection).to(Connection);
injectionContainer.bind(REFERENCES.RemoteController).to(RemoteController);
injectionContainer.bind(REFERENCES.<%= businessName %>).to(<%= businessName %>);
injectionContainer.bind(REFERENCES.<%= controllerName %>).to(<%= controllerName %>);

injectionContainer.bind(REFERENCES.<%= modelName %>).toConstantValue(<%= entityNameLowerCase %>Model);

export default injectionContainer;
