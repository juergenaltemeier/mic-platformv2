// JSX runtime import not needed with React 17+ JSX transform
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

interface RenamePreviewSheetProps {
  names: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RenamePreviewSheet({
  names,
  open,
  onOpenChange,
}: RenamePreviewSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Rename Preview</SheetTitle>
          <SheetDescription>Review your new file names before renaming.</SheetDescription>
        </SheetHeader>
        <div className="p-4 space-y-1">
          {names.map((n) => (
            <div key={n} className="text-sm font-mono">
              {n}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}