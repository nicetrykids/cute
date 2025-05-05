import { Helmet } from "react-helmet-async"
import { useState, useRef, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useParams } from "react-router";
import { getComic, getChapterProgress, addToHistory } from "@/lib/db/indexedDb";
import type { Comic } from "@/models/Comic";

export interface Page {
  id: string;
  url: string;
}

export interface ChapterView {
  id: string;
  order: number;
  name: string;
  pages: Page[];
}

export default function ChapterPage() {
  const { id, chapterId } = useParams()
  const [zoomLevel, setZoomLevel] = useState(1)
  const viewerContentRef = useRef<HTMLDivElement>(null)

  const [comic, setComic] = useState<Comic | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedChapter, setSelectedChapter] = useState<ChapterView | null>(null)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Fetch comic and chapter data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Comic ID is required")
        setLoading(false)
        return
      }

      try {
        // Parse the comic ID to number
        const comicId = parseInt(id)
        if (isNaN(comicId)) {
          setError("Invalid comic ID")
          setLoading(false)
          return
        }

        // Fetch comic data
        const comicData = await getComic(comicId)
        if (!comicData) {
          setError("Comic not found")
          setLoading(false)
          return
        }

        setComic(comicData)
        console.log("chapterId ", chapterId);
        // Find the requested chapter
        if (chapterId) {
          const chapterNumber = parseFloat(chapterId)
          const chapter = comicData.chapters.find(ch => ch.chap === chapterNumber)

          if (chapter) {
            // Get reading progress
            const progress = await getChapterProgress(comicId, chapterId)
            setCurrentImageIndex(progress)

            // Create pages array from images
            const pages: Page[] = chapter.images.map((url, index) => ({
              id: `${index + 1}`,
              url
            }))

            setSelectedChapter({
              id: chapterId,
              order: chapter.chap,
              name: `Chapter ${chapter.chap}${chapter.vol ? ` (Vol ${chapter.vol})` : ''}`,
              pages
            })
          } else {
            setError("Chapter not found")
          }
        } else if (comicData.chapters && comicData.chapters.length > 0) {
          // If no chapter specified, use the first one
          const firstChapter = comicData.chapters[0]
          const pages: Page[] = firstChapter.images.map((url, index) => ({
            id: `${index + 1}`,
            url
          }))

          setSelectedChapter({
            id: firstChapter.chap.toString(),
            order: firstChapter.chap,
            name: `Chapter ${firstChapter.chap}${firstChapter.vol ? ` (Vol ${firstChapter.vol})` : ''}`,
            pages
          })
        } else {
          setError("No chapters available")
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load comic data")
        setLoading(false)
      }
    }

    fetchData()
  }, [id, chapterId])

  // Save reading progress
  useEffect(() => {
    const saveProgress = async () => {
      if (comic && selectedChapter && id) {
        const comicId = parseInt(id)
        if (!isNaN(comicId)) {
          await addToHistory(comicId, selectedChapter.id, currentImageIndex)
        }
      }
    }

    // Observer to track current image
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setCurrentImageIndex(index)
          }
        })
      },
      { threshold: 0.5 }
    )

    // Add observer to all images
    const container = viewerContentRef.current
    if (container && selectedChapter) {
      const images = container.querySelectorAll('img')
      images.forEach((img, index) => {
        img.setAttribute('data-index', index.toString())
        observer.observe(img)
      })
    }

    // Save progress when unmounting
    return () => {
      observer.disconnect()
      saveProgress()
    }
  }, [comic, selectedChapter, id, currentImageIndex])

  // All available chapters for navigation
  const sortedChaptersForNav = comic?.chapters
    ? comic.chapters
      .map(ch => ({
        id: ch.chap.toString(),
        order: ch.chap,
        name: `Chapter ${ch.chap}${ch.vol ? ` (Vol ${ch.vol})` : ''}`
      }))
      .sort((a, b) => a.order - b.order)
    : []

  const currentChapterIndex = selectedChapter
    ? sortedChaptersForNav.findIndex(ch => ch.id === selectedChapter.id)
    : -1

  const hasPrevChapter = currentChapterIndex > 0
  const hasNextChapter = currentChapterIndex < sortedChaptersForNav.length - 1 && currentChapterIndex !== -1

  // Handle chapter navigation
  const handlePrevChapter = async () => {
    if (hasPrevChapter && comic && id) {
      const prevChapter = sortedChaptersForNav[currentChapterIndex - 1]
      const chapterNumber = parseFloat(prevChapter.id)
      const chapter = comic.chapters.find(ch => ch.chap === chapterNumber)

      if (chapter) {
        // Save current progress before navigating
        const comicId = parseInt(id)
        if (!isNaN(comicId) && selectedChapter) {
          await addToHistory(comicId, selectedChapter.id, currentImageIndex)
        }

        // Create pages array from images
        const pages: Page[] = chapter.images.map((url, index) => ({
          id: `${index + 1}`,
          url
        }))

        // Get progress for the new chapter
        const progress = await getChapterProgress(comicId, prevChapter.id)
        setCurrentImageIndex(progress)

        setSelectedChapter({
          id: prevChapter.id,
          order: prevChapter.order,
          name: prevChapter.name,
          pages
        })

        // Scroll to top
        if (viewerContentRef.current) {
          viewerContentRef.current.scrollTop = 0
        }
      }
    }
  }

  const handleNextChapter = async () => {
    if (hasNextChapter && comic && id) {
      const nextChapter = sortedChaptersForNav[currentChapterIndex + 1]
      const chapterNumber = parseFloat(nextChapter.id)
      const chapter = comic.chapters.find(ch => ch.chap === chapterNumber)

      if (chapter) {
        // Save current progress before navigating
        const comicId = parseInt(id)
        if (!isNaN(comicId) && selectedChapter) {
          await addToHistory(comicId, selectedChapter.id, currentImageIndex)
        }

        // Create pages array from images
        const pages: Page[] = chapter.images.map((url, index) => ({
          id: `${index + 1}`,
          url
        }))

        // Get progress for the new chapter
        const progress = await getChapterProgress(comicId, nextChapter.id)
        setCurrentImageIndex(progress)

        setSelectedChapter({
          id: nextChapter.id,
          order: nextChapter.order,
          name: nextChapter.name,
          pages
        })

        // Scroll to top
        if (viewerContentRef.current) {
          viewerContentRef.current.scrollTop = 0
        }
      }
    }
  }

  // Zoom controls
  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 5))
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.1))
  const resetZoom = () => setZoomLevel(1)

  // Handle close - save progress before exiting
  const handleClose = async () => {
    if (comic && selectedChapter && id) {
      const comicId = parseInt(id)
      if (!isNaN(comicId)) {
        await addToHistory(comicId, selectedChapter.id, currentImageIndex)
        window.history.back()
      }
    } else {
      window.history.back()
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading chapter...</p>
        </div>
      </div>
    )
  }

  if (error || !comic || !selectedChapter) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p className="mb-6">{error || "Failed to load chapter"}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <Helmet>
        <title>{`${selectedChapter.name} - ${comic.title} - ImKhok`}</title>
      </Helmet>

      {/* Header with Navigation */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm p-1 flex justify-between items-center border-b z-10 flex-shrink-0 gap-2">
        {/* Previous Chapter Button */}
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 flex-shrink-0"
          onClick={handlePrevChapter}
          disabled={!hasPrevChapter}
          aria-label="Previous Chapter"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Chapter Title */}
        <h3 className="text-lg font-semibold text-center truncate px-2 min-w-0 flex-1">
          {selectedChapter.name
            ? `${selectedChapter.name} - ${comic.title}`
            : `Ch. ${selectedChapter.order} - ${comic.title}`}
        </h3>

        {/* Next Chapter Button */}
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 flex-shrink-0"
          onClick={handleNextChapter}
          disabled={!hasNextChapter}
          aria-label="Next Chapter"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Pages Container - Scrollable */}
      <div
        ref={viewerContentRef}
        className="flex justify-center w-full overflow-auto flex-grow chapter-viewer-content relative"
      >
        {/* Inner container for scaling the entire image block */}
        <div
          className="flex flex-col w-full"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top center",
            transition: "transform 0.1s ease-out",
            paddingBottom: "60px",
          }}
        >
          {selectedChapter.pages.map((page: Page, index: number) => (
            <img
              key={page.id}
              alt={`Page ${page.id}`}
              src={page.url}
              loading="lazy"
              className="mx-auto"
              style={{
                display: "block",
                margin: "0 auto",
                padding: 0,
                ...(index === selectedChapter.pages.length - 1 && {
                  marginBottom: "80px",
                }),
              }}
            />
          ))}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-15 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-background/80 p-2 rounded-full shadow-md z-20">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={zoomOut}
          disabled={zoomLevel <= 0.1}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 min-w-14 text-xs"
          onClick={resetZoom}
        >
          {Math.round(zoomLevel * 100)}%
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={zoomIn}
          disabled={zoomLevel >= 5}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* Reading progress indicator */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-xs shadow-md">
        {currentImageIndex + 1} / {selectedChapter.pages.length}
      </div>

      {/* Footer with Navigation */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm p-2 border-t flex justify-between items-center gap-2 flex-shrink-0">
        {/* Previous Chapter Button with Number */}
        <div className="w-32 text-left">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevChapter}
            disabled={!hasPrevChapter}
            aria-label={`Previous Chapter (${hasPrevChapter
              ? sortedChaptersForNav[currentChapterIndex - 1].order
              : ""
              })`}
            className="flex items-center gap-1 px-2 w-full justify-start"
          >
            <ChevronLeft className="h-5 w-5 flex-shrink-0" />
            {hasPrevChapter && (
              <span className="text-xs font-medium truncate">
                {sortedChaptersForNav[currentChapterIndex - 1].name}
              </span>
            )}
            {!hasPrevChapter && <span className="h-5 w-5"></span>}
          </Button>
        </div>

        {/* Close Button (Center) */}
        <Button
          variant="outline"
          size="icon"
          className="flex-shrink-0 h-9 w-9"
          onClick={handleClose}
          aria-label="Close viewer"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Next Chapter Button with Number */}
        <div className="w-32 text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextChapter}
            disabled={!hasNextChapter}
            aria-label={`Next Chapter (${hasNextChapter
              ? sortedChaptersForNav[currentChapterIndex + 1].order
              : ""
              })`}
            className="flex items-center gap-1 px-2 w-full justify-end"
          >
            {hasNextChapter && (
              <span className="text-xs font-medium truncate">
                {sortedChaptersForNav[currentChapterIndex + 1].name}
              </span>
            )}
            {!hasNextChapter && <span className="h-5 w-5"></span>}
            <ChevronRight className="h-5 w-5 flex-shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  )
} 