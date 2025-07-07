import React from 'react'
import { useRenamer } from './hooks/useRenamer'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
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
    handleImport,
    handleImportFlat,
    handleSetImportDirectory,
    handleCompress,
    handleConvertHEIC,
    handleUndo,
    handleRemoveSelected,
    handleClearSuffix,
    handleClearAll,
    handleRestoreSession,
    tagOptions,
    toggleTag,
    handleSuffixChange,
    handleDateChange,
    handleTagsInputChange,
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
        onSetImportDirectory={handleSetImportDirectory}
        prefixNumber={prefixNumber}
        setPrefixNumber={setPrefixNumber}
        onPreview={() => setPreviewOpen(true)}
        allowedFileTypes={settings.allowedFileTypes}
        onCompress={handleCompress}
        onConvertHEIC={handleConvertHEIC}
        onUndo={handleUndo}
        onRemoveSelected={handleRemoveSelected}
        onClearSuffix={handleClearSuffix}
        onClearAll={handleClearAll}
        onRestoreSession={handleRestoreSession}
      />
      <ResizablePanelGroup direction="vertical" className="flex-1 overflow-hidden">
        <ResizablePanel defaultSize={70} minSize={20}>
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={30} minSize={10}>
                <PreviewPanel selected={selected} />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <FilesTable
                  files={files}
                  setSelected={setSelected}
                  onSuffixChange={handleSuffixChange}
                  onDateChange={handleDateChange}
                  onTagsChange={handleTagsInputChange}
                  availableTags={tagOptions.map(t => t.id)}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={20} minSize={10} className="overflow-auto">
          <TagsPanel allTags={tagOptions} selected={selected} toggleTag={toggleTag} />
        </ResizablePanel>
      </ResizablePanelGroup>
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