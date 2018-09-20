import { Request, Response, NextFunction } from 'express';

import GenericException from '../../exceptions/GenericException';

export default function (err: GenericException, req: Request, res: Response, next: NextFunction) {
  console.error(`[ERROR]: ${err.name}`);
  console.error(err.stack);
  res.status(err.statusCode).send(err.formatError());
}
