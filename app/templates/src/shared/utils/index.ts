import * as jwt from "jsonwebtoken";
import UnprocessableEntityException from "../exceptions/UnprocessableEntityException";
import { Request } from "express";
import { validationResult } from "express-validator/check";
/**
* Decodes a token from Authorization Header
*
* @returns [[UserInterface]]
* @param jwtToken A authorization header
*/
export const decodeToken = <T>(jwtToken: string): T => {
 return jwt.decode(jwtToken.replace("Bearer ", ""));
};
/**
* Validates a request using express-validator
* The valiation will be made against the inversify-express-utils decorator
* If request has errors, it will throw a UnprocessableEntityException error
*/
export const validateRequest = (req: Request): void => {
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   throw new UnprocessableEntityException(errors.array());
 }
 return;
};