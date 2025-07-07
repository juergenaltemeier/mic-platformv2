import { useRef, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu'
import { Input } from '@/components/ui/input'

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
    <Menubar className="w-full bg-background border-b border-border">
      <div className="flex items-center gap-2">
        {/* File Menu */}
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => fileInputRef.current?.click()}>Add Files</MenubarItem>
            <MenubarItem onSelect={() => flatInputRef.current?.click()}>Add Folder</MenubarItem>
            <MenubarItem onSelect={() => recInputRef.current?.click()}>Add Folder (recursive)</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onSelect={onSetImportDirectory}>Set Import Directory</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        {/* Hidden inputs for import */}
        <input
          type="file"
          multiple
          hidden
          ref={fileInputRef}
          accept={accept}
          onChange={onImport}
        />
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
        {/* Edit Menu */}
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={onCompress}>Compress</MenubarItem>
            <MenubarItem onSelect={onConvertHEIC}>Convert HEIC</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onSelect={onUndo}>Undo Rename</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onSelect={onRemoveSelected}>Remove Selected</MenubarItem>
            <MenubarItem onSelect={onClearSuffix}>Clear Suffix</MenubarItem>
            <MenubarItem onSelect={onClearAll}>Clear List</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onSelect={onRestoreSession}>Restore Session</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onSelect={onSettings}>Settings</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center space-x-1">
          <span className="font-bold">C</span>
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
    </Menubar>
  )
}