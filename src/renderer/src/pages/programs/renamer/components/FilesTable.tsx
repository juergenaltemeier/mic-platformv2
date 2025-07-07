import React, { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  RowSelectionState,
  ColumnVisibilityState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { FileEntry } from '../types'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface FilesTableProps {
  files: FileEntry[]
  setSelected: (entry: FileEntry) => void
  // handlers from hook
  onSuffixChange: (entry: FileEntry, e: React.ChangeEvent<HTMLInputElement>) => void
  onDateChange: (entry: FileEntry, dateString: string) => void
  onTagsChange: (entry: FileEntry, tagsString: string) => void
  availableTags: string[]
}

export function FilesTable({ files, setSelected, onSuffixChange, onDateChange, onTagsChange, availableTags }: FilesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({})
  const [toast, setToast] = useState<string | null>(null)

  const columns = React.useMemo<ColumnDef<FileEntry, any>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          className="cursor-pointer"
          checked={table.getIsAllPageRowsSelected()}
          onChange={e => table.getToggleAllPageRowsSelectedHandler()(e.target.checked)}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="cursor-pointer"
          checked={row.getIsSelected()}
          onChange={e => row.getToggleSelectedHandler()(e.target.checked)}
        />
      ),
    },
    {
      accessorKey: 'oldName',
      header: 'Old Name',
      cell: info => info.getValue(),
    },
    // Tags column
    {
      id: 'tags',
      header: 'Tags',
      cell: ({ row }) => {
        const entry = row.original
        return (
          <Input
            value={entry.tags.join(', ')}
            onChange={e => onTagsChange(entry, e.target.value)}
            onBlur={e => {
              const val = e.target.value
              const tagsArr = val.split(/[;,]+/).map(t => t.trim()).filter(Boolean)
              const invalid = tagsArr.filter(t => !availableTags.includes(t))
              if (invalid.length) {
                setToast(`Invalid tags: ${invalid.join(', ')}`)
                setTimeout(() => setToast(null), 5000)
              }
              onTagsChange(entry, val)
            }}
            className="w-full"
          />
        )
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const entry = row.original
        const dateStr = new Date(entry.date).toISOString().slice(0, 10)
        return (
          <Input
            type="date"
            value={dateStr}
            onChange={e => onDateChange(entry, e.target.value)}
            className="w-full"
          />
        )
      },
      enableSorting: true,
    },
    {
      id: 'suffix',
      header: 'Suffix',
      cell: ({ row }) => {
        const entry = row.original
        return (
          <Input
            value={entry.suffix}
            onChange={e => onSuffixChange(entry, e)}
            onBlur={e => {
              const formatted = e.target.value.split(' ').join('-')
              e.target.value = formatted
              onSuffixChange(entry, e)
            }}
            className="w-full"
          />
        )
      },
    },
  ], [onSuffixChange, onDateChange, onTagsChange])

  const table = useReactTable({
    data: files,
    columns,
    state: { sorting, columnFilters, rowSelection, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="p-2">
      <div className="flex items-center justify-between pb-2">
        <Input
          placeholder="Filter Old Name..."
          value={(table.getColumn('oldName')?.getFilterValue() as string) ?? ''}
          onChange={e => table.getColumn('oldName')?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {table.getAllColumns().filter(col => col.id !== 'select').map(col => (
              <DropdownMenuItem key={col.id} onSelect={() => col.toggleVisibility(!col.getIsVisible())}>
                <input
                  type="checkbox"
                  checked={col.getIsVisible()}
                  onChange={() => col.toggleVisibility(!col.getIsVisible())}
                  className="mr-2"
                />
                {col.id}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        onClick: header.column.getToggleSortingHandler(),
                        className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow
              key={row.id}
              className="cursor-pointer"
              data-state={row.getIsSelected() ? 'selected' : undefined}
              onClick={() => setSelected(row.original)}
            >
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}