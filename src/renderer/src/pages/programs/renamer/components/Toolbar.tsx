import { useRef, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ChevronDownIcon } from 'lucide-react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

interface ToolbarProps {
  onImport: (e: ChangeEvent<HTMLInputElement>) => void
  onImportRecursive: (e: ChangeEvent<HTMLInputElement>) => void
  onSettings: () => void
  onSetImportDirectory: () => void
  prefixNumber: string
  setPrefixNumber: (val: string) => void
  onPreview: () => void
  allowedFileTypes: string[]
  onCompress: () => void
  onConvertHEIC: () => void
  onUndo: () => void
  onRemoveSelected: () => void
  onClearSuffix: () => void
  onClearAll: () => void
  onRestoreSession: () => void
}

export function Toolbar({
  onImport,
  onImportRecursive,
  onSettings,
  onSetImportDirectory,
  prefixNumber,
  setPrefixNumber,
  onPreview,
  allowedFileTypes,
  onCompress,
  onConvertHEIC,
  onUndo,
  onRemoveSelected,
  onClearSuffix,
  onClearAll,
  onRestoreSession,
}: ToolbarProps) {
  const flatInputRef = useRef<HTMLInputElement>(null)
  const recInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // build accept string from allowed file types
  const accept = allowedFileTypes.map((ext) => `.${ext}`).join(',')
  return (
    <div className="w-full bg-background border-b border-border">
      <div className="flex items-start justify-start gap-4 p-2">
        {/* File Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-1">
              File <ChevronDownIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
              Add Files
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => flatInputRef.current?.click()}>
              Add Folder
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => recInputRef.current?.click()}>
              Add Folder (recursive)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onSetImportDirectory}>
              Set Import Directory
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Edit Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-1">
              Edit <ChevronDownIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={onCompress}>Compress</DropdownMenuItem>
            <DropdownMenuItem onSelect={onConvertHEIC}>Convert HEIC</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onUndo}>Undo Rename</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onRemoveSelected}>Remove Selected</DropdownMenuItem>
            <DropdownMenuItem onSelect={onClearSuffix}>Clear Suffix</DropdownMenuItem>
            <DropdownMenuItem onSelect={onClearAll}>Clear List</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onRestoreSession}>Restore Session</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onSettings}>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Prefix Input */}
        <div className="flex items-center space-x-2">
          <span className="font-bold">C</span>
          <InputOTP
            maxLength={6}
            value={prefixNumber}
            onChange={setPrefixNumber}
            containerClassName=""
            className="gap-1"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        {/* Preview Button */}
        <Button onClick={onPreview}>Rename Preview</Button>
      </div>
      {/* Hidden inputs for import actions */}
      <input type="file" multiple hidden ref={fileInputRef} accept={accept} onChange={onImport} />
      <input
        {...({ webkitdirectory: true } as any)}
        type="file"
        multiple
        hidden
        ref={flatInputRef}
        accept={accept}
        onChange={onImport}
      />
      <input
        {...({ webkitdirectory: true } as any)}
        type="file"
        multiple
        hidden
        ref={recInputRef}
        accept={accept}
        onChange={onImportRecursive}
      />
    </div>
  )
}