import { FiTag, FiUsers, FiGlobe, FiImage, FiMessageCircle } from "react-icons/fi"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AspectRatio } from "@/components/ui/aspect-ratio"
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

interface ComicDetailsProps {
  comic: Comic;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function ComicDetails({ comic, activeTab, onTabChange }: ComicDetailsProps) {
  const renderTagsContent = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {comic.tags?.map((tag, index) => (
          <Badge key={index} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    );
  }

  const renderArtistsContent = () => {
    return (
      <div className="space-y-2">
        {comic.artists?.map((artist, index) => (
          <div key={index} className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{artist.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{artist}</span>
          </div>
        ))}
      </div>
    );
  }

  const renderAltNamesContent = () => {
    return (
      <div className="space-y-2">
        {comic.alt_names?.map((alt, index) => (
          <div key={index} className="flex items-center">
            <span className="mr-2">{LanguageFlags[alt.language as keyof typeof LanguageFlags] || LanguageFlags.default}</span>
            <span>{alt.name}</span>
          </div>
        ))}
      </div>
    );
  }

  const renderArtsContent = () => {
    return (
      <div className="grid grid-cols-2 gap-2">
        {comic.arts?.map((art, index) => (
          <div key={index} className="overflow-hidden rounded-md">
            <AspectRatio ratio={3 / 4}>
              <img src={art} alt={`Art ${index + 1}`} className="h-full w-full object-cover" />
            </AspectRatio>
          </div>
        ))}
      </div>
    );
  }

  const renderCommentsContent = () => {
    return (
      <div className="space-y-4">
        {comic.comments && comic.comments.length > 0 ? (
          comic.comments.map((_comment, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <p>Comment placeholder</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No comments yet</p>
        )}
      </div>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="shrink-0">
        <CardTitle>Comic Details</CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex-1 overflow-hidden">
        <Tabs defaultValue="tags" value={activeTab} onValueChange={onTabChange} className="flex flex-col h-full">
          <TabsList className="w-full justify-center shrink-0">
            <TabsTrigger value="tags" className="flex items-center justify-center" title="Tags">
              <FiTag className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="artists" className="flex items-center justify-center" title="Artists">
              <FiUsers className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="altNames" className="flex items-center justify-center" title="Alternative Names">
              <FiGlobe className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="arts" className="flex items-center justify-center" title="Artwork">
              <FiImage className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center justify-center" title="Comments">
              <FiMessageCircle className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tags" className="p-0 mt-2 data-[state=active]:flex flex-col flex-1 overflow-hidden">
            <ScrollArea className="flex-1 w-full">
              <div className="p-4">
                {renderTagsContent()}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="artists" className="p-0 mt-2 data-[state=active]:flex flex-col flex-1 overflow-hidden">
            <ScrollArea className="flex-1 w-full">
              <div className="p-4">
                {renderArtistsContent()}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="altNames" className="p-0 mt-2 data-[state=active]:flex flex-col flex-1 overflow-hidden">
            <ScrollArea className="flex-1 w-full">
              <div className="p-4">
                {renderAltNamesContent()}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="arts" className="p-0 mt-2 data-[state=active]:flex flex-col flex-1 overflow-hidden">
            <ScrollArea className="flex-1 w-full">
              <div className="p-4">
                {renderArtsContent()}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="comments" className="p-0 mt-2 data-[state=active]:flex flex-col flex-1 overflow-hidden">
            <ScrollArea className="flex-1 w-full">
              <div className="p-4">
                {renderCommentsContent()}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 