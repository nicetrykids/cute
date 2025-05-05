"use client"

import * as React from "react"
import {
  BookOpen,
  BookMarked,
  MessageCircle,
  Mail,
  Clock,
  type LucideIcon,
  Search,
  RefreshCw,
  History,
  Heart,
  UserCheck,
  List,
  FileText,
  MessageSquare,
  Globe,
  Mail as MailIcon,
  Facebook
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavSetting } from "./nav-setting"
import { ThemeSwitcher } from "./theme-switcher"
import { useEffect, useState } from "react"
import { getHistoryComics, getComic } from "@/lib/db/indexedDb"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [historyComics, setHistoryComics] = useState<Array<{
    name: string
    url: string
    icon: LucideIcon
  }>>([])

  const [navItems] = useState([
    {
      title: "Comics",
      url: "/comics",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Search",
          url: "/comics",
          icon: Search
        },
        {
          title: "Update",
          url: "/comics/update",
          icon: RefreshCw
        },
        {
          title: "History",
          url: "/comics/history",
          icon: History
        },
      ],
    },
    {
      title: "Library",
      url: "/library",
      icon: BookMarked,
      isActive: true,
      items: [
        {
          title: "Favorite",
          url: "/library/favorite",
          icon: Heart
        },
        {
          title: "Following",
          url: "/library/following",
          icon: UserCheck
        },
        {
          title: "My List",
          url: "/library/mylist",
          icon: List
        },
      ],
    },
    {
      title: "Announcements",
      url: "/announcements",
      icon: MessageCircle,
      isActive: true,
      items: [
        {
          title: "Posts",
          url: "/announcements/posts",
          icon: FileText
        },
      ],
    },
    {
      title: "Contacts",
      url: "/contacts",
      icon: Mail,
      isActive: true,
      items: [
        {
          title: "Discord",
          url: "https://discord.gg/NjvFach34Z",
          icon: MessageSquare
        },
        {
          title: "MangaDex",
          url: "https://mangadex.org/group/9e4ee7e3-9756-43bb-b1b9-db5778b37e95/im-khok?tab=info",
          icon: Globe
        },
        {
          title: "Fanpage",
          url: "https://www.facebook.com/profile.php?id=61575825186196",
          icon: Facebook
        },
        {
          title: "Email",
          url: "mailto:wearekhok@gmail.com",
          icon: MailIcon
        },
      ],
    },
  ])

  useEffect(() => {
    const loadHistoryComics = async () => {
      try {
        const comicIds = await getHistoryComics(4)
        const comicsData = []

        for (const id of comicIds) {
          const comic = await getComic(id)
          if (comic) {
            comicsData.push({
              name: comic.title,
              url: `/comics/${comic.id}`,
              icon: Clock
            })
          }
        }

        setHistoryComics(comicsData)
      } catch (error) {
        console.error("Error loading history comics:", error)
      }
    }

    loadHistoryComics()
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ThemeSwitcher />
      </SidebarHeader>
      <SidebarContent className="no-scrollbar scroll-smooth">
        <NavMain items={navItems} />
        {historyComics.length > 0 && <NavProjects projects={historyComics} />}
      </SidebarContent>
      <SidebarFooter>
        <NavSetting />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
