import { Router, Request, Response, NextFunction } from "express";
import { INTERNAL_SERVER_ERROR, OK } from 'http-status-codes';
import providers from "../../config/providers";

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await providers.connection.getConnection().db.admin().ping();
    res.status(OK).send();
  }
  catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send();
  }
});

export default router;
