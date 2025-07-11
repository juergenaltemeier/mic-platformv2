import React, { useMemo } from 'react'
import { DataGrid, type Column } from 'react-data-grid'
import 'react-data-grid/lib/styles.css'
import { FileEntry } from '../types'

interface FileGridProps {
  files: FileEntry[]
  selected: FileEntry[]
  setSelected: React.Dispatch<React.SetStateAction<FileEntry[]>>
}

const FileGrid: React.FC<FileGridProps> = ({ files, selected, setSelected }) => {
  const rows = useMemo(
    () =>
      files.map((file, index) => ({
        id: index,
        oldName: file.oldName,
        suffix: file.suffix,
        date: file.date,
        tags: file.tags.join(', '),
      })),
    [files]
  )

  const columns: Column<any>[] = useMemo(
    () => [
      { key: 'oldName', name: 'Filename', resizable: true, sortable: true },
      { key: 'suffix', name: 'Suffix', resizable: true },
      { key: 'date', name: 'Modified', resizable: true },
      { key: 'tags', name: 'Tags', resizable: true },
    ],
    []
  )

  const selectedRows = useMemo(() => {
    const setIds = new Set<number>()
    selected.forEach(sel => {
      const idx = files.indexOf(sel)
      if (idx >= 0) setIds.add(idx)
    })
    return setIds
  }, [selected, files])

  const onSelectedRowsChange = (newSelection: Set<number>) => {
    const newSelectionFiles = files.filter((_, idx) => newSelection.has(idx))
    setSelected(newSelectionFiles)
  }

  return (
    <div className="h-full">
      <DataGrid
        columns={columns}
        rows={rows}
        rowKeyGetter={row => row.id}
        selectedRows={selectedRows}
        onSelectedRowsChange={onSelectedRowsChange}
        rowHeight={32}
      />
    </div>
  )
}

export default FileGrid