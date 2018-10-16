import GenericException from "./GenericException";

export default class UpstreamConnectionException extends GenericException {
  constructor() {
    super({
      name: 'UpstreamConnectionException',
      message: "Can't connect to on premises service",
      statusCode: 500
    });

    Object.setPrototypeOf(this, UpstreamConnectionException.prototype);
  }
}