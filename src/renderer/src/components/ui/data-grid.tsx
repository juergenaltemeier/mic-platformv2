import { DataGrid as ReactDataGrid } from 'react-data-grid'
import 'react-data-grid/lib/styles.css'

export interface DataGridProps<R = any> {
  columns: any[]
  rows: R[]
  [key: string]: any
}

export function DataGrid<R = any>({ columns, rows, ...props }: DataGridProps<R>) {
  return <ReactDataGrid<R> columns={columns} rows={rows} {...props} />
}