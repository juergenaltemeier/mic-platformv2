import { useState, useRef, useCallback, useEffect } from 'react'
import { FileEntry } from '../types'
import tagsJson from '../config/tags.json'
import { defaults } from '../config/defaults'
import { fileToDataUrl } from '@/lib/utils'

/**
 * Custom hook for Renamer page state and logic
 */
export function useRenamer(): {
  files: FileEntry[];
  selected: FileEntry[];
  setSelected: React.Dispatch<React.SetStateAction<FileEntry[]>>;
  prefixNumber: string;
  setPrefixNumber: React.Dispatch<React.SetStateAction<string>>;
  handleImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImportFlat: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tagOptions: { id: string; label: string; }[];
  toggleTag: (tag: string) => void;
  handleTagsCellChange: (entry: FileEntry, tags: string[]) => void;
  handleSuffixChange: (entry: FileEntry, newSuffix: string) => void;
  getPreviewNames: () => string[];
  previewOpen: boolean;
  setPreviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  settingsOpen: boolean;
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  settings: {
    defaultImportFolder: string;
    allowedFileTypes: string[];
  };
  setSettings: React.Dispatch<React.SetStateAction<{
    defaultImportFolder: string;
    allowedFileTypes: string[];
  }>>;
  handleSetImportDirectory: () => Promise<void>;
  handleCompress: () => void;
  handleConvertHEIC: () => void;
  handleUndo: () => void;
  handleRemoveSelected: () => void;
  handleClearSuffix: () => void;
  handleClearAll: () => void;
  handleRestoreSession: () => void;
  handleDateChange: (entry: FileEntry, date: Date) => void;
  handleTagsInputChange: (entry: FileEntry, tagsString: string) => void;
  selectNext: () => void;
  selectPrev: () => void;
} {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [selected, setSelected] = useState<FileEntry[]>([])
  const [prefixNumber, setPrefixNumber] = useState<string>('')
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
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const fileList = e.target.files
    if (!fileList) return
    importFromEvent(fileList, true)
  }
  // Import only top-level files (flat)
  const handleImportFlat = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
  const toggleTag = (tag: string): void => {
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

  const handleTagsCellChange = (entry: FileEntry, tags: string[]): void => {
    const newFiles = files.map((f) => (f === entry ? { ...f, tags } : f));
    setFiles(newFiles);
    setSelected(newFiles.filter(f => selected.some(sel => sel.oldName === f.oldName)));
  };

  const handleDateChange = (
    entry: FileEntry,
    date: Date
  ): void => {
    const newFiles = files.map((f) => (f === entry ? { ...f, date: date.getTime() } : f))
    setFiles(newFiles)
    setSelected(newFiles.filter(f => selected.some(sel => sel.oldName === f.oldName)));
  }

  const handleSuffixChange = (
    entry: FileEntry,
    newSuffix: string
  ): void => {
    const newFiles = files.map((f) => (f === entry ? { ...f, suffix: newSuffix } : f));
    setFiles(newFiles);
    setSelected(newFiles.filter(f => selected.some(sel => sel.oldName === f.oldName)));
  };

  // Generate preview names based on prefix, base name, suffix, and extension
  const getPreviewNames = useCallback((): string[] => {
    return files.map((file) => {
      const idx = file.oldName.lastIndexOf('.')
      const base = idx >= 0 ? file.oldName.slice(0, idx) : file.oldName
      const ext = idx >= 0 ? file.oldName.slice(idx) : ''
      return `${prefixNumber}${base}${file.suffix}${ext}`
    })
  }, [files, prefixNumber])

  const handleSetImportDirectory = useCallback(async (): Promise<void> => {
    // placeholder for setting import directory
  }, [])

  const handleCompress = useCallback((): void => {
    // placeholder for compress action
  }, [])

  const handleConvertHEIC = useCallback((): void => {
    // placeholder for HEIC conversion action
  }, [])

  const handleUndo = useCallback((): void => {
    // placeholder for undo rename action
  }, [])

  const handleRemoveSelected = useCallback((): void => {
    setFiles((prev) => prev.filter((f) => !selected.includes(f)))
    setSelected([])
  }, [selected])

  const handleClearSuffix = useCallback((): void => {
    setFiles((prev) => prev.map((f) => ({ ...f, suffix: '' })))
  }, [])

  const handleClearAll = useCallback((): void => {
    setFiles([])
    setSelected([])
  }, [])

  const handleRestoreSession = useCallback((): void => {
    // placeholder for restore session action
  }, [])

  return {
    files,
    selected,
    setSelected,
    prefixNumber,
    setPrefixNumber,
    handleImport,
    handleImportFlat,
    // available tags list
    tagOptions,
    toggleTag,
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
  }
}
