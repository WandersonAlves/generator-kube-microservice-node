import { Pagination } from './../interfaces/PaginationInterface';
import { Document, Model } from "mongoose";
import { IMongoModel } from "../interfaces/IMongoModel";

import UnprocessableEntityException from "../exceptions/UnprocessableEntityException";

export class AController<Interface extends IMongoModel> {

  private _model: Model<Document>;

  constructor(model: Model<Document>) {
    this._model = model;
  }
  /**
   * Saves the new Mongoose Model
   * @param obj A object that matchs a mongoose schema
   */
  save(obj: Interface): Promise<Interface> {
    if (obj) {
      const model: Document = new this._model(obj);
      return model.save() as any;
    }
    else {
      throw new UnprocessableEntityException(null)
    }
  }
  /**
   * Finds a Document by ObjectId
   * @param id A ObjectId from Mongoose schema
   * @returns A Promise with a single Document
   */
  findById(id: string): Promise<Interface> {
    return this._model.findById({ _id: id }) as any;
  }
  /**
   * Finds multiple Documents
   * @param params Allowed Params: filter, pagination, sort, fieldsToShow
   * @param params.filter Object used to filter Documents
   * @param params.pagination Object with skip, limit properties to control pagination
   * @param params.fieldsToShow Object containing the fields to return from the Documents
   * @returns A Promise with a Array of Documents found
   */
  find(params: { filter?: Partial<Interface>, pagination?: Pagination, sort?: string, fieldsToShow?: { [attr: string]: boolean } }, lean: boolean = false): Promise<Interface[]> {
    return this._model.find(params.filter, params.fieldsToShow, params.pagination).sort(params.sort).lean(lean) as any;
  }
  /**
   * Finds the first Document that matchs the params
   * @param params Allowed Params: filter, pagination, sort, fieldsToShow
   * @param params.filter Object used to filter Documents
   * @param params.pagination Object with skip, limit properties to control pagination
   * @param params.fieldsToShow Object containing the fields to return from the Documents
   * @returns A Promise with a single Document
   */
  findOne(params: { filter?: Partial<Interface>, pagination?: Pagination, sort?: string, fieldsToShow?: { [attr: string]: boolean } }, lean: boolean = false): Promise<Interface> {
    return this._model.findOne(params.filter, params.fieldsToShow, params.pagination).sort(params.sort).lean(lean) as any;
  }
  /**
   * Deletes a Mongoose Document
   * @param id A ObjectId from Mongoose schema
   */
  delete(id: string): Promise<Interface> {
    return this._model.deleteOne({ _id: id }).exec();
  }
  /**
   * Updates a Document
   * @param params  A object that matchs a mongoose schema with a currently know ObjectId
   */
  update(params: Interface): Promise<Interface> {
    return this._model.findByIdAndUpdate(params._id, params, { new: true }) as any;
  }
}
