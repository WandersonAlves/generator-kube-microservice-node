import GenericException from './GenericException';

export default class MongoNotConnectedException extends GenericException {
  constructor() {
    const params = {
      name: 'MongoNotConnectedException',
      message: 'Not connected to a mongo dabatase',
      extras: {
        help: 'Check your .env file',
      },
    };
    super(params);

    Object.setPrototypeOf(this, MongoNotConnectedException.prototype);
  }
}
