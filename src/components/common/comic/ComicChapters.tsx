import { Link } from "react-router"
import { FiList, FiFilter, FiChevronDown, FiArrowUp, FiArrowDown } from "react-icons/fi"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Comic } from "@/models/Comic"

// Language flag mapping
const LanguageFlags = {
  vi: "🇻🇳",
  jp: "🇯🇵",
  ch: "🇨🇳",
  en: "🇺🇸",
  default: "🌐"
}

interface ComicChaptersProps {
  comic: Comic;
  chapterOrder: "asc" | "desc";
  languageFilter: string | null;
  getChapterLink: (chapterId: string) => string;
  onOrderChange: (order: "asc" | "desc") => void;
  onLanguageFilterChange: (language: string | null) => void;
}

export function ComicChapters({
  comic,
  chapterOrder,
  languageFilter,
  getChapterLink,
  onOrderChange,
  onLanguageFilterChange
}: ComicChaptersProps) {

  const getChaptersByVolume = () => {
    if (!comic?.chapters) return {};

    let filtered = [...comic.chapters];

    if (languageFilter) {
      filtered = filtered.filter(chapter => chapter.language === languageFilter);
    }

    filtered.sort((a, b) => {
      if (chapterOrder === "asc") {
        return a.chap - b.chap;
      } else {
        return b.chap - a.chap;
      }
    });

    return filtered.reduce((acc, chapter, index) => {
      const vol = chapter.vol || 0;
      if (!acc[vol]) {
        acc[vol] = [];
      }
      acc[vol].push({ ...chapter, index });
      return acc;
    }, {} as Record<number, Array<any>>);
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 shrink-0">
        <CardTitle className="text-xl font-semibold flex items-center">
          <FiList className="mr-2 h-5 w-5" />
          Chapters
        </CardTitle>

        <div className="flex items-center gap-2">
          {/* Language filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FiFilter className="mr-2 h-4 w-4" />
                <span className="mr-1">{languageFilter ? (LanguageFlags[languageFilter as keyof typeof LanguageFlags] || LanguageFlags.default) : "All Languages"}</span>
                <FiChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onLanguageFilterChange(null)}>
                All Languages
              </DropdownMenuItem>
              <Separator />
              {Object.entries(LanguageFlags).filter(([key]) => key !== 'default').map(([lang, flag]) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => onLanguageFilterChange(lang)}
                >
                  <span className="mr-2">{flag}</span>
                  <span>{lang.toUpperCase()}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Order toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onOrderChange(chapterOrder === "asc" ? "desc" : "asc")}
          >
            {chapterOrder === "asc" ? <FiArrowUp className="h-4 w-4" /> : <FiArrowDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2 pb-2 flex-1">
        <ScrollArea className="h-[calc(100%-8px)] rounded-md border">
          <div className="space-y-4 p-4">
            {Object.entries(getChaptersByVolume()).length > 0 ? (
              Object.entries(getChaptersByVolume()).map(([vol, chapters]) => {
                const volNumber = parseInt(vol);

                return (
                  <Collapsible key={vol} defaultOpen>
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted p-3 font-medium">
                      <span>
                        {volNumber > 0 ? `Volume ${volNumber}` : "Chapters"}
                        <span className="ml-2 text-muted-foreground">({chapters.length})</span>
                      </span>
                      <FiChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-1">
                      <div className="divide-y rounded-md border">
                        {chapters.map((chapter) => (
                          <Link
                            key={chapter.chap}
                            to={getChapterLink(chapter.chap.toString())}
                            className="flex items-center justify-between p-3 hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {chapter.vol > 0 ? `Vol. ${chapter.vol} ` : ''}
                                Chapter {chapter.chap}
                              </span>
                              <Badge variant="outline">
                                {LanguageFlags[chapter.language as keyof typeof LanguageFlags] || LanguageFlags.default}
                              </Badge>
                            </div>

                            {chapter.reading_progress > 0 && (
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={Math.round(chapter.reading_progress * 100)}
                                  className="w-24 h-2"
                                />
                                <span className="text-sm text-muted-foreground">
                                  {Math.round(chapter.reading_progress * 100)}%
                                </span>
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })
            ) : (
              <p className="text-center py-8 text-muted-foreground">No chapters available</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 