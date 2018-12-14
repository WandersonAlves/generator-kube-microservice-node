import GenericException from "./GenericException";

export default class UpstreamConnectionException extends GenericException {
  constructor(extras: any, message: string) {
    super({
      name: 'UpstreamConnectionException',
      message: message || "Can't connect to on premises service",
      statusCode: 500,
      extras
    });

    Object.setPrototypeOf(this, UpstreamConnectionException.prototype);
  }
}