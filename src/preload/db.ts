import { ipcRenderer } from 'electron'

/**
 * Database API exposed to renderer via contextBridge.
 */
export const dbApi = {
  getById: <T>(table: string, id: number): Promise<T | null> =>
    ipcRenderer.invoke('db:getById', table, id),
  getAll: <T>(table: string): Promise<T[]> =>
    ipcRenderer.invoke('db:getAll', table),
  create: <T>(table: string, item: T): Promise<number> =>
    ipcRenderer.invoke('db:create', table, item),
  update: <T>(table: string, id: number, changes: Partial<T>): Promise<void> =>
    ipcRenderer.invoke('db:update', table, id, changes),
  delete: (table: string, id: number): Promise<void> =>
    ipcRenderer.invoke('db:delete', table, id)
}