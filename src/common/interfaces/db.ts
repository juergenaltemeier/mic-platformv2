export interface IDataStore {
  /**
   * Initialize the data store (e.g., run migrations).
   */
  init(): Promise<void>;
  /**
   * Close the data store and release resources.
   */
  close(): Promise<void>;

  /**
   * Fetch a single record by its numeric ID from the specified table.
   */
  getById<T>(table: string, id: number): Promise<T | null>;
  /**
   * Fetch all records from the specified table.
   */
  getAll<T>(table: string): Promise<T[]>;
  /**
   * Insert a new record into the specified table. Returns the new record's ID.
   */
  create<T>(table: string, item: Partial<T>): Promise<number>;
  /**
   * Update an existing record by ID in the specified table.
   */
  update<T>(table: string, id: number, changes: Partial<T>): Promise<void>;
  /**
   * Delete a record by ID from the specified table.
   */
  delete(table: string, id: number): Promise<void>;
}