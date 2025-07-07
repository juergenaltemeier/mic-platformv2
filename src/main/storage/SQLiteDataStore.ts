import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import { IDataStore } from '../../common/interfaces/db';

export class SQLiteDataStore implements IDataStore {
  private db: any;

  constructor(dbPath?: string) {
    const filePath = dbPath || path.join(app.getPath('userData'), 'data.sqlite');
    this.db = new Database(filePath);
  }

  async init(): Promise<void> {}

  async close(): Promise<void> {
    this.db.close();
  }

  async getById<T>(table: string, id: number): Promise<T | null> {
    const stmt = this.db.prepare(`SELECT * FROM ${table} WHERE id = ?`);
    const row = stmt.get(id);
    return (row as T) || null;
  }

  async getAll<T>(table: string): Promise<T[]> {
    const stmt = this.db.prepare(`SELECT * FROM ${table}`);
    return stmt.all() as T[];
  }

  async create<T>(table: string, item: Partial<T>): Promise<number> {
    const keys = Object.keys(item);
    const cols = keys.map(k => `\`${k}\``).join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map(k => (item as any)[k]);
    const stmt = this.db.prepare(
      `INSERT INTO ${table} (${cols}) VALUES (${placeholders})`
    );
    const result = stmt.run(...values);
    return result.lastInsertRowid as number;
  }

  async update<T>(table: string, id: number, changes: Partial<T>): Promise<void> {
    const keys = Object.keys(changes);
    const assignments = keys.map(k => `\`${k}\` = ?`).join(', ');
    const values = keys.map(k => (changes as any)[k]);
    const stmt = this.db.prepare(
      `UPDATE ${table} SET ${assignments} WHERE id = ?`
    );
    stmt.run(...values, id);
  }

  async delete(table: string, id: number): Promise<void> {
    const stmt = this.db.prepare(`DELETE FROM ${table} WHERE id = ?`);
    stmt.run(id);
  }
}