import GenericException from './GenericException';

export default class UpstreamConnectionException extends GenericException {
  constructor(extras: { url: string, error: any }, message: string, statusCode: number) {
    super({
      name: 'UpstreamConnectionException',
      message: message || "Remote service returned a error or is not reachable",
      statusCode: statusCode || 500,
      extras: {
        url: extras.url,
        error: extras.error
      },
    });

    Object.setPrototypeOf(this, UpstreamConnectionException.prototype);
  }
}
