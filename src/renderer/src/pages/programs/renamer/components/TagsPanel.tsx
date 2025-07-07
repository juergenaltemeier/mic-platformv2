// JSX runtime import not needed with React 17+ JSX transform
import { Button } from '@/components/ui/button'
import { FileEntry } from '../types'

interface TagsPanelProps {
  allTags: string[]
  selected: FileEntry | null
  toggleTag: (tag: string) => void
}

export function TagsPanel({ allTags, selected, toggleTag }: TagsPanelProps) {
  return (
    <div className="overflow-auto bg-gray-50 p-2 border-t">
      <h3 className="font-medium mb-2">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <Button
            key={tag}
            size="sm"
            variant={
              selected?.tags.includes(tag) ? 'secondary' : 'outline'
            }
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  )
}