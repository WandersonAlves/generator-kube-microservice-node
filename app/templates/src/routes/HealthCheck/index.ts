import { connection } from 'mongoose';
import { Router, Request, Response, NextFunction } from "express";
import { INTERNAL_SERVER_ERROR, OK } from 'http-status-codes';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connection.db.admin().ping();
    res.status(OK).send();
  }
  catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send();
  }
});

export default router;