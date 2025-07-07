import fs from 'fs/promises'
import path from 'path'
import { app } from 'electron'
import { IDataStore } from '../../common/interfaces/db'

export class LocalJsonDataStore implements IDataStore {
  private filePath: string
  private data: Record<string, any[]> = {}

  constructor(dbPath?: string) {
    this.filePath = dbPath || path.join(app.getPath('userData'), 'data.json')
  }

  async init(): Promise<void> {
    try {
      const content = await fs.readFile(this.filePath, 'utf-8')
      this.data = JSON.parse(content)
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        this.data = {}
        await this.save()
      } else {
        throw err
      }
    }
  }

  async close(): Promise<void> {
    // no-op for file-based store
  }

  private getCollection(table: string): any[] {
    if (!this.data[table]) {
      this.data[table] = []
    }
    return this.data[table]
  }

  async getById<T>(table: string, id: number): Promise<T | null> {
    const col = this.getCollection(table)
    const item = col.find((entry: any) => entry.id === id)
    return (item as T) || null
  }

  async getAll<T>(table: string): Promise<T[]> {
    return [...this.getCollection(table)] as T[]
  }

  async create<T>(table: string, item: Partial<T>): Promise<number> {
    const col = this.getCollection(table)
    const maxId = col.reduce((max: number, entry: any) =>
      entry.id > max ? entry.id : max
    , 0)
    const id = maxId + 1
    const newItem = { ...item, id } as any
    col.push(newItem)
    await this.save()
    return id
  }

  async update<T>(table: string, id: number, changes: Partial<T>): Promise<void> {
    const col = this.getCollection(table)
    const idx = col.findIndex((entry: any) => entry.id === id)
    if (idx === -1) return
    col[idx] = { ...col[idx], ...changes }
    await this.save()
  }

  async delete(table: string, id: number): Promise<void> {
    this.data[table] = this.getCollection(table).filter(
      (entry: any) => entry.id !== id
    )
    await this.save()
  }

  private async save(): Promise<void> {
    await fs.writeFile(
      this.filePath,
      JSON.stringify(this.data, null, 2),
      'utf-8'
    )
  }
}