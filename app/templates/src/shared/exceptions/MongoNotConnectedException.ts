import GenericException from "./GenericException";

export default class MongoNotConnectedException extends GenericException {
  constructor() {
    const params = {
      name: 'MongoNotConnectedException',
      message: 'Not connected to a mongo dabatase'
    }
    super(params);

    Object.setPrototypeOf(this, MongoNotConnectedException.prototype);
  }
}