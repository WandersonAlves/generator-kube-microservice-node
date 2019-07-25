import { Model, Document } from 'mongoose';
import { <%= interfaceName %> } from './<%= interfaceName %>';
import { BaseController } from '../../shared/class/BaseController';
import { injectable, inject } from 'inversify';
import REFERENCES from '../../config/inversify.references';

@injectable()
export default class <%= serviceName %> extends BaseController <<%= interfaceName %>> {
  constructor(@inject(REFERENCES.<%= modelName %>) model: Model<Document>) {
    super(model);
  }
}
