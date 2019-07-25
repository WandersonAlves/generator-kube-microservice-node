import { Response } from 'express';
import { OK } from 'http-status-codes';
import { inject } from 'inversify';
import { controller, httpGet, response } from 'inversify-express-utils';

import withException from '../decorators/withException';
import Connection from '../../shared/class/Connection';
import REFERENCES from '../../config/inversify.references';

@controller('/health')
export default class HealthCheckController {
  @inject(REFERENCES.Connection) private _connection: Connection;

  @httpGet('/')
  @withException
  async hearthBeat(@response() res: Response) {
    await this._connection
      .getConnection()
      .db.admin()
      .ping();
    res.status(OK).send();
  }
}
