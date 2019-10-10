import { Document, Model, Schema } from 'mongoose';
import { IMongoModel, MongoMerger } from '../interfaces/IMongoModel';
import { injectable, inject, unmanaged } from 'inversify';
import { Pagination } from '../interfaces/PaginationInterface';
import Connection from './Connection';
import env from '../../config/env';
import REFERENCES from '../../config/inversify.references';

type InterfaceBoolean<T> = { [P in keyof T]?: boolean };
type InterfacePagination<T> = { [P in keyof T]?: 1 | -1 };
type InterfacePropertiesToString<T> = keyof T;

@injectable()
export class BaseController<Interface extends IMongoModel> {
  @inject(REFERENCES.Connection) private _connection: Connection;

  private _model: Model<Document>;
  private _modelSchema: Schema<Interface>;
  private _defaultDB: string;

  constructor(@unmanaged() model: Model<Document>, @unmanaged() modelSchema: Schema<Interface>) {
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
    const _model = this.getModel(databaseName);
    const model: Document = new _model(entity);
    return model.save() as any;
  }
  /**
   * Finds a Document by ObjectId
   * @param id A ObjectId from Mongoose schema
   * @param extras.databaseName Set this to query on another database in the current mongo connection
   * @returns A Promise with a single Document
   */
  findById(
    id: string,
    extras?: {
      databaseName?: string;
    },
  ): Promise<Interface> {
    const _model = this.getModel(extras.databaseName);
    return _model.findById({ _id: id }).lean(true) as any;
  }
  /**
   * Finds multiple Documents
   * @param params Allowed Params: filter, pagination, sort, fieldsToShow
   * @param params.filter Object used to filter Documents
   * @param params.pagination Object with skip, limit properties to control pagination
   * @param params.fieldsToShow Object containing the fields to return from the Documents
   * @param extras.databaseName Set this to query on another database in the current mongo connection
   * @returns A Promise with a Array of Documents found
   */
  find(
    params: {
      filter?: Partial<MongoMerger<Interface>>;
      pagination?: Pagination;
      sort?: InterfacePagination<Interface>;
      fieldsToShow?: InterfaceBoolean<Interface>;
    },
    extras?: {
      databaseName?: string;
    },
  ): Promise<Interface[]> {
    const _model = this.getModel(extras.databaseName);
    return _model
      .find(params.filter, params.fieldsToShow, params.pagination)
      .sort(params.sort)
      .lean(true) as any;
  }
  /**
   * Finds the first Document that matchs the params
   * @param params Allowed Params: filter, pagination, sort, fieldsToShow
   * @param params.filter Object used to filter Documents
   * @param params.fieldsToShow Object containing the fields to return from the Documents
   * @param extras.databaseName Set this to query on another database in the current mongo connection
   * @returns A Promise with a single Document
   */
  findOne(
    params: {
      filter?: Partial<MongoMerger<Interface>>;
      fieldsToShow?: InterfaceBoolean<Interface>;
    },
    extras?: {
      databaseName?: string;
    },
  ): Promise<Interface> {
    const _model = this.getModel(extras.databaseName);
    return _model.findOne(params.filter).lean(true) as any;
  }
  /**
   * Deletes a Mongoose Document
   * @param id A ObjectId from Mongoose schema
   * @param extras.databaseName Set this to query on another database in the current mongo connection
   */
  delete(
    id: string,
    extras?: {
      databaseName?: string;
    },
  ): Promise<Interface> {
    const _model = this.getModel(extras.databaseName);
    return _model.deleteOne({ _id: id }).lean(true) as any;
  }
  /**
   * Updates a Document
   * @param params A object that matchs a mongoose schema with a currently know ObjectId
   * @param databaseName Set this to query on another database in the current mongo connection
   */
  update(params: Interface, databaseName?: string): Promise<Interface> {
    const _model = this.getModel(databaseName);
    return _model.updateOne({ _id: params._id }, params).lean(true) as any;
  }
  /**
   * Same as update(), except MongoDB will update all documents that match filter (as opposed to just the first one)
   * regardless of the value of the multi option.
   * @param filter Object used to filter Documents
   * @param doc Object describing the fields to be updated
   * @param databaseName Set this to query on another database in the current mongo connection
   */
  updateMany(filter: Partial<MongoMerger<Interface>>, doc: Partial<Interface>, databaseName?: string): Promise<Interface[]> {
    const _model = this.getModel(databaseName);
    return _model.updateMany(filter, doc).lean(true) as any;
  }
  /**
   * Save multiple documents
   * @param entities Array os objects to save
   * @param databaseName Set this to query on another database in the current mongo connection
   */
  insertMany(entities: Interface[], databaseName?: string): Promise<Interface[]> {
    const _model = this.getModel(databaseName);
    return _model.insertMany(entities) as any;
  }
  /**
   * Get the count of documents by a given filter
   * @param filter Object used to filter Documents
   * @param databaseName Set this to query on another database in the current mongo connection
   */
  count(filter: Partial<MongoMerger<Interface>>, databaseName?: string): Promise<number> {
    const _model = this.getModel(databaseName);
    return _model.count(filter) as any;
  }
  /**
   * Return a distinct operation
   * @param field A string representing a field from [[Interface]]
   * @param filter Object used to filter Documents
   * @param databaseName Set this to query on another database in the current mongo connection
   */
  distinct(
    field: InterfacePropertiesToString<Interface>,
    filter: Partial<MongoMerger<Interface>> = {},
    databaseName?: string,
  ): Promise<any> {
    const _model = this.getModel(databaseName);
    return _model.distinct(field as string, filter) as any;
  }

  /**
   * Gets a model instance from a given database on the current connection
   * @param databaseName database name
   */
  getModel(databaseName: string = this._defaultDB): Model<Document> {
    let _model = this._model;
    if (databaseName) {
      const conn = this._connection.useDB(databaseName);
      _model = conn.model(this._model.modelName, this._modelSchema);
    }
    return _model;
  }
}
