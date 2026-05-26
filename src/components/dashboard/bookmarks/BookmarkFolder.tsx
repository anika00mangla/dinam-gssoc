"use client"

import { Folder } from "lucide-react"

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { ScrollArea } from "@/components/ui/scroll-area"

import type { BrowserBookmark } from "@/types/browser-bookmarks"

export function BookmarkFolder({
  node,
  children,
}: {
  node: BrowserBookmark
  children: React.ReactNode
}) {
  return (
    <AccordionItem value={node.id} className="border-none">
      <AccordionTrigger className="w-full min-w-0 rounded-lg px-2 py-2 hover:bg-muted/50 hover:no-underline">
        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
          <Folder className="size-4 text-primary" />

          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            {node.title || "Bookmarks"}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="min-w-0 overflow-hidden border-l border-border/40 pl-3 data-[state=closed]:hidden">
        <ScrollArea className="h-56 w-full">
          <div className="min-h-0 space-y-1 pr-2">{children}</div>
        </ScrollArea>
      </AccordionContent>
    </AccordionItem>
  )
}
