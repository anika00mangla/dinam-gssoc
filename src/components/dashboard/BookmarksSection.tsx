"use client"

import {
  ExternalLink,
  MoreHorizontal,
  TypeIcon,
  PaletteIcon,
  FileTextIcon,
} from "lucide-react"
import { BookmarkIcon } from "@/components/animated-icons/bookmark-icon"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { Button } from "@/components/ui/button"
import { useDashboardState } from "@/context/dashboard-state"
import { cn } from "@/lib/utils"

export function BookmarksSection() {
  const { bookmarks } = useDashboardState()

  // Helper to pick icons based on title or random
  const getIconForBookmark = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes("design")) return BookmarkIcon
    if (t.includes("typography")) return TypeIcon
    if (t.includes("color")) return PaletteIcon
    return FileTextIcon
  }

  return (
    <article className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className={dashboardSectionLabelClassName}>Bookmarks</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground/50 hover:text-foreground"
        >
          <MoreHorizontal size={14} />
        </Button>
      </div>
      
      <ul className="flex flex-col gap-2">
        {bookmarks.map((item) => {
          const Icon = getIconForBookmark(item.title)
          return (
            <li key={item.id}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs font-medium text-foreground/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "hover:bg-white/5 hover:text-foreground"
                )}
              >
                <div className="flex size-7 shrink-0 items-center justify-center text-muted-foreground/60 transition-colors group-hover:text-foreground">
                  <Icon className="size-4" strokeWidth={2} />
                </div>
                <span className="min-w-0 flex-1 truncate">{item.title}</span>
                <ExternalLink
                  className="size-3.5 shrink-0 opacity-0 -translate-x-2 transition-all group-hover:opacity-40 group-hover:translate-x-0"
                  strokeWidth={2}
                />
              </a>
            </li>
          )
        })}
      </ul>
    </article>
  )
}
