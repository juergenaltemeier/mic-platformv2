import type { ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ToolbarProps {
  onImport: (e: ChangeEvent<HTMLInputElement>) => void
  prefixNumber: string
  setPrefixNumber: (val: string) => void
  onPreview: () => void
}

export function Toolbar({
  onImport,
  prefixNumber,
  setPrefixNumber,
  onPreview,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-4 p-2 border-b">
      <label className="cursor-pointer px-3 py-1 bg-primary text-primary-foreground rounded">
        Import Folder
        <input
          {...({ webkitdirectory: true } as any)}
          type="file"
          multiple
          hidden
          accept="image/*,video/*"
          onChange={onImport}
        />
      </label>
      <div className="flex items-center space-x-1">
        <span className="font-medium">C</span>
        <Input
          value={prefixNumber}
          onChange={(e) => setPrefixNumber(e.target.value)}
          placeholder="123456"
          maxLength={6}
          className="w-24 text-center font-mono tracking-widest"
        />
      </div>
      <Button onClick={onPreview}>Rename Preview</Button>
    </div>
  )
}