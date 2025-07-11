import React, { useState, useMemo } from 'react'
import { DataGrid } from '../../../components/ui/data-grid'
import type { Column, FormatterProps } from '../../../components/ui/data-grid'
import { PreviewPanel } from './components/PreviewPanel'
import { TagsPanel } from './components/TagsPanel'
import tagsConfig from './config/tags.json'
import { TagOption, FileEntry } from './types'
import { useTheme } from '../../../components/theme-provider'

export function Renamer(): React.ReactElement {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
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
      const prefix = f.tags.join('_')
      const newName = prefix ? `${prefix}_${f.oldName}` : f.oldName
      console.log(`Rename: ${f.oldName} → ${newName}`)
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
        formatter: ({ row }) => row.tags.join(', '),
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
        <button
          onClick={handleRename}
          disabled={selectedFiles.length === 0}
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
            className={theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'rdg-dark' : 'rdg-light') : (theme === 'dark' ? 'rdg-dark' : 'rdg-light')}
          />
        </div>
      </div>
    </div>
  )
}