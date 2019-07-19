import { OK } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import <%= controllerName %> from './<%= controllerName %>';
import withException from '../../shared/decorators/withException';

export default class <%= businessName %> {

  constructor(private <%= controllerInstanceName %>: <%= controllerName %>) {}

  @withException
  async get<%= entityName %>s(req: Request, res: Response, next: NextFunction) {
    const result = await this.<%= controllerInstanceName %>.find({});
    res.status(OK).send(result);
  }
}
