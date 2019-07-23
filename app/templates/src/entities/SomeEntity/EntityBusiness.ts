import { OK } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import <%= controllerName %> from './<%= controllerName %>';
import withException from '../../shared/decorators/withException';
import REFERENCES from '../../config/inversify.references';

@injectable()
export default class <%= businessName %> {

  @inject(REFERENCES.<%= controllerName %>) private <%= controllerInstanceName %>: <%= controllerName %>;

  @withException
  async get<%= entityName %>s(req: Request, res: Response, next: NextFunction) {
    const result = await this.<%= controllerInstanceName %>.find({});
    res.status(OK).send(result);
  }
}
