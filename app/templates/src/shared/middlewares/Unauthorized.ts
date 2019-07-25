import { Request, Response } from 'express';
import env from '../../config/env';
import AuthException from '../exceptions/AuthException';
import injectionContainer from '../../config/inversify.config';
import RemoteController from '../class/RemoteController';
import REFERENCES from '../../config/inversify.references';

const remoteController = injectionContainer.get<RemoteController>(
  REFERENCES.RemoteController,
);

export default async (req: Request, res: Response, next) => {
  const { authorization } = req.headers;
  try {
    if (req.originalUrl.includes('/health')) {
      next();
      return;
    }
    await remoteController.get(`${env.service_auth}/auth`, {
      headers: {
        Authorization: authorization,
      },
    });
    next();
  } catch (e) {
    next(new AuthException());
  }
};
