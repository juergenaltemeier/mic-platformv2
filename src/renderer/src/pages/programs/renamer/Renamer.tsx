import { Toolbar } from "./components/Toolbar"
import { useRenamer } from "./hooks/useRenamer"
import { RenamePreviewSheet } from "./components/RenamePreviewSheet"

import { TooltipProvider } from "@/components/ui/tooltip"
import FileGrid from "./components/FileGrid"

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
    toggleTag,
    tagOptions,
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
          <FileGrid files={files} selected={selected} setSelected={setSelected} />
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