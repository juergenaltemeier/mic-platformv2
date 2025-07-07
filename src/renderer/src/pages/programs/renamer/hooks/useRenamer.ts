import { useState, useRef, useCallback, useEffect } from 'react'
import { FileEntry } from '../types'

/**
 * Custom hook for Renamer page state and logic
 */
export function useRenamer() {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [selected, setSelected] = useState<FileEntry | null>(null)
  const [prefixNumber, setPrefixNumber] = useState<string>('')
  const [previewWidth, setPreviewWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth * 0.4 : 400
  )
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  // Settings dialog open state
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
  // Renamer settings persisted in localStorage
  interface RenamerSettings {
    defaultImportFolder: string
    allowedFileTypes: string[]
  }
  const defaultSettings: RenamerSettings = {
    defaultImportFolder: '',
    allowedFileTypes: [
      'jpg', 'jpeg', 'png', 'gif', 'bmp',
      'mp4', 'mov', 'avi', 'mkv',
    ],
  }
  const [settings, setSettings] = useState<RenamerSettings>(defaultSettings)
  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('renamerSettings')
      if (stored) {
        setSettings(JSON.parse(stored))
      }
    } catch {
      // ignore parse errors
    }
  }, [])
  // Persist settings to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('renamerSettings', JSON.stringify(settings))
    } catch {
      // ignore storage errors
    }
  }, [settings])

  // Helper to import files from a folder event (recursive or flat)
  const importFromEvent = (
    filesList: FileList,
    recursive: boolean
  ) => {
    const entries: FileEntry[] = Array.from(filesList)
      // filter by allowed file extensions
      .filter((f) => {
        const parts = f.name.split('.')
        const ext = parts.length > 1 ? parts.pop()!.toLowerCase() : ''
        return settings.allowedFileTypes.includes(ext)
      })
      // filter by mime type image/video
      .filter((f) => f.type.startsWith('image') || f.type.startsWith('video'))
      .filter((f: any) => {
        if (recursive) return true
        const path = (f as any).webkitRelativePath as string | undefined
        if (!path) return true
        // flat: only top-level files (no extra subdirectories)
        return path.split('/').length <= 2
      })
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

  // Import all files recursively
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList) return
    importFromEvent(fileList, true)
  }
  // Import only top-level files (flat)
  const handleImportFlat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList) return
    importFromEvent(fileList, false)
  }

  // Available tags with descriptions
  const tagOptions = [
    { id: 'AU', label: 'Autoclave' },
    { id: 'VC', label: 'Vacuum Unit' },
    { id: 'HS', label: 'Heating System' },
  ]

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
    handleImportFlat,
    // available tags list
    tagOptions,
    toggleTag,
    handleSuffixChange,
    getPreviewNames,
    previewOpen,
    setPreviewOpen,
    settingsOpen,
    setSettingsOpen,
    // renamer settings
    settings,
    setSettings,
  }
}