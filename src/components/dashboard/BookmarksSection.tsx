"use client"

import { ChevronDown, ChevronRight, ExternalLink, Folder } from "lucide-react"

import { useState } from "react"

import { BookmarkIcon } from "@/components/animated-icons/bookmark-icon"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"

import type { BrowserBookmark } from "@/types/browser-bookmarks"
import { useBrowserBookmarks } from "@/hooks/use-browser-bookmarks"

const MAX_DEPTH = 2

const BookmarkFolder = ({
  node,
  depth,
}: {
  node: BrowserBookmark
  depth: number
}) => {
  const [open, setOpen] = useState(depth === 0)

  const children =
    node.children?.filter((child) => child.title || child.url) || []

  if (depth > MAX_DEPTH) {
    return null
  }

  return (
    <li className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={
          open
            ? `Collapse ${node.title || "bookmarks"}`
            : `Expand ${node.title || "bookmarks"}`
        }
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors",
          "hover:bg-muted/60"
        )}
      >
        {open ? (
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        )}

        <Folder className="size-4 shrink-0 text-primary" />

        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {node.title || "Bookmarks"}
        </span>

        <span className="shrink-0 text-[10px] text-muted-foreground">
          {children.length}
        </span>
      </button>

      {open ? (
        <ul className="ml-3 space-y-1 border-l border-border/40 pl-2">
          {children.slice(0, 30).map((child) => (
            <BookmarkNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

const BookmarkLink = ({ node }: { node: BrowserBookmark }) => {
  const [faviconError, setFaviconError] = useState(false)
  let domain = ""

  try {
    domain = node.url ? new URL(node.url).hostname : ""
  } catch {
    domain = ""
  }

  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  return (
    <li>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={node.url}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              "group flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-all",
              "hover:bg-muted/70"
            )}
          >
            <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/50">
              {!faviconError ? (
                <img
                  src={favicon}
                  alt=""
                  className="size-4 object-contain"
                  onError={() => setFaviconError(true)}
                />
              ) : null}

              <BookmarkIcon
                size={14}
                className="absolute opacity-0 transition-opacity group-hover:opacity-100"
              />
            </span>

            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {node.title || node.url}
            </span>

            <ExternalLink
              className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              strokeWidth={2}
            />
          </a>
        </TooltipTrigger>

        <TooltipContent side="right">
          <div className="max-w-xs">
            <p className="truncate font-medium">{node.title}</p>

            <p className="truncate text-xs opacity-70">{node.url}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </li>
  )
}

const BookmarkNode = ({
  node,
  depth,
}: {
  node: BrowserBookmark
  depth: number
}) => {
  const hasChildren = node.children && node.children.length > 0

  if (hasChildren) {
    return <BookmarkFolder node={node} depth={depth} />
  }

  if (!node.url) {
    return null
  }

  return <BookmarkLink node={node} />
}

export function BookmarksSection() {
  const { bookmarks, loading } = useBrowserBookmarks()

  return (
    <article className="flex h-[32rem] min-h-0 flex-col overflow-hidden rounded-2xl bg-card p-6 shadow-md ring-1 ring-border/40 lg:p-7">
      <div className="mb-4 flex items-center justify-between">
        <h2 className={dashboardSectionLabelClassName}>Browser Bookmarks</h2>

        {!loading ? (
          <span className="text-xs text-muted-foreground">
            {bookmarks.length} folders
          </span>
        ) : null}
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Loading bookmarks...
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-hidden">
          <ul className="h-full space-y-1 overflow-y-auto pr-1">
            {bookmarks.map((bookmark) => (
              <BookmarkNode key={bookmark.id} node={bookmark} depth={0} />
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
