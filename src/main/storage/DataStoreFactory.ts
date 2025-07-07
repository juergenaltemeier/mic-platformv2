// path and electron app not required for JSON-backed store
import { IDataStore } from '../../common/interfaces/db'
import { PostgresDataStore } from './PostgresDataStore'
import { LocalJsonDataStore } from './LocalJsonDataStore'

export function createDataStore(): IDataStore {
  if (process.env.NODE_ENV === 'production' && process.env.DB_HOST) {
    return new PostgresDataStore({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }
  // default to a JSON-backed store for local preferences and tags
  return new LocalJsonDataStore()
}