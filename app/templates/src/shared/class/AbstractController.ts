import { Pagination } from './../interfaces/Pagination.interface';
import { Document, DocumentQuery, Model, Query } from "mongoose";
import { IMongoModel } from "../interfaces/IMongoModel";
import UnprocessableEntityException from "../exceptions/UnprocessableEntityException";

export class AController<Interface extends IMongoModel> {

  private _model: Model<Document>;

  constructor(model: Model<Document>) {
    this._model = model;
  }

  save(obj: Interface): Promise<Document> {
    if (obj) {
      const model: Document = new this._model(obj);
      return model.save();
    }
    else {
      throw new UnprocessableEntityException(null)
    }
  }

  findById(id: string): DocumentQuery<Document, Document> {
    return this._model.findById({_id: id});
  }

  find(params: { filter?: any, pagination?: Pagination, sort?: string, fieldsToShow?: {[attr: string]: boolean} }): DocumentQuery<Document[], Document> {
    return this._model.find(params.filter, params.fieldsToShow, params.pagination).sort(params.sort);
  }

  geoFind(params: { maxDistance: number, long: number, lat: number, pagination?: Pagination, codVendor?: number }): DocumentQuery<Document[], Document> {
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
    }, null, params.pagination);
  }

  delete(id: string): Query<Interface> {
    return this._model.deleteOne({_id: id});
  }

  update(params: Interface): DocumentQuery<Document, Document> {
    return this._model.findOneAndUpdate({ _id: params._id }, params);
  }
}