import GenericException from "./GenericException";
import * as httpCodes from 'http-status-codes';

export default class UnprocessableEntityException extends GenericException {
  constructor(errors: Array<any>) {
    const params = {
      name: 'UnprocessableEntityException',
      message: 'Fields validation failed',
      extras: errors,
      statusCode: httpCodes.UNPROCESSABLE_ENTITY
    }
    super(params);

    Object.setPrototypeOf(this, UnprocessableEntityException.prototype);
  }
}