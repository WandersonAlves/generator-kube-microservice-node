import { Pagination } from '../interfaces/PaginationInterface';
import { Document, Model, Schema } from 'mongoose';
import { IMongoModel, MongoMerger } from '../interfaces/IMongoModel';
import { injectable, inject, unmanaged } from 'inversify';
import { DatabaseOperations } from '../interfaces/DatabaseOperations';

import REFERENCES from '../../config/inversify.references';
import Connection from './Connection';

type InterfaceBoolean<T> = {
  [P in keyof T]?: boolean;
};

@injectable()
export class BaseController<Interface extends IMongoModel>
  implements DatabaseOperations<Interface> {
  @inject(REFERENCES.Connection) private _connection: Connection;

  private _model: Model<Document>;
  private _modelSchema: Schema<Interface>;
  private _defaultDB: string;

  constructor(model: Model<Document>, @unmanaged() modelSchema: Schema<Interface>, @unmanaged() defaultDB: string) {
    this._model = model;
    this._modelSchema = modelSchema;
    this._defaultDB = defaultDB;
  }
  /**
   * Saves the new Mongoose Model
   * @param entity A object that matchs a mongoose schema
   */
  insert(entity: Interface, databaseName?: string): Promise<Interface> {
    const _model = this._getModel(databaseName);
    const model: Document = new _model(entity);
    return model.save() as any;
  }
  /**
   * Finds a Document by ObjectId
   * @param id A ObjectId from Mongoose schema
   * @returns A Promise with a single Document
   */
  findById(
    id: string,
    lean: boolean = true,
    databaseName?: string,
  ): Promise<Interface> {
    const _model = this._getModel(databaseName);
    return _model.findById({ _id: id }).lean(lean) as any;
  }
  /**
   * Finds multiple Documents
   * @param params Allowed Params: filter, pagination, sort, fieldsToShow
   * @param params.filter Object used to filter Documents
   * @param params.pagination Object with skip, limit properties to control pagination
   * @param params.fieldsToShow Object containing the fields to return from the Documents
   * @returns A Promise with a Array of Documents found
   */
  find(
    params: {
      filter?: Partial<MongoMerger<Interface>>;
      pagination?: Pagination;
      sort?: string;
      fieldsToShow?: InterfaceBoolean<Interface>;
    },
    lean: boolean = true,
    databaseName?: string,
  ): Promise<Interface[]> {
    const _model = this._getModel(databaseName);
    return _model
      .find(params.filter, params.fieldsToShow, params.pagination)
      .sort(params.sort)
      .lean(lean) as any;
  }
  /**
   * Finds the first Document that matchs the params
   * @param params Allowed Params: filter, pagination, sort, fieldsToShow
   * @param params.filter Object used to filter Documents
   * @param params.pagination Object with skip, limit properties to control pagination
   * @param params.fieldsToShow Object containing the fields to return from the Documents
   * @returns A Promise with a single Document
   */
  findOne(
    params: {
      filter?: Partial<MongoMerger<Interface>>;
      pagination?: Pagination;
      sort?: string;
      fieldsToShow?: InterfaceBoolean<Interface>;
    },
    lean: boolean = true,
    databaseName?: string,
  ): Promise<Interface> {
    const _model = this._getModel(databaseName);
    return _model
      .findOne(params.filter, params.fieldsToShow, params.pagination)
      .sort(params.sort)
      .lean(lean) as any;
  }
  /**
   * Deletes a Mongoose Document
   * @param id A ObjectId from Mongoose schema
   */
  delete(
    id: string,
    lean: boolean = true,
    databaseName?: string,
  ): Promise<Interface> {
    const _model = this._getModel(databaseName);
    return _model.deleteOne({ _id: id }).lean(lean) as any;
  }
  /**
   * Updates a Document
   * @param params A object that matchs a mongoose schema with a currently know ObjectId
   */
  update(
    params: Interface,
    databaseName?: string,
  ): Promise<Interface> {
    const _model = this._getModel(databaseName);
    return _model.findByIdAndUpdate(params._id, params, { new: true }) as any;
  }
  /**
   * Save multiple documents
   * @param entities Array os objects to save
   */
  insertMany(
    entities: Interface[],
    databaseName?: string,
  ): Promise<Interface[]> {
    const _model = this._getModel(databaseName);
    return _model.insertMany(entities) as any;
  }
  /**
   * Gets a model instance from a given database
   * @param databaseName database name
   */
  private _getModel(databaseName: string = this._defaultDB): Model<Document, any> {
    let _model = this._model;
    if (databaseName) {
      const conn = this._connection.useDB(databaseName);
      _model = conn.model(this._model.modelName, this._modelSchema);
    }
    return _model;
  }
}
