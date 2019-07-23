import { Router, Request, Response, NextFunction } from "express";
import { INTERNAL_SERVER_ERROR, OK } from 'http-status-codes';
import injectionContainer from "../../config/inversify.config";
import Connection from "../../shared/class/Connection";
import REFERENCES from "../../config/inversify.references";

const connection = injectionContainer.get<Connection>(REFERENCES.Connection);

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connection.getConnection().db.admin().ping();
    res.status(OK).send();
  }
  catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send();
  }
});

export default router;
