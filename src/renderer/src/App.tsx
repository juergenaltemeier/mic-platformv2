import { AppSidebar } from "@renderer/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"

export function App(): React.ReactElement {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-0.25" />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ThemeProvider>
  )
}
