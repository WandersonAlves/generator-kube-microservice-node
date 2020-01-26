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

interface ICommonParamsSession<BooleanType> {
  databaseName?: string;
  session?: ClientSession;
  throwErrors?: BooleanType;
}

interface ICommonParamsFilter<T, BooleanType> {
  filter?: MongoTypes<T>;
  databaseName?: string;
  throwErrors?: BooleanType;
}

interface IFindParams<ReturnType, BooleanType extends boolean> extends ICommonParamsFilter<ReturnType, BooleanType> {
  pagination?: Pagination;
  sort?: InterfacePagination<ReturnType>;
  fieldsToShow?: InterfaceBoolean<BooleanType>;
}

interface IDistinctParams<T, BooleanType> extends ICommonParamsFilter<T, BooleanType> {
  field: InterfacePropertiesToString<T>;
}

interface ICountParams<T, BooleanType extends boolean> extends ICommonParamsFilter<T, BooleanType> {}
interface IInsertParams<ReturnType, BooleanType extends boolean> extends ICommonParamsSession<BooleanType> {
  entity: ReturnType;
}

interface IInsertManyParams<ReturnType, BooleanType extends boolean> extends ICommonParamsSession<BooleanType> {
  entities: ReturnType[];
}

interface IFindByIdParams<ReturnType, BooleanType extends boolean> {
  id: string;
  fieldsToShow?: InterfaceBoolean<ReturnType>;
  throwErrors?: BooleanType;
  databaseName?: string;
}

interface IFindOneParams<ReturnType, BooleanType extends boolean> extends ICommonParamsFilter<ReturnType, BooleanType> {
  fieldsToShow?: InterfaceBoolean<ReturnType>;
}

interface IDeleteParams<BooleanType extends boolean> extends ICommonParamsSession<BooleanType> {
  id: string;
}

interface IDeleteManyParams<T, BooleanType extends boolean> extends ICommonParamsSession<BooleanType> {
  filter?: MongoTypes<T>;
}

