// JSX runtime import not needed with React 17+ JSX transform
import { FileEntry } from '../types'

interface PreviewPanelProps {
  selected: FileEntry | null
  width: number
}

export function PreviewPanel({ selected, width }: PreviewPanelProps) {
  return (
    <div
      className="flex flex-col bg-black overflow-auto"
      style={{ width }}
    >
      <div className="p-2 bg-gray-100">
        <h3 className="font-medium">Preview</h3>
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