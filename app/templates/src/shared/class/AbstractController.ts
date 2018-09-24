import UnprocessableEntityException from "../exceptions/UnprocessableEntityException";
import { Pagination } from './../interfaces/PaginationInterface';
import { Document, DocumentQuery, Model, Query } from "mongoose";
import { IMongoModel } from "../interfaces/IMongoModel";

export class AController<Interface extends IMongoModel> {

  private _model: Model<Document>;

  constructor(model: Model<Document>) {
    this._model = model;
  }

  save(obj: Interface): Promise<Interface> {
    if (obj) {
      const model: Document = new this._model(obj);
      return model.save() as any;
    }
    else {
      throw new UnprocessableEntityException(null)
    }
  }

  findById(id: string): Promise<Interface> {
    return this._model.findById({ _id: id }) as any;
  }

  find(params: { filter?: any, pagination?: Pagination, sort?: string, fieldsToShow?: { [attr: string]: boolean } }): Promise<Interface[]> {
    return this._model.find(params.filter, params.fieldsToShow, params.pagination).sort(params.sort) as any;
  }

  findOne(params: { filter?: any, pagination?: Pagination, sort?: string, fieldsToShow?: { [attr: string]: boolean } }): Promise<Interface> {
    return this._model.findOne(params.filter, params.fieldsToShow, params.pagination).sort(params.sort) as any;
  }

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

  delete(id: string): Query<Interface> {
    return this._model.deleteOne({ _id: id });
  }

  update(params: Interface): Promise<Interface> {
    return this._model.findOneAndUpdate({ _id: params._id }, params) as any;
  }
}
