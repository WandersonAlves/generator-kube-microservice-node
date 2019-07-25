import { NOT_FOUND } from 'http-status-codes';
import { Request } from 'express';
import GenericException from './GenericException';

export default class RouteNotFoundException extends GenericException {
  constructor(req: Request) {
    const params = {
      name: 'RouteNotFoundException',
      message: `${req.originalUrl} doesn't exist on this server`,
      extras: `Method: ${req.method}`,
      statusCode: NOT_FOUND,
    };
    super(params);

    Object.setPrototypeOf(this, RouteNotFoundException.prototype);
  }
}
