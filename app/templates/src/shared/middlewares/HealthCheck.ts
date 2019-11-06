import { Response } from 'express';
import { INTERNAL_SERVER_ERROR, NO_CONTENT } from 'http-status-codes';
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
    const ready = this._connection.getConnection().readyState;
    if (ready === 1) {
      res.status(NO_CONTENT).send();
    }
    else {
      res.status(INTERNAL_SERVER_ERROR).send();
    }
  }
}
