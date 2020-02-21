import { logger } from '../../shared/utils/logger';
import { Request, Response, NextFunction } from 'express';
import GenericException from '../../shared/exceptions/GenericException';
import RouteNotFoundException from '../../shared/exceptions/RouteNotFoundException';

export const RouteNotFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next(new RouteNotFoundException(req));
};

export const ExceptionMiddleware = (err: GenericException, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${err.stack}`, { label: 'RuntimeException' });
  return res.status(err.statusCode).send(err.formatError());
};
