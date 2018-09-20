import GenericException from "./GenericException";
import { NOT_FOUND } from "http-status-codes";

export default class EntityNotFoundException extends GenericException {
  constructor(idObject) {
    const parseFields = (params: { [param: string]: any }) => {
      let string = '';

      Object.entries(params).forEach(el => {
        string += `${el[0]}: ${el[1]}, `
      });

      return string;
    }
    const params = {
      name: 'EntityNotFoundException',
      message: `Entity with values ${parseFields(idObject)}not found`,
      statusCode: NOT_FOUND
    }
    super(params);

    Object.setPrototypeOf(this, EntityNotFoundException.prototype);
  }
}