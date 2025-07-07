// Ambient module declarations for database dependencies
declare module 'better-sqlite3' {
  interface Database {
    prepare(sql: string): { run(...args: any[]): any; get?(...args: any[]): any; all?(...args: any[]): any }
    close(): void
  }
  const Database: {
    new (path: string, options?: any): Database
  }
  export default Database
}
declare module 'pg' {
  export interface PoolConfig {
    [key: string]: any
  }
  export class Pool {
    constructor(config?: PoolConfig)
    query(text: string, params?: any[]): Promise<{ rows: any[] }>
    end(): Promise<void>
  }
}