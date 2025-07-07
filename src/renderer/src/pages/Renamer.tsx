import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export function RenamerPage(): React.ReactElement {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={50}>
        <div className="p-4">
          <h2 className="text-xl font-bold">Files</h2>
          {/* File Table will go here */}
          <p className="mt-2">File table placeholder</p>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="p-4">
          <h2 className="text-xl font-bold">Edit</h2>
          {/* Edit panel will go here */}
          <p className="mt-2">Edit panel placeholder</p>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
