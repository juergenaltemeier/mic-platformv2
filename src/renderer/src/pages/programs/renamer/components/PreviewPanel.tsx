// JSX runtime import not needed with React 17+ JSX transform
import { FileEntry } from '../types'

interface PreviewPanelProps {
  selected: FileEntry | null
}

export function PreviewPanel({ selected }: PreviewPanelProps) {
  return (
    <div className="flex flex-col bg-background overflow-auto w-full">
      <div className="p-2 bg-popover border-b border-border">
        <h3 className="text-foreground font-medium">Preview</h3>
      </div>
      <div className="flex-1 flex items-center justify-center">
        {selected &&
          (selected.file.type.startsWith('image') ? (
            <img
              src={selected.previewUrl}
              className="max-h-full max-w-full object-contain"
              alt={selected.oldName}
            />
          ) : (
            <video
              src={selected.previewUrl}
              controls
              className="max-h-full max-w-full"
            />
          ))}
      </div>
    </div>
  )
}