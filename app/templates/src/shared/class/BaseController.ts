import { Document, Model, Schema, ClientSession } from 'mongoose';
import { IMongoModel, MongoTypes, Pagination, Either, DeleteOp } from '../interfaces/SharedInterfaces';
import { injectable, inject, unmanaged } from 'inversify';
import Connection from './Connection';
import EntityNotFoundException from '../exceptions/EntityNotFoundException';
import env from '../../config/env';
import GenericException from '../exceptions/GenericException';
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
   * @param params.entity A object that matchs a mongoose schema
   * @param params.databaseName Set this to query on another database in the current mongo connection
   * @param params.session A mongoose session to handle transactions
   * @param params.throwErrors Enable classical try/catch way of handling errors
   */
  insert(params: {
    entity: Interface;
    databaseName?: string;
    throwErrors?: boolean;
    session?: ClientSession;
  }): Promise<Either<Interface>> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const model: Document = new _model(params.entity);
        const result = (await model.save({ session: params.session })) as any;
        resolve([null, result]);
      } catch (e) {
        const exception = new GenericException({ name: e.name, message: e.message });
        if (params.throwErrors) {
          throw exception;
        }
        resolve([exception, null]);
      }
    });
  }
  /**
   * Finds a Document by ObjectId
   * @param params.id A ObjectId from Mongoose schema
   * @param params.fieldsToShow Object containing the fields to return from the Documents
   * @param params.databaseName Set this to query on another database in the current mongo connection
   * @param params.throwErrors Enable classical try/catch way of handling errors
   * @returns A Promise with a single Document
   */
  findById(params: {
    id: string;
    fieldsToShow?: InterfaceBoolean<Interface>;
    throwErrors?: boolean;
    databaseName?: string;
  }): Promise<Either<Interface>> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const result = (await _model.findById({ _id: params.id }, params.fieldsToShow).lean(true)) as any;
        if (!result) {
          return resolve([new EntityNotFoundException({ _id: params.id }), null]);
        }
        resolve([null, result]);
      } catch (e) {
        const exception = new GenericException({ name: e.name, message: e.message });
        if (params.throwErrors) {
          throw exception;
        }
        resolve([exception, null]);
      }
    });
  }
  /**
   * Finds multiple Documents
   * @param params.filter Object used to filter Documents
   * @param params.pagination Object with skip, limit properties to control pagination
   * @param params.fieldsToShow Object containing the fields to return from the Documents
   * @param params.databaseName Set this to query on another database in the current mongo connection
   * @param params.throwErrors Enable classical try/catch way of handling errors
   * @returns A Promise with a Array of Documents found
   */
  find(params: {
    filter?: MongoTypes<Interface>;
    pagination?: Pagination;
    sort?: InterfacePagination<Interface>;
    fieldsToShow?: InterfaceBoolean<Interface>;
    throwErrors?: boolean;
    databaseName?: string;
  }): Promise<Either<Interface[]>> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const result: Interface[] = await _model
          .find(params.filter, params.fieldsToShow, params.pagination)
          .sort(params.sort)
          .lean(true);
        resolve([null, result]);
      } catch (e) {
        const exception = new GenericException({ name: e.name, message: e.message });
        if (params.throwErrors) {
          throw exception;
        }
        resolve([exception, null]);
      }
    });
  }
  /**
   * Finds the first Document that matchs the params
   * @param params.filter Object used to filter Documents
   * @param params.fieldsToShow Object containing the fields to return from the Documents
   * @param params.databaseName Set this to query on another database in the current mongo connection
   * @param params.throwErrors Enable classical try/catch way of handling errors
   * @returns A Promise with a single Document
   */
  findOne(params: {
    filter?: MongoTypes<Interface>;
    fieldsToShow?: InterfaceBoolean<Interface>;
    databaseName?: string;
    throwErrors?: boolean;
  }): Promise<Either<Interface[]>> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const result = (await _model.findOne(params.filter, params.fieldsToShow).lean(true)) as any;
        resolve([null, result]);
      } catch (e) {
        const exception = new GenericException({ name: e.name, message: e.message });
        if (params.throwErrors) {
          throw exception;
        }
        resolve([exception, null]);
      }
    });
  }
  /**
   * Deletes a Mongoose Document
   * @param params.id A ObjectId from Mongoose schema
   * @param parms.databaseName Set this to query on another database in the current mongo connection
   * @param params.throwErrors Enable classical try/catch way of handling errors
   */
  delete(params: { id: string; databaseName?: string; throwErrors?: boolean }): Promise<Either<Interface[]>> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const result = (await _model.deleteOne({ _id: params.id }).lean(true)) as any;
        resolve([null, result]);
      } catch (e) {
        const exception = new GenericException({ name: e.name, message: e.message });
        if (params.throwErrors) {
          throw exception;
        }
        resolve([exception, null]);
      }
    });
  }
  /**
   * Delete many documents
   * @param params.fieldsToShow Object containing the fields to return from the Documents
   * @param params.databaseName Set this to query on another database in the current mongo connection
   * @param params.throwErrors Enable classical try/catch way of handling errors
   */
  deleteMany(params: {
    filter?: MongoTypes<Interface>;
    databaseName?: string;
    throwErrors?: boolean;
  }): Promise<Either<DeleteOp>> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const result = await _model.deleteMany(params.filter).exec();
        resolve([null, result]);
      } catch (e) {
        const exception = new GenericException({ name: e.name, message: e.message });
        if (params.throwErrors) {
          throw exception;
        }
        resolve([exception, null]);
      }
    });
  }
  /**
   * Updates a Document
   * @param entity A object that matchs a mongoose schema with a currently know ObjectId
   * @param databaseName Set this to query on another database in the current mongo connection
   * @param session A mongoose session to handle transactions
   * @param params.throwErrors Enable classical try/catch way of handling errors
   */
  update(params: {
    entity: Interface;
    databaseName?: string;
    session?: ClientSession;
    throwErrors?: boolean;
  }): Promise<Either<Interface>> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const result: Interface = (await _model
          .findByIdAndUpdate(params.entity._id, params.entity, { session: params.session, new: true })
          .exec()) as any;
        resolve([null, result]);
      } catch (e) {
        const exception = new GenericException({ name: e.name, message: e.message });
        if (params.throwErrors) {
          throw exception;
        }
        resolve([exception, null]);
      }
    });
  }
  /**
   * Save multiple documents
   * @param entities Array os objects to save
   * @param databaseName Set this to query on another database in the current mongo connection
   * @param session A mongoose session to handle transactions
   * @param params.throwErrors Enable classical try/catch way of handling errors
   */
  insertMany(params: {
    entities: Interface[];
    databaseName?: string;
    session?: ClientSession;
    throwErrors?: boolean;
  }): Promise<Either<Interface[]>> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const result = (await _model.insertMany(params.entities, { session: params.session })) as any;
        resolve([null, result]);
      } catch (e) {
        const exception = new GenericException({ name: e.name, message: e.message });
        if (params.throwErrors) {
          throw exception;
        }
        resolve([exception, null]);
      }
    });
  }
  /**
   * Get the count of documents by a given filter
   * @param filter Object used to filter Documents
   * @param databaseName Set this to query on another database in the current mongo connection
   * @param params.throwErrors Enable classical try/catch way of handling errors
   */
  count(params: { filter: MongoTypes<Interface>; databaseName?: string; throwErrors?: boolean }): Promise<Either<number>> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const result = await _model.count(params.filter).exec();
        resolve([null, result]);
      } catch (e) {
        const exception = new GenericException({ name: e.name, message: e.message });
        if (params.throwErrors) {
          throw exception;
        }
        resolve([exception, null]);
      }
    });
  }
  /**
   * Return a distinct operation
   * @param field A string representing a field from [[Interface]]
   * @param filter Object used to filter Documents
   * @param databaseName Set this to query on another database in the current mongo connection
   * @param params.throwErrors Enable classical try/catch way of handling errors
   */
  distinct<T>(params: {
    field: InterfacePropertiesToString<Interface>;
    filter?: MongoTypes<Interface>;
    databaseName?: string;
    throwErrors?: boolean;
  }): Promise<Either<T[]>> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const result = await _model.distinct(params.field as string, params.filter).exec();
        resolve([null, result]);
      } catch (e) {
        const exception = new GenericException({ name: e.name, message: e.message });
        if (params.throwErrors) {
          throw exception;
        }
        resolve([exception, null]);
      }
    });
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
