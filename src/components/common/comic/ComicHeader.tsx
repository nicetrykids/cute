import { Link } from "react-router"
import { FiHeart, FiBell, FiBookmark, FiClock, FiCheckCircle, FiPlay, FiPlayCircle, FiChevronDown, FiExternalLink } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ReadingStatus } from "@/lib/db/type"
import type { Comic } from "@/models/Comic"

const ReadingStatusOptions = [
  { value: "reading" as ReadingStatus, label: "Reading", icon: <FiBookmark className="text-primary" /> },
  { value: "planning" as ReadingStatus, label: "Planning", icon: <FiClock className="text-primary" /> },
  { value: "completed" as ReadingStatus, label: "Completed", icon: <FiCheckCircle className="text-primary" /> }
]

interface ComicHeaderProps {
  comic: Comic;
  readingStatus: ReadingStatus | null;
  lastReadChapter: number | null;
  getChapterLink: (chapterId: string) => string;
  onToggleFavorite: () => void;
  onToggleFollowing: () => void;
  onSetReadingStatus: (status: ReadingStatus) => void;
}

export function ComicHeader({
  comic,
  readingStatus,
  lastReadChapter,
  getChapterLink,
  onToggleFavorite,
  onToggleFollowing,
  onSetReadingStatus
}: ComicHeaderProps) {
  const coverImage = comic.arts && comic.arts.length > 0 ? comic.arts[comic.arts.length - 1] : "";

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cover image */}
          <div className="w-full md:w-48 flex-shrink-0">
            <AspectRatio ratio={2 / 3} className="overflow-hidden rounded-md">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={comic.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No Image</span>
                </div>
              )}
            </AspectRatio>
          </div>

          {/* Comic details */}
          <div className="flex flex-col flex-grow gap-4">
            <div>
              <h1 className="text-5xl font-bold">{comic.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-muted-foreground">{comic.author}</span>
                {comic.publication_year && (
                  <span className="text-muted-foreground">• {comic.publication_year}</span>
                )}
                {comic.status && (
                  <Badge variant="secondary">
                    {comic.status}
                  </Badge>
                )}
                {comic.mangadex_url && (
                  <a href={comic.mangadex_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="ml-2">
                      <FiExternalLink className="mr-2 h-4 w-4" />
                      MangaDex
                    </Button>
                  </a>
                )}
              </div>
            </div>

            <p className="text-muted-foreground">
              {comic.description || "No description available."}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                variant={comic.favorites ? "default" : "ghost"}
                size="sm"
                onClick={onToggleFavorite}
              >
                <FiHeart className={`mr-2 h-4 w-4`} />
                Favorite
              </Button>

              <Button
                variant={comic.following ? "default" : "ghost"}
                size="sm"
                onClick={onToggleFollowing}
              >
                <FiBell className={`mr-2 h-4 w-4`} />
                Following
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {readingStatus ? ReadingStatusOptions.find(opt => opt.value === readingStatus)?.icon : <FiBookmark className="mr-2 h-4 w-4" />}
                    <span className="mr-1">{readingStatus ? ReadingStatusOptions.find(opt => opt.value === readingStatus)?.label : "Add to List"}</span>
                    <FiChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {ReadingStatusOptions.map(option => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onSetReadingStatus(option.value)}
                      className="flex items-center"
                    >
                      <span className="mr-2">{option.icon}</span>
                      <span>{option.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Reading buttons */}
            <div className="flex flex-wrap gap-2 mt-2">
              <Button asChild>
                <Link to={getChapterLink(comic.chapters[0].chap.toString() || "1")}>
                  <FiPlay className="mr-2 h-4 w-4" />
                  Start Reading
                </Link>
              </Button>

              {lastReadChapter !== null && (
                <Button variant="secondary" asChild>
                  <Link to={getChapterLink(lastReadChapter.toString())}>
                    <FiPlayCircle className="mr-2 h-4 w-4" />
                    Continue Reading
                  </Link>
                </Button>
              )}
            </div>

            {/* Genres badges */}
            {comic.genres && comic.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {comic.genres.map((genre, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 