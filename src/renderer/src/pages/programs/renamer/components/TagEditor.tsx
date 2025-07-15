import React from 'react'

interface TagEditorProps {
  value: string
  onChange: (value: string) => void
}

export function TagEditor({ value, onChange }: TagEditorProps): React.ReactElement {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rdg-editor-container"
    />
  )
}