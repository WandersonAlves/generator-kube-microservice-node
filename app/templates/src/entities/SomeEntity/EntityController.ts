import { OK } from 'http-status-codes';
import { Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  response,
} from 'inversify-express-utils';

import <%= serviceName %> from './<%= serviceName %>';
import withException from '../../shared/decorators/withException';
import REFERENCES from '../../config/inversify.references';

@controller('/<%= entityNameLowerCase %>')
export default class <%= controllerName %> {

  @inject(REFERENCES.<%= serviceName %>) private <%= serviceInstanceName %>: <%= serviceName %>;

  @httpGet('/')
  @withException
  async get<%= entityName %>s(@response() res: Response) {
    const result = await this.<%= serviceInstanceName %>.find({});
    res.status(OK).send(result);
  }
}
