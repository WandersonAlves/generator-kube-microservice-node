import { UNAUTHORIZED } from 'http-status-codes';
import GenericException from './GenericException';

export default class AuthException extends GenericException {
  // tslint:disable-next-line: variable-name
  static ResourceNotAllowed = 'ResourceNotAllowed';
  // tslint:disable-next-line: variable-name
  static JWTExpiredOrNotReceived = 'JWTExpiredOrNotReceived';
  // tslint:disable-next-line: variable-name
  static LoginDontExists = 'LoginDontExists';
  // tslint:disable-next-line: variable-name
  static LoginPasswordNotAllowed = 'LoginPasswordNotAllowed';
  static messageValues = {
    ResourceNotAllowed: 'Resource not allowed',
    JWTExpiredOrNotReceived: 'JWT expired or not received',
    LoginDontExists: 'Unable to login: email not found',
    LoginPasswordNotAllowed: 'Unable to login: wrong password',
  };
  static helpValues = {
    ResourceNotAllowed: "Check your permissions and the feature you're trying to access",
    JWTExpiredOrNotReceived: 'Maybe we forget to setup Unauthorized file',
    LoginDontExists: 'Check your email',
    LoginPasswordNotAllowed: 'Check your password. Maybe reset them?',
  };
  /**
   * Creates a new AuthException
   * @param type A type of auth exception. This type SHOULD be one of AuthException static members
   */
  constructor(type: string) {
    const params = {
      name: 'AuthException',
      message: AuthException.messageValues[type],
      statusCode: UNAUTHORIZED,
      extras: {
        help: AuthException.helpValues[type],
      },
    };
    super(params);

    Object.setPrototypeOf(this, AuthException.prototype);
  }
}
