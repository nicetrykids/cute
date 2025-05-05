"use client"

import * as React from "react"
import { X } from "lucide-react"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useComicsQuery } from "@/api/services-hooks/useComicsQuery"
import { useDebounce } from "@/hooks/useDebounce"
import type { Comic } from "@/models/Comic"
import { SearchResultList } from "./SearchResultList"

interface SearchDrawerMobileProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SearchDrawerMobile({ open, setOpen }: SearchDrawerMobileProps) {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = React.useState("")
    const debouncedSearchQuery = useDebounce(searchQuery, 400)
    const [searchResults, setSearchResults] = React.useState<Comic[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const { data, isLoading: isLoadingComics } = useComicsQuery()

    React.useEffect(() => {
        if (data?.comics && !debouncedSearchQuery) {
            setSearchResults(data.comics.slice(0, 5))
            return
        }

        if (!data?.comics || !debouncedSearchQuery.trim()) {
            setSearchResults([])
            return
        }

        setIsLoading(true)

        const query_lower = debouncedSearchQuery.toLowerCase();
        const filteredResults = data.comics.filter(comic =>
            comic.title.toLowerCase().includes(query_lower) ||
            (comic.author && comic.author.toLowerCase().includes(query_lower)) ||
            (comic.artists && comic.artists.some(a => a.toLowerCase().includes(query_lower))) ||
            (comic.genres && comic.genres.some(g => g.toLowerCase().includes(query_lower))) ||
            (comic.alt_names && comic.alt_names.some(alt => alt.name.toLowerCase().includes(query_lower)))
        );

        setSearchResults(filteredResults)
        setIsLoading(false)
    }, [data?.comics, debouncedSearchQuery])

    const handleItemClick = (result: Comic) => {
        navigate(`/comics/${result.id}`)
    }

    const renderSearchItem = (result: Comic, onClick: () => void) => {
        return (
            <DrawerClose asChild>
                <Card className="overflow-hidden p-0">
                    <Button
                        variant="ghost"
                        className="h-auto w-full justify-start p-0 overflow-hidden"
                        onClick={() => onClick()}
                    >
                        <div className="flex w-full items-center">
                            <div className="h-20 w-16 shrink-0">
                                {result.arts && result.arts.length > 0 ? (
                                    <img
                                        src={result.arts[result.arts.length - 1]}
                                        alt={result.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
                                        No image
                                    </div>
                                )}
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
            </DrawerClose>
        )
    }

    return (
        <Drawer direction="bottom" open={open} onOpenChange={setOpen}>
            <DrawerContent className="h-[90vh] max-h-[90vh] pb-8">
                <DrawerHeader className="border-b pb-3">
                    <DrawerTitle className="text-center">Search</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 py-3 border-b">
                    <div className="relative">
                        <Input
                            placeholder="Search comics..."
                            className="pr-10"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setIsLoading(!!e.target.value.trim())
                            }}
                            autoFocus
                            disabled={isLoadingComics}
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                                onClick={() => {
                                    setSearchQuery("")
                                    setSearchResults([])
                                }}
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Clear search</span>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="px-4 py-2 flex-1 overflow-y-auto">
                    {isLoadingComics ? (
                        <div className="py-8 flex justify-center items-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent text-primary" />
                        </div>
                    ) : (
                        <SearchResultList
                            results={searchResults}
                            isLoading={isLoading}
                            searchQuery={searchQuery}
                            onItemClick={handleItemClick}
                            variant="mobile"
                            renderItem={renderSearchItem}
                        />
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    )
} 