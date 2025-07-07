import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      /** Database access API */
      db: {
        getById<T>(table: string, id: number): Promise<T | null>
        getAll<T>(table: string): Promise<T[]>
        create<T>(table: string, item: T): Promise<number>
        update<T>(table: string, id: number, changes: Partial<T>): Promise<void>
        delete(table: string, id: number): Promise<void>
      }
    }
  }
}
