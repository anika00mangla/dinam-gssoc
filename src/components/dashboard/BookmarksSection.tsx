"use client"

import { ExternalLink, Folder } from "lucide-react"
import { useEffect, useState } from "react"

import { BookmarkIcon } from "@/components/animated-icons/bookmark-icon"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"

type ChromeBookmarkNode = {
  id: string
  title: string
  url?: string
  children?: ChromeBookmarkNode[]
}

export function BookmarksSection() {
  const [bookmarks, setBookmarks] = useState<ChromeBookmarkNode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBookmarks() {
      try {
        if (
          typeof chrome === "undefined" ||
          !chrome.bookmarks
        ) {
          console.warn(
            "Chrome bookmark API unavailable."
          )
          setLoading(false)
          return
        }

        chrome.bookmarks.getTree((tree) => {
          setBookmarks(tree)
          setLoading(false)
        })
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }

    loadBookmarks()

    if (
      typeof chrome !== "undefined" &&
      chrome.bookmarks
    ) {
      const refresh = () => {
        chrome.bookmarks.getTree((tree) => {
          setBookmarks(tree)
        })
      }

      chrome.bookmarks.onCreated.addListener(refresh)
      chrome.bookmarks.onRemoved.addListener(refresh)
      chrome.bookmarks.onChanged.addListener(refresh)

      return () => {
        chrome.bookmarks.onCreated.removeListener(
          refresh
        )
        chrome.bookmarks.onRemoved.removeListener(
          refresh
        )
        chrome.bookmarks.onChanged.removeListener(
          refresh
        )
      }
    }
  }, [])

  function renderBookmarks(
    nodes: ChromeBookmarkNode[],
    level = 0
  ) {
    return nodes.map((item) => {
      const hasChildren =
        item.children && item.children.length > 0

      if (hasChildren) {
        return (
          <li key={item.id}>
            <div
              className="flex items-center gap-2 px-2 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
              style={{
                paddingLeft: `${level * 12}px`,
              }}
            >
              <Folder className="size-4 text-primary" />
              <span className="truncate">
                {item.title || "Bookmarks"}
              </span>
            </div>

            <ul className="flex flex-col gap-1">
              {renderBookmarks(
                item.children || [],
                level + 1
              )}
            </ul>
          </li>
        )
      }

      if (!item.url) {
        return null
      }

      const favicon = `https://www.google.com/s2/favicons?domain=${item.url}&sz=64`

      return (
        <li key={item.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer noopener"
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-medium text-card-foreground transition-colors outline-none",
                  "hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring/40"
                )}
                style={{
                  paddingLeft: `${level * 12 + 8}px`,
                }}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground overflow-hidden">
                  <img
                    src={favicon}
                    alt=""
                    className="size-4 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none"
                    }}
                  />

                  <BookmarkIcon
                    size={16}
                    className="absolute text-muted-foreground transition-colors group-hover:text-primary"
                  />
                </span>

                <span className="min-w-0 flex-1 truncate">
                  {item.title || item.url}
                </span>

                <ExternalLink
                  className="size-3.5 shrink-0 -translate-x-2 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  strokeWidth={2}
                  aria-hidden
                />
              </a>
            </TooltipTrigger>

            <TooltipContent
              side="right"
              sideOffset={6}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">
                  {item.title}
                </span>

                <span className="max-w-[16rem] truncate text-[0.65rem] opacity-80">
                  {item.url}
                </span>
              </div>
            </TooltipContent>
          </Tooltip>
        </li>
      )
    })
  }

  return (
    <article className="rounded-2xl bg-card p-6 shadow-md ring-1 ring-border/40 lg:p-7">
      <h2 className={dashboardSectionLabelClassName}>
        Browser Bookmarks
      </h2>

      {loading ? (
        <div className="mt-5 text-sm text-muted-foreground">
          Loading bookmarks...
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="mt-5 text-sm text-muted-foreground">
          No browser bookmarks found.
        </div>
      ) : (
        <ul className="mt-5 flex flex-col gap-1 overflow-y-auto max-h-[28rem] pr-1">
          {renderBookmarks(bookmarks)}
        </ul>
      )}
    </article>
  )
}
