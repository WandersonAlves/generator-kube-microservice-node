import GenericException from './GenericException';

export default class UpstreamConnectionException extends GenericException {
  constructor(extras: any, message: string, statusCode: number) {
    super({
      name: 'UpstreamConnectionException',
      message: message || "Can't connect to remote service",
      statusCode: statusCode || 500,
      extras,
    });

    Object.setPrototypeOf(this, UpstreamConnectionException.prototype);
  }
}