interface IUpdateParams<ReturnType, BooleanType extends boolean> extends ICommonParamsSession<BooleanType> {
  entity: Partial<ReturnType>;
  conditions: MongoTypes<ReturnType>;
}

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
  insert(params: IInsertParams<Interface, false>): Promise<Either<Interface>>;
  insert(params: IInsertParams<Interface, true>): Promise<Interface>;
  insert(params: IInsertParams<Interface, boolean>): Promise<Either<Interface> | Interface> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const model: Document = new _model(params.entity);
        const result: Interface = (await model.save({ session: params.session })) as any;
        if (params.throwErrors) {
          return resolve(result);
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
   * Finds a Document by ObjectId
   * @param params.id A ObjectId from Mongoose schema
   * @param params.fieldsToShow Object containing the fields to return from the Documents
   * @param params.databaseName Set this to query on another database in the current mongo connection
   * @param params.throwErrors Enable classical try/catch way of handling errors
   * @returns A Promise with a single Document
   */
  findById(params: IFindByIdParams<Interface, false>): Promise<Either<Interface>>;
  findById(params: IFindByIdParams<Interface, true>): Promise<Interface>;
  findById(params: IFindByIdParams<Interface, boolean>): Promise<Either<Interface> | Interface> {
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
  find(params: IFindParams<Interface, false>): Promise<Either<Interface[]>>;
  find(params: IFindParams<Interface, true>): Promise<Interface[]>;
  find(params: IFindParams<Interface, boolean>): Promise<Either<Interface[]> | Interface[]> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const result: Interface[] = await _model
          .find(params.filter, params.fieldsToShow, params.pagination)
          .sort(params.sort)
          .lean(true);
        if (params.throwErrors) {
          resolve(result);
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
   * Finds the first Document that matchs the params
   * @param params.filter Object used to filter Documents
   * @param params.fieldsToShow Object containing the fields to return from the Documents
   * @param params.databaseName Set this to query on another database in the current mongo connection
   * @param params.throwErrors Enable classical try/catch way of handling errors
   * @returns A Promise with a single Document
   */
  findOne(params: IFindOneParams<Interface, false>): Promise<Either<Interface>>;
  findOne(params: IFindOneParams<Interface, true>): Promise<Interface>;
  findOne(params: IFindOneParams<Interface, boolean>): Promise<Either<Interface> | Interface> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const result = (await _model.findOne(params.filter, params.fieldsToShow).lean(true)) as any;
        if (params.throwErrors) {
          resolve(result);
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
   * Deletes a Mongoose Document
   * @param params.id A ObjectId from Mongoose schema
   * @param parms.databaseName Set this to query on another database in the current mongo connection
   * @param params.throwErrors Enable classical try/catch way of handling errors
   */
  delete(params: IDeleteParams<false>): Promise<Either<DeleteOp>>;
  delete(params: IDeleteParams<true>): Promise<DeleteOp>;
  delete(params: IDeleteParams<boolean>): Promise<Either<DeleteOp> | DeleteOp> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const result = (await _model.deleteOne({ _id: params.id }, { session: params.session }).lean(true)) as any;
        if (params.throwErrors) {
          resolve(result);
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
   * Delete many documents
   * @param params.fieldsToShow Object containing the fields to return from the Documents
   * @param params.databaseName Set this to query on another database in the current mongo connection
   * @param params.throwErrors Enable classical try/catch way of handling errors
   */
  deleteMany(params: IDeleteManyParams<Interface, false>): Promise<Either<DeleteOp>>;
  deleteMany(params: IDeleteManyParams<Interface, true>): Promise<DeleteOp>;
  deleteMany(params: IDeleteManyParams<Interface, boolean>): Promise<Either<DeleteOp> | DeleteOp> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        // The @ts-ignore above is here because @types/mongoose don't have correct typings for ModelOptions
        // @ts-ignore
        const result = await _model.deleteMany(params.filter, { session: params.session }).exec();
        if (params.throwErrors) {
          resolve(result);
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
   * Updates a Document
   * @param entity A object that matchs a mongoose schema with a currently know ObjectId
   * @param databaseName Set this to query on another database in the current mongo connection
   * @param session A mongoose session to handle transactions
   * @param params.throwErrors Enable classical try/catch way of handling errors
   */
  update(params: IUpdateParams<Interface, false>): Promise<Either<Interface>>;
  update(params: IUpdateParams<Interface, true>): Promise<Interface>;
  update(params: IUpdateParams<Interface, boolean>): Promise<Either<Interface> | Interface> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const result: Interface = (await _model
          .findOneAndUpdate(params.conditions, params.entity, { session: params.session, new: true })
          .exec()) as any;
        if (params.throwErrors) {
          resolve(result);
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
   * Save multiple documents
   * @param entities Array os objects to save
   * @param databaseName Set this to query on another database in the current mongo connection
   * @param session A mongoose session to handle transactions
   * @param params.throwErrors Enable classical try/catch way of handling errors
   */
  insertMany(params: IInsertManyParams<Interface, false>): Promise<Either<Interface[]>>;
  insertMany(params: IInsertManyParams<Interface, true>): Promise<Interface[]>;
  insertMany(params: IInsertManyParams<Interface, boolean>): Promise<Either<Interface[]> | Interface[]> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const result = (await _model.insertMany(params.entities, { session: params.session })) as any;
        if (params.throwErrors) {
          resolve(result);
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
   * Get the count of documents by a given filter
   * @param filter Object used to filter Documents
   * @param databaseName Set this to query on another database in the current mongo connection
   * @param params.throwErrors Enable classical try/catch way of handling errors
   */
  count(params: ICountParams<Interface, false>): Promise<Either<number>>;
  count(params: ICountParams<Interface, true>): Promise<number>;
  count(params: ICountParams<Interface, boolean>): Promise<Either<number> | number> {
    return new Promise(async resolve => {
      try {
        const _model = this.getModel(params.databaseName);
        const result = await _model.count(params.filter).exec();
        if (params.throwErrors) {
          resolve(result);
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
   * Return a distinct operation
   * @param field A string representing a field from [[Interface]]
   * @param filter Object used to filter Documents
   * @param databaseName Set this to query on another database in the current mongo connection
   * @param params.throwErrors Enable classical try/catch way of handling errors
   */
  distinct<T>(params: IDistinctParams<Interface, false>): Promise<Either<T[]>>;
  distinct<T>(params: IDistinctParams<Interface, true>): Promise<T[]>;
  distinct<T>(params: IDistinctParams<Interface, boolean>): Promise<Either<T[]> | T[]> {
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
