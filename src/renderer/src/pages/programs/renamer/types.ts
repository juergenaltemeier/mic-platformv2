// FileEntry and related types for the Renamer tool
export interface FileEntry {
  file: File
  oldName: string
  tags: string[]
  date: number
  suffix: string
  previewUrl: string
}