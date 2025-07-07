import React from 'react'
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

interface FilesTableProps {
  files: FileEntry[]
  selected: FileEntry | null
  setSelected: (f: FileEntry) => void
  onSuffixChange: (entry: FileEntry, e: React.ChangeEvent<HTMLInputElement>) => void
}

export function FilesTable({
  files,
  selected,
  setSelected,
  onSuffixChange,
}: FilesTableProps) {
  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="p-2">
        <h3 className="font-medium mb-2">Files</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Old Name</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Suffix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((f) => (
            <TableRow
              key={f.previewUrl}
              className="cursor-pointer"
              onClick={() => setSelected(f)}
              data-state={selected === f ? 'selected' : undefined}
            >
                <TableCell>{f.oldName}</TableCell>
                <TableCell>{f.tags.join(', ')}</TableCell>
                <TableCell>
                  {new Date(f.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Input
                    value={f.suffix}
                    onChange={(e) => onSuffixChange(f, e)}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}