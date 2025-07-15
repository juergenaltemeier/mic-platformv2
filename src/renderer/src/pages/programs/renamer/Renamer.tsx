import React, { useState, useMemo } from 'react'
import { DataGrid } from '../../../components/ui/data-grid'
import type { Column, FormatterProps } from '../../../components/ui/data-grid'
import { PreviewPanel } from './components/PreviewPanel'
import { TagsPanel } from './components/TagsPanel'
import { textEditor } from 'react-data-grid'
import tagsConfig from './config/tags.json'
import { TagOption, FileEntry } from './types'
import { useTheme } from '../../../components/theme-provider'

export function Renamer(): React.ReactElement {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [cNumber, setCNumber] = useState<string>('')
  const { theme } = useTheme()

  const tagOptions: TagOption[] = useMemo(
    () => Object.entries(tagsConfig).map(([id, val]) => ({ id, label: (val as any).en })),
    []
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files
    if (!list) return
    const arr: FileEntry[] = Array.from(list).map((file) => ({
      file,
      oldName: file.name,
      tags: [],
      date: '',
      suffix: '',
      previewUrl: URL.createObjectURL(file),
    }))
    setFiles(arr)
    setSelectedRows(new Set())
  }

  const onToggleTag = (tagId: string) => {
    setFiles((prev) =>
      prev.map((f, idx) => {
        if (!selectedRows.has(idx)) return f
        const has = f.tags.includes(tagId)
        const tags = has ? f.tags.filter((t) => t !== tagId) : [...f.tags, tagId]
        return { ...f, tags }
      })
    )
  }

  const handleRename = () => {
    files.forEach((f, idx) => {
      if (!selectedRows.has(idx)) return
      const cNumberPrefix = cNumber ? `C${cNumber}_` : ''
      const tagsPart = f.tags.length > 0 ? `${f.tags.join('_')}_` : ''
      const datePart = f.date ? `${f.date}_` : ''
      const suffixPart = f.suffix ? `${f.suffix}_` : ''
      const newName = `${cNumberPrefix}${tagsPart}${datePart}${suffixPart}${f.oldName}`
      console.log(`Rename: ${f.oldName} → ${newName}`)
      // TODO: Use Electron API to actually rename on disk
    })
  }

  const selectedFiles = useMemo(
    () => files.filter((_, idx) => selectedRows.has(idx)),
    [files, selectedRows]
  )

  const columns = useMemo<Column<FileEntry>[]>(
    () => [
      {
        key: 'checkbox',
        name: '',
        width: 30,
        renderHeaderCell: () => (
          <input
            type="checkbox"
            checked={files.length > 0 && selectedRows.size === files.length}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRows(new Set(files.map((_, i) => i)))
              } else {
                setSelectedRows(new Set())
              }
            }}
          />
        ),
        renderCell: ({ row, tabIndex }) => (
          <input
            type="checkbox"
            checked={selectedRows.has(files.indexOf(row))}
            onChange={(e) => {
              const copy = new Set(selectedRows)
              const idx = files.indexOf(row)
              if (e.target.checked) copy.add(idx)
              else copy.delete(idx)
              setSelectedRows(copy)
            }}
            tabIndex={tabIndex}
          />
        ),
      },
      {
        key: 'oldName',
        name: 'Filename',
        resizable: true,
      },
      {
        key: 'tags',
        name: 'Tags',
        resizable: true,
        editable: true,
        renderEditCell: ({ row, onRowChange, column, onClose }) => (
          <input
            type="text"
            value={row.tags.join(', ')}
            onChange={(e) => onRowChange({ ...row, tags: e.target.value.split(', ').map(tag => tag.trim()) })}
            onBlur={() => onClose(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onClose(true)
              if (e.key === 'Escape') onClose(false)
            }}
            autoFocus
          />
        ),
        formatter: ({ row }) => row.tags.join(', '),
      },
      {
        key: 'date',
        name: 'Date',
        resizable: true,
        formatter: ({ row }) => row.date,
      },
      {
        key: 'suffix',
        name: 'Suffix',
        resizable: true,
        editable: true,
        renderEditCell: (props) => (
          <textEditor
            {...props}
            value={props.row.suffix}
            onChange={(value) => props.onRowChange({ ...props.row, suffix: value })}
          />
        ),
        formatter: ({ row }) => row.suffix,
      },
      {
        key: 'newName',
        name: 'New Name',
        resizable: true,
        formatter: ({ row }) => {
          const prefix = row.tags.join('_')
          return prefix ? `${prefix}_${row.oldName}` : row.oldName
        },
      },
    ],
    [files, selectedRows]
  )

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="p-2 border-b flex items-center gap-4">
        <input type="file" multiple onChange={handleFileChange} />
        <label htmlFor="cNumberInput">C Number:</label>
        <input
          id="cNumberInput"
          type="text"
          value={cNumber}
          onChange={(e) => {
            const value = e.target.value
            if (/^\d{0,6}$/.test(value)) {
              setCNumber(value)
            }
          }}
          maxLength={6}
          placeholder="e.g., 230105"
          className="border p-1 rounded"
        />
        <button
          onClick={handleRename}
          disabled={selectedFiles.length === 0 || cNumber.length !== 6}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Rename Selected
        </button>
      </div>
      <div className="flex flex-1">
        {/* Left panels (preview + tags) */}
        <div className="flex flex-col w-1/3 border-r border-gray-200">
          <div className="flex-1 border-b border-gray-200">
            <PreviewPanel selected={selectedFiles[0] ?? null} />
          </div>
          <div className="flex-1">
            <TagsPanel tagOptions={tagOptions} selected={selectedFiles} onToggleTag={onToggleTag} />
          </div>
        </div>
        {/* Table view */}
        <div className="flex-1 overflow-auto">
          <DataGrid
            columns={columns}
            rows={files}
            rowKeyGetter={(row) => files.indexOf(row)}
            onRowsChange={setFiles}
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
            />
        </div>
      </div>
    </div>
  )
}