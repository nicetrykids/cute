import * as React from "react"
import { Check, ChevronsUpDown, Moon, Palette, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const colorVariants = [
  "default",
  "red",
  "rose",
  "orange",
  "green",
  "blue",
  "yellow",
  "violet"
]

const colorNames: Record<string, string> = {
  "default": "Default",
  "red": "Red",
  "rose": "Rose",
  "orange": "Orange",
  "green": "Green",
  "blue": "Blue",
  "yellow": "Yellow",
  "violet": "Violet",
}

const lightColors: Record<string, string> = {
  "default": "#f9fafb",
  "red": "#fef2f2",
  "rose": "#fff1f2",
  "orange": "#fff7ed",
  "green": "#f0fdf4",
  "blue": "#eff6ff",
  "yellow": "#fefce8",
  "violet": "#f5f3ff",
}

const darkColors: Record<string, string> = {
  "default": "#1f2937",
  "red": "#ef4444",
  "rose": "#f43f5e",
  "orange": "#f97316",
  "green": "#22c55e",
  "blue": "#3b82f6",
  "yellow": "#eab308",
  "violet": "#8b5cf6",
}

export function ThemeSwitcher() {
  const { isMobile } = useSidebar()
  const { theme, setTheme } = useTheme()

  const parseTheme = React.useCallback((themeString: string | undefined) => {
    const defaultTheme = { mode: "system", variant: "default" };
    if (!themeString) return defaultTheme;

    if (themeString === "light" || themeString === "dark" || themeString === "system") {
      return { mode: themeString, variant: "default" };
    }

    const parts = themeString.split("-");
    if (parts.length !== 2) return defaultTheme;

    return { mode: parts[0] as "light" | "dark", variant: parts[1] };
  }, []);

  const currentTheme = parseTheme(theme);

  const createThemeString = React.useCallback((mode: string, variant: string) => {
    if (mode === "system") return "system";
    if (variant === "default") return mode;
    return `${mode}-${variant}`;
  }, []);

  const changeTheme = React.useCallback((modeOrVariant: string, isMode: boolean) => {
    if (isMode) {
      const newMode = modeOrVariant;
      const currentVariant = currentTheme.variant;
      setTheme(createThemeString(newMode, currentVariant));
    } else {
      const currentMode = currentTheme.mode;
      if (currentMode === "system") {
        setTheme(createThemeString("light", modeOrVariant));
      } else {
        const newVariant = modeOrVariant;
        setTheme(createThemeString(currentMode, newVariant));
      }
    }
  }, [currentTheme, createThemeString, setTheme]);

  const getThemeIcon = () => {
    if (currentTheme.mode === "light") return Sun;
    if (currentTheme.mode === "dark") return Moon;
    return Palette;
  };

  const ThemeIcon = getThemeIcon();

  const getThemeName = () => {
    if (currentTheme.mode === "system") return "System";

    const modeName = currentTheme.mode === "light" ? "Light" : "Dark";
    if (currentTheme.variant === "default") return modeName;

    return `${modeName} - ${colorNames[currentTheme.variant]}`;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <ThemeIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {getThemeName()}
                </span>
                <span className="truncate text-xs">Appearance</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Theme Mode
            </DropdownMenuLabel>

            {/* Light theme option */}
            <DropdownMenuItem
              onClick={() => changeTheme("light", true)}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <Sun className="size-4 shrink-0" />
              </div>
              Light
              {currentTheme.mode === "light" && (
                <Check className="ml-auto size-4" />
              )}
            </DropdownMenuItem>

            {/* Dark theme option */}
            <DropdownMenuItem
              onClick={() => changeTheme("dark", true)}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <Moon className="size-4 shrink-0" />
              </div>
              Dark
              {currentTheme.mode === "dark" && (
                <Check className="ml-auto size-4" />
              )}
            </DropdownMenuItem>

            {/* System theme option */}
            <DropdownMenuItem
              onClick={() => changeTheme("system", true)}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <Palette className="size-4 shrink-0" />
              </div>
              System
              {currentTheme.mode === "system" && (
                <Check className="ml-auto size-4" />
              )}
            </DropdownMenuItem>

            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Color Variants
              </DropdownMenuLabel>

              {/* Color variant selector */}
              <div className="grid grid-cols-4 gap-1 p-2">
                {colorVariants.map((variant) => {
                  const isSelected = currentTheme.variant === variant;
                  // Show light or dark color based on current mode
                  const colorValue = currentTheme.mode === "light"
                    ? lightColors[variant]
                    : darkColors[variant];

                  return (
                    <div
                      key={variant}
                      onClick={() => changeTheme(variant, false)}
                      className={`flex size-6 cursor-pointer items-center justify-center rounded-full hover:ring-1 ${isSelected ? 'ring-1 ring-primary' : ''}`}
                      style={{
                        backgroundColor: colorValue,
                        border: "1px solid currentColor"
                      }}
                      title={colorNames[variant]}
                    />
                  );
                })}
              </div>
            </>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
} 