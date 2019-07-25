export interface DatabaseConnection {
  /**
   * Connect to the database
   */
  connect(): Promise<this>;
  /**
   * Get the connection object
   */
  getConnection(): any;
  /**
   * Closes the connection to database
   */
  disconnect(): Promise<void>;
  /**
   * Run a callback function against the connection property
   * @param cb Callback function
   */
  run(cb: (...args: any[]) => any): void;
}
