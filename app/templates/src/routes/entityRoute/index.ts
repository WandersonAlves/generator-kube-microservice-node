import { get<%= entityName %>s } from './../../entities/<%= entityName %>/<%= businessName %>';
import { Request, Response, NextFunction, Router } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  get<%= entityName %>s(req, res, next);
});

export default router;