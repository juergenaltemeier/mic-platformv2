// JSX runtime import not needed with React 17+ JSX transform
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { FileEntry } from '../types'

interface TagsPanelProps {
  tagOptions: { id: string; label: string }[]
  selected: FileEntry | null
  onToggleTag: (tag: string) => void
}

export function TagsPanel({ tagOptions, selected, onToggleTag }: TagsPanelProps) {
  return (
    <div className="overflow-auto bg-background p-2 border-t border-border">
      <h3 className="font-medium mb-2">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tagOptions.map(({ id, label }) => (
          <Tooltip key={id}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={selected?.tags.includes(id) ? 'secondary' : 'outline'}
                onClick={() => onToggleTag(id)}
              >
                {id}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}