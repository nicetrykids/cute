"use client"

import * as React from "react"
import {
    Command,
    CommandDialog,
    CommandGroup,
    CommandInput,
    CommandList,
} from "@/components/ui/command"
import { useNavigate } from "react-router"
import { useComicsQuery } from "@/api/services-hooks/useComicsQuery"
import { useDebounce } from "@/hooks/useDebounce"
import type { Comic } from "@/models/Comic"
import { SearchResultList } from "./SearchResultList"

interface SearchCommandDesktopProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SearchCommandDesktop({ open, setOpen }: SearchCommandDesktopProps) {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = React.useState("")
    const debouncedSearchQuery = useDebounce(searchQuery, 400)
    const [searchResults, setSearchResults] = React.useState<Comic[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const { data, isLoading: isLoadingComics } = useComicsQuery()

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault()
                setOpen((prevOpen) => !prevOpen)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

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
        setOpen(false)
    }

    return (
        <>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command className="rounded-lg border shadow-md"
                    shouldFilter={false}
                >
                    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                        <CommandInput
                            placeholder="Search comics..."
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            value={searchQuery}
                            onValueChange={(value) => {
                                setSearchQuery(value)
                                setIsLoading(!!value.trim())
                            }}
                        />
                    </div>
                    <CommandList className="max-h-[300px] overflow-y-auto py-2">
                        <CommandGroup>
                            <SearchResultList
                                results={searchResults}
                                isLoading={isLoading || isLoadingComics}
                                searchQuery={searchQuery}
                                onItemClick={handleItemClick}
                                variant="desktop"
                            />
                        </CommandGroup>
                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    )
}
