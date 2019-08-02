import { Model, Document } from 'mongoose';
import { <%= interfaceName %> } from './<%= interfaceName %>';
import { BaseController } from '../../shared/class/BaseController';
import { injectable, inject } from 'inversify';
import { <%= entityNameLowerCase %>Schema } from './<%= modelName %>';

import env from '../../config/env';
import REFERENCES from '../../config/inversify.references';

@injectable()
export default class <%= serviceName %> extends BaseController <<%= interfaceName %>> {
  constructor(@inject(REFERENCES.<%= modelName %>) model: Model<Document>) {
    super(model, <%= entityNameLowerCase %>Schema, env.mongodb_database_name);
  }
}
