import * as React from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { Comic } from "@/models/Comic"

interface SearchResultListProps {
  results: Comic[]
  isLoading?: boolean
  searchQuery?: string
  onItemClick: (result: Comic) => void
  variant: "mobile" | "desktop"
  renderItem?: (result: Comic, onClick: () => void) => React.ReactNode
}

export function SearchResultList({
  results,
  isLoading = false,
  searchQuery = "",
  onItemClick,
  variant,
  renderItem
}: SearchResultListProps) {
  const itemsToShow = 5;

  if (results.length === 0 && searchQuery && !isLoading) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        No results found
      </div>
    )
  }

  if (results.length === 0 && !searchQuery && !isLoading) {
    return null
  }

  const getThumbnail = (comic: Comic) => {
    return comic.arts && comic.arts.length > 0
      ? comic.arts[comic.arts.length - 1]
      : '/sangtraan.png'
  }

  // Calculate how many skeleton items to show
  const displayResults = isLoading ? [] : results;
  const skeletonsToAdd = Math.max(0, itemsToShow - displayResults.length);

  if (variant === "mobile") {
    return (
      <div className="space-y-3">
        {/* Actual results */}
        {displayResults.map((result) => {
          const handleClick = () => onItemClick(result)

          if (renderItem) {
            return <div key={result.id}>{renderItem(result, handleClick)}</div>
          }

          return (
            <Card key={result.id} className="overflow-hidden p-0">
              <Button
                variant="ghost"
                className="h-auto w-full justify-start p-0 overflow-hidden"
                onClick={handleClick}
              >
                <div className="flex w-full items-start">
                  <div className="h-20 w-16 shrink-0">
                    <img
                      src={getThumbnail(result)}
                      alt={result.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col items-start text-left p-3">
                    <span className="font-medium line-clamp-1">{result.title}</span>
                    <span className="text-xs text-muted-foreground">{result.author || (result.artists && result.artists[0])}</span>
                    {result.status && (
                      <span className="text-xs mt-1">
                        <Badge variant="outline" className="px-1 py-0 text-[10px]">
                          {result.status}
                        </Badge>
                        {result.star && (
                          <Badge variant="secondary" className="ml-1 px-1 py-0 text-[10px]">
                            ★ {result.star}
                          </Badge>
                        )}
                      </span>
                    )}
                    {result.genres && result.genres.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {result.genres.slice(0, 2).map(genre => (
                          <Badge key={genre} variant="secondary" className="px-1 py-0 text-[10px]">
                            {genre}
                          </Badge>
                        ))}
                        {result.genres.length > 2 && (
                          <span className="text-[10px] text-muted-foreground">+{result.genres.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            </Card>
          )
        })}

        {/* Skeleton items */}
        {(isLoading || skeletonsToAdd > 0) &&
          Array.from({ length: isLoading ? itemsToShow : skeletonsToAdd }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="overflow-hidden p-0">
              <div className="flex w-full items-start">
                <div className="h-20 w-16 shrink-0">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="flex flex-1 flex-col items-start text-left p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex gap-1">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>
              </div>
            </Card>
          ))
        }
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {/* Actual results */}
      {displayResults.map((result) => {
        const handleClick = () => onItemClick(result)

        if (renderItem) {
          return <div key={result.id}>{renderItem(result, handleClick)}</div>
        }

        return (
          <div
            key={result.id}
            className={cn(
              "flex cursor-pointer items-start gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              "hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={handleClick}
            role="option"
            aria-selected="false"
          >
            <div className="h-12 w-10 shrink-0 rounded overflow-hidden">
              <img
                src={getThumbnail(result)}
                alt={result.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="font-medium line-clamp-1">{result.title}</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">{result.author || (result.artists && result.artists[0])}</span>
                {result.status && (
                  <Badge variant="outline" className="px-1 py-0 text-[10px]">
                    {result.status}
                  </Badge>
                )}
                {result.star && (
                  <span className="text-xs text-muted-foreground">★ {result.star}</span>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* Skeleton items */}
      {(isLoading || skeletonsToAdd > 0) &&
        Array.from({ length: isLoading ? itemsToShow : skeletonsToAdd }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className={cn(
              "flex items-start gap-2 rounded-sm px-2 py-1.5 text-sm outline-none"
            )}
          >
            <div className="h-12 w-10 shrink-0 rounded overflow-hidden">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))
      }
    </div>
  )
} 