import { OK } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  response,
  requestBody,
  interfaces
} from 'inversify-express-utils';

import <%= serviceName %> from './<%= serviceName %>';
import withException from '../../shared/decorators/withException';
import REFERENCES from '../../config/inversify.references';

@controller('/<%= entityNameLowerCase %>')
export default class <%= controllerName %> {

  @inject(REFERENCES.<%= serviceName %>) private <%= serviceInstanceName %>: <%= serviceName %>;

  @httpGet('/')
  @withException
  async get<%= entityName %>s(req: Request, res: Response, next: NextFunction) {
    const result = await this.<%= serviceInstanceName %>.find({});
    res.status(OK).send(result);
  }
}
