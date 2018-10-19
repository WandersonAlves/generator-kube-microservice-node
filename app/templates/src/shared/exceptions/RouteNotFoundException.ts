import GenericException from "./GenericException";
import { Request } from "express";

export default class RouteNotFoundException extends GenericException {
  constructor(req: Request) {
    const params = {
      name: 'RouteNotFoundException',
      message: `${req.originalUrl} doesn't exist on this server`,
      extras: `METHOD: ${req.method}`
    }
    super(params);

    Object.setPrototypeOf(this, RouteNotFoundException.prototype);
  }
}