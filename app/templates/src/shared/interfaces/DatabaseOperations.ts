import { Pagination } from './PaginationInterface';

export interface DatabaseOperations<T> {
  /**
   * Persist a given entity to database
   * @param entity
   */
  save(entity: T): Promise<T>;
  /**
   * Finds a entity by ID
   * @param id Can be a string or number
   * @param args Custom args
   */
  findById(id: string | number, ...args: any[]): Promise<T>;
  /**
   * Finds entities by a given number of filters
   * @param params.filter Object used to filter the find query
   * @param params.pagination Object that describes pagination
   * @param params.sort Result sort order
   * @param params.fieldsToShow Object that handles what fields will be shown
   * @param args Custom args
   */
  find(
    params: {
      filter: any;
      pagination?: Pagination;
      sort?: string;
      fieldsToShow?: any;
    },
    ...args: any[]
  ): Promise<T[]>;
  /**
   * Finds entities by a given number of filters
   * @param params.filter Object used to filter the find query
   * @param params.pagination Object that describes pagination
   * @param params.sort Result sort order
   * @param params.fieldsToShow Object that handles what fields will be shown
   * @param args Custom args
   */
  findOne(
    params: {
      filter: any;
      pagination?: Pagination;
      sort?: string;
      fieldsToShow?: any;
    },
    ...args: any[]
  ): Promise<T>;
  /**
   * Deletes a entitty by a given id
   * @param id Entity's ID
   * @param args Custom args
   */
  delete(id: string, ...args: any[]): void;
  /**
   * Updates a entity
   * @param entity
   */
  update(entity: T): Promise<T>;
  /**
   * Inserts multiple entities
   * @param entities
   */
  saveMultiple(entities: T[]): Promise<T[]>;
}
