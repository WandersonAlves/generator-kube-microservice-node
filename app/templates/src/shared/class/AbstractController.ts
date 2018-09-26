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
  find(params: { filter?: any, pagination?: Pagination, sort?: string, fieldsToShow?: { [attr: string]: boolean } }): Promise<Interface[]> {
    return this._model.find(params.filter, params.fieldsToShow, params.pagination).sort(params.sort) as any;
  }
  /**
   * Finds the first Document that matchs the params
   * @param params Allowed Params: filter, pagination, sort, fieldsToShow
   * @param params.filter Object used to filter Documents
   * @param params.pagination Object with skip, limit properties to control pagination
   * @param params.fieldsToShow Object containing the fields to return from the Documents
   * @returns A Promise with a single Document
   */
  findOne(params: { filter?: any, pagination?: Pagination, sort?: string, fieldsToShow?: { [attr: string]: boolean } }): Promise<Interface> {
    return this._model.findOne(params.filter, params.fieldsToShow, params.pagination).sort(params.sort).exec() as any;
  }
  /**
   * Finds multiple Documents using Mongo GeoLocation Query
   * @param params Allowed Params: maxDistance, long, lat, pagination, codVendor
   * @param params.maxDistance A number representing distance. 1000 = 1km
   * @param params.long A number representing longitude value
   * @param params.lat A number representing latitude value
   * @param params.pagination Object with skip, limit properties to control pagination
   * @param params.codVendor A CODUSUR optional value used to filter results
   */
  geoFind(params: { maxDistance: number, long: number, lat: number, pagination?: Pagination, codVendor?: number }): Promise<Interface[]> {
    return this._model.find({
      "LOCATION": {
        $near: {
          $maxDistance: params.maxDistance,
          $geometry: {
            type: "Point",
            coordinates: [params.long, params.lat]
          }
        }
      },
      $or: [
        { CODUSUR1: params.codVendor },
        { CODUSUR2: params.codVendor },
        { CODUSUR3: params.codVendor }
      ]
    }, null, params.pagination) as any;
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
