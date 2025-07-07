import { useState, useRef, useCallback } from 'react'
import { FileEntry } from '../types'

/**
 * Custom hook for Renamer page state and logic
 */
export function useRenamer() {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [selected, setSelected] = useState<FileEntry | null>(null)
  const [prefixNumber, setPrefixNumber] = useState<string>('')
  const [previewWidth, setPreviewWidth] = useState<number>(400)
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)

  // Import folder via input[webkitdirectory]
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList) return
    const entries: FileEntry[] = Array.from(fileList)
      .filter((f) => f.type.startsWith('image') || f.type.startsWith('video'))
      .map((f) => ({
        file: f,
        oldName: f.name,
        tags: [],
        date: f.lastModified,
        suffix: '',
        previewUrl: URL.createObjectURL(f),
      }))
    setFiles(entries)
    if (entries.length > 0) setSelected(entries[0])
  }

  // All unique tags from files
  const allTags = Array.from(new Set(files.flatMap((f) => f.tags)))

  // Toggle tag on selected file
  const toggleTag = (tag: string) => {
    if (!selected) return
    const newTags = selected.tags.includes(tag)
      ? selected.tags.filter((t) => t !== tag)
      : [...selected.tags, tag]
    const newFiles = files.map((f) => (f === selected ? { ...f, tags: newTags } : f))
    setFiles(newFiles)
    setSelected({ ...selected, tags: newTags })
  }

  // Update suffix on a file entry
  const handleSuffixChange = (
    entry: FileEntry,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSuffix = e.target.value
    const newFiles = files.map((f) => (f === entry ? { ...f, suffix: newSuffix } : f))
    setFiles(newFiles)
    if (selected === entry) setSelected({ ...entry, suffix: newSuffix })
  }

  // Generate preview names for rename
  const getPreviewNames = useCallback((): string[] => {
    const prefix = prefixNumber ? `C${prefixNumber}` : 'C'
    const formatDate = (d: number) => {
      const dt = new Date(d)
      return `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, '0')}${String(
        dt.getDate()
      ).padStart(2, '0')}`
    }
    return files.map((f, i) => {
      const tagsPart = f.tags.join('-') || 'NOTAGS'
      const datePart = formatDate(f.date)
      const inc = files.length > 1 ? `_${i + 1}` : ''
      const suffixPart = f.suffix ? `_${f.suffix}` : ''
      return `${prefix}_${tagsPart}_${datePart}${inc}${suffixPart}`
    })
  }, [files, prefixNumber])

  // Resize logic for preview/table splitter
  const gutterDrag = useRef<{ startX: number; startWidth: number } | null>(null)
  const onMouseMove = useCallback((e: MouseEvent) => {
    const gd = gutterDrag.current
    if (!gd) return
    const dx = e.clientX - gd.startX
    setPreviewWidth(Math.max(100, gd.startWidth + dx))
  }, [])
  const onMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    gutterDrag.current = null
  }, [onMouseMove])
  const onGutterMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    gutterDrag.current = { startX: e.clientX, startWidth: previewWidth }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return {
    files,
    selected,
    setSelected,
    prefixNumber,
    setPrefixNumber,
    previewWidth,
    onGutterMouseDown,
    handleImport,
    allTags,
    toggleTag,
    handleSuffixChange,
    getPreviewNames,
    previewOpen,
    setPreviewOpen,
  }
}