import { OK } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import withException from '../../shared/decorators/withException';

export default class <%= businessName %> {

  constructor(private <%= controllerInstanceName %>) {}

  @withException
  async get<%= entityName %>s(req: Request, res: Response, next: NextFunction) {
    const result = await this.<%= controllerInstanceName %>.find({});
    res.status(OK).send(result);
  }
}
