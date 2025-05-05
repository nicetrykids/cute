import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ThemeSwitcher } from "./theme-switcher"
import { Button } from "@/components/ui/button"

interface SettingsSidebarProps {
  onClose: () => void
}

export function SettingsSidebar({ onClose }: SettingsSidebarProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[900px] flex p-0 overflow-hidden">
        {/* Sidebar navigation */}
        <div className="w-[200px] border-r bg-muted/40 px-2 py-6 flex flex-col">
          <nav className="space-y-1 flex-1">
            <Button variant="ghost" className="w-full justify-start">
              <span>Appearance</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <span>User Preferences</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <span>About</span>
            </Button>
          </nav>
        </div>

        {/* Content area */}
        <div className="flex-1 p-6 overflow-auto">
          <DialogHeader className="mb-4 flex flex-row items-center justify-between">
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Appearance</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm">Theme:</span>
                <ThemeSwitcher />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">User Preferences</h3>
              <div className="text-sm">
                <p>More settings will be added here</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">About</h3>
              <div className="text-sm">
                <p>ImKhok comics reader</p>
                <p>Version 1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 