import { Request, Response } from "express";
import RouteNotFoundException from "../../exceptions/RouteNotFoundException";

export default (req: Request, res: Response, next) => {
  next(new RouteNotFoundException(req));
}