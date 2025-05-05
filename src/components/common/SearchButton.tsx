"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { SearchDrawerMobile } from "./SearchDrawerMobile"
import { SearchCommandDesktop } from "./SearchCommandDesktop"

export function SearchButton() {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()

  return (
    <>
      {!isMobile ? (
        /* Search Button - Desktop */
        <>
          <Button
            variant="outline"
            size="sm"
            className="group gap-2 text-sm mr-4 w-64 flex justify-between items-center"
            onClick={() => setOpen(true)}
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search...</span>
            </span>
            <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <SearchCommandDesktop open={open} setOpen={setOpen} />
        </>
      ) : (
        /* Search Button - Mobile */
        <>
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => setOpen(true)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
          <SearchDrawerMobile open={open} setOpen={setOpen} />
        </>
      )}
    </>
  )
} 