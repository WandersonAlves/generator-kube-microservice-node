import { Request } from 'express';
import { validationResult } from 'express-validator/check';
import { Pagination } from '../interfaces/PaginationInterface';
import { Document, Model, Schema } from 'mongoose';
import { IMongoModel, MongoMerger } from '../interfaces/IMongoModel';
import { injectable, inject, unmanaged } from 'inversify';
import { DatabaseOperations } from '../interfaces/DatabaseOperations';

import REFERENCES from '../../config/inversify.references';
import Connection from './Connection';
import env from '../../config/env';
import UnprocessableEntityException from '../exceptions/UnprocessableEntityException';

type InterfaceBoolean<T> = { [P in keyof T]?: boolean };

@injectable()
export class BaseController<Interface extends IMongoModel> implements DatabaseOperations<Interface> {
  @inject(REFERENCES.Connection) private _connection: Connection;

  private _model: Model<Document>;
  private _modelSchema: Schema<Interface>;
  private _defaultDB: string;

  constructor(model: Model<Document>, @unmanaged() modelSchema: Schema<Interface>) {
    this._model = model;
    this._modelSchema = modelSchema;
    this._defaultDB = env.mongodb_database_name;
  }
  /**
   * Saves the new Mongoose Model
   * @param entity A object that matchs a mongoose schema
   * @param databaseName Set this to query on another database in the current mongo connection
   */
  insert(entity: Interface, databaseName?: string): Promise<Interface> {
    const _model = this._getModel(databaseName);
    const model: Document = new _model(entity);
    return model.save() as any;
  }
  /**
   * Finds a Document by ObjectId
   * @param id A ObjectId from Mongoose schema
   * @param lean Sets the lean option.
   * Documents returned from queries with the lean option enabled are plain javascript objects, not MongooseDocuments.
   * They have no save method, getters/setters or other Mongoose magic applied.
   * @param databaseName Set this to query on another database in the current mongo connection
   * @returns A Promise with a single Document
   */
  findById(id: string, lean: boolean = true, databaseName?: string): Promise<Interface> {
    const _model = this._getModel(databaseName);
    return _model.findById({ _id: id }).lean(lean) as any;
  }
  /**
   * Finds multiple Documents
   * @param params Allowed Params: filter, pagination, sort, fieldsToShow
   * @param params.filter Object used to filter Documents
   * @param params.pagination Object with skip, limit properties to control pagination
   * @param params.fieldsToShow Object containing the fields to return from the Documents
   * @param lean Sets the lean option.
   * Documents returned from queries with the lean option enabled are plain javascript objects, not MongooseDocuments.
   * They have no save method, getters/setters or other Mongoose magic applied.
   * @param databaseName Set this to query on another database in the current mongo connection
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
   * @param lean Sets the lean option.
   * Documents returned from queries with the lean option enabled are plain javascript objects, not MongooseDocuments.
   * They have no save method, getters/setters or other Mongoose magic applied.
   * @param databaseName Set this to query on another database in the current mongo connection
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
   * @param lean Sets the lean option.
   * Documents returned from queries with the lean option enabled are plain javascript objects, not MongooseDocuments.
   * They have no save method, getters/setters or other Mongoose magic applied.
   * @param databaseName Set this to query on another database in the current mongo connection
   */
  delete(id: string, lean: boolean = true, databaseName?: string): Promise<Interface> {
    const _model = this._getModel(databaseName);
    return _model.deleteOne({ _id: id }).lean(lean) as any;
  }
  /**
   * Updates a Document
   * @param params A object that matchs a mongoose schema with a currently know ObjectId
   * @param databaseName Set this to query on another database in the current mongo connection
   */
  update(params: Interface, databaseName?: string): Promise<Interface> {
    const _model = this._getModel(databaseName);
    return _model.findByIdAndUpdate(params._id, params, { new: true }) as any;
  }
  /**
   * Save multiple documents
   * @param entities Array os objects to save
   * @param databaseName Set this to query on another database in the current mongo connection
   */
  insertMany(entities: Interface[], databaseName?: string): Promise<Interface[]> {
    const _model = this._getModel(databaseName);
    return _model.insertMany(entities) as any;
  }
  /**
   * Get the count of documents by a given filter
   * @param filter Object used to filter Documents
   * @param databaseName Set this to query on another database in the current mongo connection
   */
  count(filter: Partial<MongoMerger<Interface>>, databaseName?: string): Promise<number> {
    const _model = this._getModel(databaseName);
    return _model.count(filter) as any;
  }
  /**
   * Validates a request using `express-validator`
   * The valiation will be made against the `inversify-express-utils` decorator
   * If request has errors, it will throw a UnprocessableEntityException error
   */
  validateRequest(req: Request): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new UnprocessableEntityException(errors.array());
    }
    return;
  }
  /**
   * Gets a model instance from a given database on the current connection
   * @param databaseName database name
   */
  private _getModel(databaseName: string = this._defaultDB): Model<Document> {
    let _model = this._model;
    if (databaseName) {
      const conn = this._connection.useDB(databaseName);
      _model = conn.model(this._model.modelName, this._modelSchema);
    }
    return _model;
  }
}
