import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Toolbar } from "./components/Toolbar"
import { useRenamer } from "./hooks/useRenamer"
import { FilesTable } from "./components/FilesTable"
import { PreviewPanel } from "./components/PreviewPanel"
import { TagsPanel } from "./components/TagsPanel"
import { RenamePreviewSheet } from "./components/RenamePreviewSheet"
import { useRef } from "react"

import { TooltipProvider } from "@/components/ui/tooltip"

export const Renamer = (): React.ReactElement => {
  const {
    files,
    selected,
    setSelected,
    prefixNumber,
    setPrefixNumber,
    handleImport,
    handleImportFlat,
    getPreviewNames,
    previewOpen,
    setPreviewOpen,
    handleClearAll,
    handleRemoveSelected,
    settings,
    handleClearSuffix,
    handleRestoreSession,
    setSettingsOpen,
    handleSetImportDirectory,
    handleCompress,
    handleConvertHEIC,
    handleUndo,
    selectNext,
    selectPrev,
    handleDateChange,
    handleSuffixChange,
    toggleTag,
    tagOptions,
    handleTagsCellChange,
    handleColumnResize,
  } = useRenamer()

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (tableContainerRef.current && !tableContainerRef.current.contains(e.target as Node)) {
      setSelected([]);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full" onClick={handleContainerClick}>
        <Toolbar
          prefixNumber={prefixNumber}
          setPrefixNumber={setPrefixNumber}
          onImport={handleImport}
          onImportFlat={handleImportFlat}
          onPreview={() => setPreviewOpen(true)}
          onClearAll={handleClearAll}
          onRemoveSelected={handleRemoveSelected}
          onSettings={() => setSettingsOpen(true)}
          onSetImportDirectory={handleSetImportDirectory}
          allowedFileTypes={settings.allowedFileTypes}
          onCompress={handleCompress}
          onConvertHEIC={handleConvertHEIC}
          onUndo={handleUndo}
          onClearSuffix={handleClearSuffix}
          onRestoreSession={handleRestoreSession}
        />
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" ref={tableContainerRef}>
            <ResizablePanel>
              <FilesTable
                files={files}
                setSelected={setSelected}
                getPreviewNames={getPreviewNames}
                onDateChange={handleDateChange}
                onSuffixChange={handleSuffixChange}
                onTagsChange={handleTagsCellChange}
                selectedRows={selected}
                columnSizes={settings.columnSizes}
                onColumnResize={handleColumnResize}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={50}>
                  <PreviewPanel
                    selected={selected.length === 1 ? selected[0] : null}
                    onNext={selectNext ?? (() => {})}
                    onPrev={selectPrev ?? (() => {})}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>
                  <TagsPanel
                    selected={selected}
                    onToggleTag={toggleTag}
                    tagOptions={tagOptions}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <RenamePreviewSheet
          isOpen={previewOpen}
          onOpenChange={setPreviewOpen}
          files={files}
          getPreviewNames={getPreviewNames}
        />
      </div>
    </TooltipProvider>
  )
}