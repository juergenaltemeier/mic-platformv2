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

import { TooltipProvider } from "@/components/ui/tooltip"

export const Renamer = () => {
  const {
    files,
    selected,
    setSelected,
    prefixNumber,
    setPrefixNumber,
    handleImport,
    handleImportFlat,
    tagOptions,
    toggleTag,
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
  } = useRenamer()

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
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
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <FilesTable
                files={files}
                setSelected={setSelected}
                getPreviewNames={getPreviewNames}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={50}>
                  <PreviewPanel
                    selected={selected}
                    onNext={selectNext ?? (() => {})}
                    onPrev={selectPrev ?? (() => {})}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>
                  <TagsPanel
                    selected={selected}
                    tagOptions={tagOptions}
                    onToggleTag={toggleTag}
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