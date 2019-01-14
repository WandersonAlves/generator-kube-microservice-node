import { Pagination } from './../interfaces/PaginationInterface';
import { Document, Model } from "mongoose";
import { IMongoModel, MongoMerger } from "../interfaces/IMongoModel";

type InterfaceBoolean<T> = {
  [P in keyof T]?: boolean;
}

export class AController<Interface extends IMongoModel> {

  private _model: Model<Document>;

  constructor(model: Model<Document>) {
    this._model = model;
  }
  /**
   * Saves the new Mongoose Model
   * @param entity A object that matchs a mongoose schema
   */
  save(entity: Interface): Promise<Interface> | Promise<Document> {
    const model: Document = new this._model(entity);
    return model.save() as any;
  }
  /**
   * Finds a Document by ObjectId
   * @param id A ObjectId from Mongoose schema
   * @returns A Promise with a single Document
   */
  findById(id: string, lean: boolean = false): Promise<Interface> {
    return this._model.findById({ _id: id }).lean(lean) as any;
  }
  /**
   * Finds multiple Documents
   * @param params Allowed Params: filter, pagination, sort, fieldsToShow
   * @param params.filter Object used to filter Documents
   * @param params.pagination Object with skip, limit properties to control pagination
   * @param params.fieldsToShow Object containing the fields to return from the Documents
   * @returns A Promise with a Array of Documents found
   */
  find(params: { filter?: Partial<MongoMerger<Interface>>, pagination?: Pagination, sort?: string, fieldsToShow?: InterfaceBoolean<Interface> }, lean: boolean = false): Promise<Interface[]> {
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
  findOne(params: { filter?: Partial<MongoMerger<Interface>>, pagination?: Pagination, sort?: string, fieldsToShow?: InterfaceBoolean<Interface> }, lean: boolean = false): Promise<Interface> {
    return this._model.findOne(params.filter, params.fieldsToShow, params.pagination).sort(params.sort).lean() as any;
  }
  /**
   * Deletes a Mongoose Document
   * @param id A ObjectId from Mongoose schema
   */
  delete(id: string, lean: boolean = false): Promise<Interface> {
    return this._model.deleteOne({ _id: id }).lean(lean) as any;
  }
  /**
   * Updates a Document
   * @param params A object that matchs a mongoose schema with a currently know ObjectId
   */
  update(params: Interface): Promise<Interface> {
    return this._model.findByIdAndUpdate(params._id, params, { new: true }) as any;
  }
  /**
   * Save multiple documents
   * @param entities Array os objects to save
   */
  saveMultiple(entities: Interface[]): Promise<Interface[]> {
    return this._model.insertMany(entities) as any;
  }
}
