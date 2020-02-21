import { <%= interfaceName %> } from '../models/<%= interfaceName %>';
import { BaseController } from '../shared/class/BaseController';
import { injectable } from 'inversify';
import { <%= entityName %>Schema, <%= entityName %>Model } from '../models/<%= modelName %>';

@injectable()
export default class <%= serviceName %> extends BaseController <<%= interfaceName %>> {
  constructor() {
    super(<%= entityName %>Model, <%= entityName %>Schema);
  }
}
