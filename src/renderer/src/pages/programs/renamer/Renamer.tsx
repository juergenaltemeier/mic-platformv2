import React from 'react'
import { useRenamer } from './hooks/useRenamer'
import { Toolbar } from './components/Toolbar'
import { PreviewPanel } from './components/PreviewPanel'
import { FilesTable } from './components/FilesTable'
import { TagsPanel } from './components/TagsPanel'
import { RenamePreviewSheet } from './components/RenamePreviewSheet'
import { SettingsDialog } from './components/SettingsDialog'

export function Renamer(): React.ReactElement {
  const {
    files,
    selected,
    setSelected,
    prefixNumber,
    setPrefixNumber,
    previewWidth,
    onGutterMouseDown,
    handleImport,
    handleImportFlat,
    tagOptions,
    toggleTag,
    handleSuffixChange,
    getPreviewNames,
    previewOpen,
    setPreviewOpen,
    settingsOpen,
    setSettingsOpen,
    settings,
    setSettings,
  } = useRenamer()

  const previewNames = getPreviewNames()

  return (
    <div className="h-full w-full flex flex-col">
      <Toolbar
        onImport={handleImportFlat}
        onImportRecursive={handleImport}
        onSettings={() => setSettingsOpen(true)}
        prefixNumber={prefixNumber}
        setPrefixNumber={setPrefixNumber}
        onPreview={() => setPreviewOpen(true)}
        allowedFileTypes={settings.allowedFileTypes}
      />
      <div className="flex flex-1 overflow-hidden">
        <PreviewPanel selected={selected} width={previewWidth} />
        <div
          className="w-1 cursor-col-resize bg-gray-200"
          onMouseDown={onGutterMouseDown}
        />
        <FilesTable
          files={files}
          selected={selected}
          setSelected={setSelected}
          onSuffixChange={handleSuffixChange}
        />
      </div>
      <TagsPanel allTags={tagOptions} selected={selected} toggleTag={toggleTag} />
      <RenamePreviewSheet
        names={previewNames}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        setSettings={setSettings}
      />
    </div>
  )
}