import { Request, Response, NextFunction } from 'express';

import <%= controllerName %> from './<%= controllerName %>';

import * as httpStatus from 'http-status-codes';
import GenericException from '../../shared/exceptions/GenericException';

const <%= controllerInstanceName %> = new <%= controllerName %>();

export const get<%= entityName %>s = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await <%= controllerInstanceName %>.find({});
    res.status(httpStatus.OK).send(result);
  }
  catch (err) {
    next(new GenericException({ name: err.name, message: err.message }));
  }
}