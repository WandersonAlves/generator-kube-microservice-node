import { <%= interfaceName %> } from '../models/<%= interfaceName %>';
import { MongoService } from '../shared/class/MongoService';
import { injectable } from 'inversify';
import { <%= entityName %>Schema, <%= entityName %>Model } from '../models/<%= modelName %>';

@injectable()
export default class <%= serviceName %> extends MongoService <<%= interfaceName %>> {
  constructor() {
    /**
     * MongoService uses the Schema because if you change the default database while using some method from MongoService,
     * mongoose don't knows how to create the model schema for this non default database, so we help mongoose to do that
     */
    super(<%= entityName %>Model, <%= entityName %>Schema);
  }
}
