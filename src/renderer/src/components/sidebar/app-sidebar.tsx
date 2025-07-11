import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Compass,
} from "lucide-react"

import { NavMain } from "@renderer/components/sidebar/nav-main"
import { NavProjects } from "@renderer/components/sidebar/nav-projects"
import { NavSecondary } from "@renderer/components/sidebar/nav-secondary"
import { NavUser } from "@renderer/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@renderer/components/sidebar/mode-toggle"
import { is } from "date-fns/locale"

const data = {
  user: {
    name: "Jürgen",
    email: "ja@micavac.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Test1",
          url: "#",
        }
      ],
    },
    {
      title: "Programs",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "Renamer",
          url: "/programs/renamer",
        },
        {
          title: "Warehouse",
          url: "#",
        },
        {
          title: "Test",
          url: "#",
        },
      ],
    },
    {
      title: "MIC Knowledgebase",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>): React.ReactElement {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle/>
      </SidebarFooter>
    </Sidebar>
  )
}
