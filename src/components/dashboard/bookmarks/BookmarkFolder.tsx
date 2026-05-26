"use client"

import { Folder } from "lucide-react"

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import type { BrowserBookmark } from "@/types/browser-bookmarks"

export function BookmarkFolder({
  node,
  children,
}: {
  node: BrowserBookmark
  children: React.ReactNode
}) {
  return (
    <AccordionItem
      value={node.id}
      className="border-none"
    >
      <AccordionTrigger className="rounded-lg px-2 py-2 hover:bg-muted/50 hover:no-underline">
        <div className="flex items-center gap-2">
          <Folder className="size-4 text-primary" />

          <span className="truncate text-sm font-medium">
            {node.title || "Bookmarks"}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="ml-3 border-l border-border/40 pl-2">
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}
