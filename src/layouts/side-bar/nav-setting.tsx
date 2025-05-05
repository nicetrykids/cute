import { Settings } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import { SettingsSidebar } from "./settings-sidebar"

export function NavSetting() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="w-full flex items-center gap-2"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">
                <Settings className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Settings</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      {isSettingsOpen && (
        <SettingsSidebar onClose={() => setIsSettingsOpen(false)} />
      )}
    </>
  )
} 