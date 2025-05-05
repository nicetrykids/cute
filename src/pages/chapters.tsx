import { Helmet } from "react-helmet-async"
import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { getComic, toggleFavorite, toggleFollowing, setReadingStatus } from "@/lib/db/indexedDb"
import { path } from "@/routers/path"
import type { ReadingStatus } from "@/lib/db/type"
import type { Comic } from "@/models/Comic"
import { ComicHeader } from "@/components/common/comic/ComicHeader"
import { ComicChapters } from "@/components/common/comic/ComicChapters"
import { ComicDetails } from "@/components/common/comic/ComicDetails"

export default function ChaptersPage() {
  const { id } = useParams()
  const [comic, setComic] = useState<Comic | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("tags")
  const [chapterOrder, setChapterOrder] = useState<"asc" | "desc">("desc")
  const [languageFilter, setLanguageFilter] = useState<string | null>(null)
  const [readingStatus, setStatus] = useState<ReadingStatus | null>(null)
  const [lastReadChapter, setLastReadChapter] = useState<number | null>(null)

  useEffect(() => {
    const fetchComic = async () => {
      try {
        if (!id) {
          throw new Error("Comic ID is missing")
        }

        const comicData = await getComic(parseInt(id))
        if (comicData) {
          setComic(comicData)

          if (comicData.chapters && comicData.chapters.length > 0) {
            let lastIndex = -1;
            let maxProgress = -1;

            comicData.chapters.forEach((chapter, index) => {
              if (chapter.reading_progress > maxProgress) {
                maxProgress = chapter.reading_progress;
                lastIndex = index;
              }
            });

            if (lastIndex >= 0) {
              setLastReadChapter(lastIndex);
            }
          }
        }

        setLoading(false)
      } catch (err) {
        setError("Failed to load comic data")
        setLoading(false)
        console.error(err)
      }
    }

    fetchComic()
  }, [id])

  const getChapterLink = (chapterId: string) => {
    if (!id) return '#';

    return path.chapter.replace(':id', id).replace(':chapterId', chapterId);
  }

  const handleToggleFavorite = async () => {
    if (!comic || !id) return;
    await toggleFavorite(parseInt(id), !comic.favorites);
    setComic({ ...comic, favorites: !comic.favorites });
  }

  const handleToggleFollowing = async () => {
    if (!comic || !id) return;
    await toggleFollowing(parseInt(id), !comic.following);
    setComic({ ...comic, following: !comic.following });
  }

  const handleSetReadingStatus = async (status: ReadingStatus) => {
    if (!comic || !id) return;
    await setReadingStatus(parseInt(id), status);
    setStatus(status);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading comic data...</p>
      </div>
    );
  }

  if (error || !comic) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-destructive">{error || "Comic not found"}</p>
      </div>
    );
  }

  // Get cover image - use last art if available
  const coverImage = comic.arts && comic.arts.length > 0 ? comic.arts[comic.arts.length - 1] : "";

  return (
    <div className="relative min-h-screen flex flex-col">
      <Helmet>
        <title>{comic.title ? `${comic.title} - Chapters` : "Chapters"} - ImKhok</title>
      </Helmet>

      {/* Background image with blur effect */}
      {coverImage && (
        <div
          className="absolute top-0 left-0 w-full h-[25vh] bg-cover bg-center"
          style={{
            backgroundImage: `url(${coverImage})`,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0))',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0))'
          }}
        />
      )}

      <div className="mx-2 relative z-10 flex-1 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 flex-shrink-0">
          {/* Main content area - Header */}
          <div className="md:col-span-12">
            <ComicHeader
              comic={comic}
              readingStatus={readingStatus}
              lastReadChapter={lastReadChapter}
              getChapterLink={getChapterLink}
              onToggleFavorite={handleToggleFavorite}
              onToggleFollowing={handleToggleFollowing}
              onSetReadingStatus={handleSetReadingStatus}
            />
          </div>
        </div>

        {/* Left and Right columns in a container with controlled height */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0 pb-6">
          {/* Left sidebar */}
          <div className="md:col-span-3 h-full">
            <ComicDetails
              comic={comic}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Right sidebar - Chapters */}
          <div className="md:col-span-9 h-full">
            <ComicChapters
              comic={comic}
              chapterOrder={chapterOrder}
              languageFilter={languageFilter}
              getChapterLink={getChapterLink}
              onOrderChange={setChapterOrder}
              onLanguageFilterChange={setLanguageFilter}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 