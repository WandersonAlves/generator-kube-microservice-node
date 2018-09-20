import GenericException from "./GenericException";
import { Request } from "express";

export default class RouteNotFoundException extends GenericException {
  constructor(req: Request) {
    const params = {
      name: 'RouteNotFoundException',
      message: `${req.originalUrl} doesn't exist on this server`
    }
    super(params);

    Object.setPrototypeOf(this, RouteNotFoundException.prototype);
  }
}