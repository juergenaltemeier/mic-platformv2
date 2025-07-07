import { useState, useRef, useCallback, useEffect } from 'react'
import { FileEntry } from '../types'
import tagsJson from '../config/tags.json'
import { defaults } from '../config/defaults'
import { fileToDataUrl } from '@/lib/utils'

/**
 * Custom hook for Renamer page state and logic
 */
export function useRenamer() {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [selected, setSelected] = useState<FileEntry[]>([])
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
    defaultImportFolder: defaults.defaultImportDirectory,
    // initialize allowed file types from defaults, stripping leading dots
    allowedFileTypes: defaults.acceptedExtensions.map((ext) =>
      ext.replace(/^\./, '')
    ),
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
  const importFromEvent = async (
    filesList: FileList,
    recursive: boolean
  ) => {
    const fileArray = Array.from(filesList)
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

    const entries = await Promise.all(
      fileArray.map(async (f) => {
        const previewUrl = await fileToDataUrl(f)
        return {
          file: f,
          oldName: f.name,
          tags: [],
          date: f.lastModified,
          suffix: '',
          previewUrl: previewUrl,
        }
      })
    )

    setFiles(entries)
    if (entries.length > 0) setSelected([entries[0]])
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

  // Available tags loaded from JSON config, using selected language
  const tagOptions = Object.entries(tagsJson).map(([id, labels]) => ({
    id,
    label: (labels as Record<string, string>)[defaults.language] ||
           (labels as Record<string, string>)['en'] || id,
  }))

  // Toggle tag on selected files
  const toggleTag = (tag: string) => {
    if (selected.length === 0) return;

    const isSelectedInAll = selected.every(file => file.tags.includes(tag));

    const newFiles = files.map(file => {
      if (selected.some(sel => sel === file)) {
        const newTags = isSelectedInAll
          ? file.tags.filter(t => t !== tag)
          : [...new Set([...file.tags, tag])];
        return { ...file, tags: newTags };
      }
      return file;
    });

    setFiles(newFiles);
    setSelected(newFiles.filter(f => selected.some(sel => sel.oldName === f.oldName)));
  };

  const handleDateChange = (
    entry: FileEntry,
    date: Date
  ) => {
    const newFiles = files.map((f) => (f === entry ? { ...f, date: date.getTime() } : f))
    setFiles(newFiles)
    setSelected(newFiles.filter(f => selected.some(sel => sel.oldName === f.oldName)));
  }

  const handleSuffixChange = (
    entry: FileEntry,
    newSuffix: string
  ) => {
    const newFiles = files.map((f) => (f === entry ? { ...f, suffix: newSuffix } : f));
    setFiles(newFiles);
    setSelected(newFiles.filter(f => selected.some(sel => sel.oldName === f.oldName)));
  };
  
  // Update tags on a file entry from comma/space separated string
  const handleTagsInputChange = (
    entry: FileEntry,
    tagsString: string
  ) => {
    // Split tags by comma or semicolon separators
    const tagsArr = tagsString.split(/[;,]+/).map(t => t.trim()).filter(Boolean)
    const newFiles = files.map((f) => (f === entry ? { ...f, tags: tagsArr } : f))
    setFiles(newFiles)
    setSelected(newFiles.filter(f => selected.some(sel => sel.oldName === f.oldName)));
  }
  // Compress selected items (stub)
  const handleCompress = () => {
    console.log('Compress selected items', selected)
  }
  // Convert selected HEIC to JPEG (stub)
  const handleConvertHEIC = () => {
    console.log('Convert HEIC for selected items', selected)
  }
  // Undo rename (stub)
  const handleUndo = () => {
    console.log('Undo rename')
  }
  // Remove selected files
  const handleRemoveSelected = () => {
    if (selected.length > 0) {
      setFiles((prev) => prev.filter((f) => !selected.some(sel => sel === f)))
      setSelected([])
    }
  }
  // Clear suffix for selected files
  const handleClearSuffix = () => {
    if (selected.length > 0) {
      const newFiles = files.map(f => {
        if (selected.some(sel => sel === f)) {
          return { ...f, suffix: '' };
        }
        return f;
      });
      setFiles(newFiles);
      setSelected(newFiles.filter(f => selected.some(sel => sel.oldName === f.oldName)));
    }
  }
  // Clear all files
  const handleClearAll = () => {
    setFiles([])
    setSelected([])
  }
  // Restore session (stub)
  const handleRestoreSession = () => {
    console.log('Restore session (not implemented)')
  }
  // Set default import directory via native dialog
  const handleSetImportDirectory = async () => {
    try {
      const selectedDir: string | null = await window.electron.ipcRenderer.invoke(
        'dialog:selectDirectory',
        settings.defaultImportFolder
      )
      if (selectedDir) {
        setSettings({ ...settings, defaultImportFolder: selectedDir })
      }
    } catch {
      // ignore
    }
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

    const selectNext = () => {
    if (selected.length !== 1) return
    const currentIndex = files.findIndex((f) => f === selected[0])
    if (currentIndex < files.length - 1) {
      setSelected([files[currentIndex + 1]])
    }
  }

  const selectPrev = () => {
    if (selected.length !== 1) return
    const currentIndex = files.findIndex((f) => f === selected[0])
    if (currentIndex > 0) {
      setSelected([files[currentIndex - 1]])
    }
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
    // additional commands
    handleSetImportDirectory,
    handleCompress,
    handleConvertHEIC,
    handleUndo,
    handleRemoveSelected,
    handleClearSuffix,
    handleClearAll,
    handleRestoreSession,
    handleDateChange,
    handleTagsInputChange,
    selectNext,
    selectPrev,
  }
}