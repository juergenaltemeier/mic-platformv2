"use client"

import { columns } from './columns'
import { DataTable } from './data-table'
import { FileEntry } from '../types'
import { Row } from '@tanstack/react-table'

interface FilesTableProps {
  files: FileEntry[]
  setSelected: (file: FileEntry | null) => void
  getPreviewNames: () => string[]
}

export function FilesTable({ files, setSelected, getPreviewNames }: FilesTableProps) {
  const previewNames = getPreviewNames()
  const data = files.map((file, index) => ({
    ...file,
    newName: previewNames[index],
  }))

  const handleRowClick = (row: Row<FileEntry>) => {
    setSelected(row.original)
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} onRowClick={handleRowClick} />
    </div>
  )
}