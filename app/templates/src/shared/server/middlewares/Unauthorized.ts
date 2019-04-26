import { Request, Response } from 'express';
import { UNAUTHORIZED } from 'http-status-codes';
import providers from '../../../config/providers';
import env from '../../../config/env';
import GenericException from '../../exceptions/GenericException';

export default async (req: Request, res: Response, next) => {
  const { authorization } = req.headers;
  try {
    if (req.originalUrl.includes('/health')) {
      next();
      return;
    }
    await providers.remoteController.get(`${env.service_auth}/auth`, {
      headers: {
        Authorization: authorization,
      },
    });
    next();
  } catch (e) {
    next(
      new GenericException({
        name: 'AuthorizationError',
        message: 'Token expired or authorization service not configured',
        statusCode: UNAUTHORIZED,
      }),
    );
  }
};
