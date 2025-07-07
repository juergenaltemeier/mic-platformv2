"use client"

import { getColumns } from './columns'
import { DataTable } from './data-table'
import { FileEntry } from '../types'
import { Row } from '@tanstack/react-table'

interface FilesTableProps {
  files: FileEntry[]
  setSelected: (files: FileEntry[]) => void
  getPreviewNames: () => string[]
  onDateChange: (entry: FileEntry, date: Date) => void
  onSuffixChange: (entry: FileEntry, newSuffix: string) => void
  selectedRows: FileEntry[]
}

export function FilesTable({ files, setSelected, getPreviewNames, onDateChange, onSuffixChange, selectedRows }: FilesTableProps) {
  const previewNames = getPreviewNames()
  const data = files.map((file, index) => ({
    ...file,
    newName: previewNames[index],
  }))

  const handleRowClick = (row: Row<FileEntry>) => {
    const isSelected = selectedRows.some(sel => sel.oldName === row.original.oldName);
    if (isSelected) {
        setSelected(selectedRows.filter(sel => sel.oldName !== row.original.oldName));
    } else {
        setSelected([...selectedRows, row.original]);
    }
  }

  const columns = getColumns({ onDateChange, onSuffixChange });

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} onRowClick={handleRowClick} />
    </div>
  )
}