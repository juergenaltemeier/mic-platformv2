import { Pool, PoolConfig } from 'pg';
import { IDataStore } from '../../common/interfaces/db';

export class PostgresDataStore implements IDataStore {
  private pool: Pool;

  constructor(config: PoolConfig) {
    this.pool = new Pool(config);
  }

  async init(): Promise<void> {}

  async close(): Promise<void> {
    await this.pool.end();
  }

  async getById<T>(table: string, id: number): Promise<T | null> {
    const res = await this.pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
    return (res.rows[0] as T) || null;
  }

  async getAll<T>(table: string): Promise<T[]> {
    const res = await this.pool.query(`SELECT * FROM ${table}`);
    return res.rows as T[];
  }

  async create<T>(table: string, item: Partial<T>): Promise<number> {
    const keys = Object.keys(item);
    const cols = keys.map(k => `"${k}"`).join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const values = keys.map(k => (item as any)[k]);
    const res = await this.pool.query(
      `INSERT INTO ${table} (${cols}) VALUES (${placeholders}) RETURNING id`,
      values
    );
    return (res.rows[0] as any).id as number;
  }

  async update<T>(table: string, id: number, changes: Partial<T>): Promise<void> {
    const keys = Object.keys(changes);
    const assignments = keys
      .map((k, i) => `"${k}" = $${i + 1}`)
      .join(', ');
    const values = keys.map(k => (changes as any)[k]);
    await this.pool.query(
      `UPDATE ${table} SET ${assignments} WHERE id = $${keys.length + 1}`,
      [...values, id]
    );
  }

  async delete(table: string, id: number): Promise<void> {
    await this.pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  }
}