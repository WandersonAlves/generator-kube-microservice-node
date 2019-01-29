import { Request, Response, NextFunction, Router } from 'express';
import { check, validationResult } from 'express-validator/check';

import UnprocessableEntityException from '../../shared/exceptions/UnprocessableEntityException';
import providers from '../../config/providers';

const <%= entityNameLowerCase %>Business = providers.<%= entityNameLowerCase %>Business;

const router = Router();
const checkEntityGet = [
  check('somefield').exists()
];

router.get('/', checkEntityGet, (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new UnprocessableEntityException(errors.array()));
    return;
  }
  <%= entityNameLowerCase %>Business.get<%= entityName %>s(req, res, next);
});

export default router;
