import type { BrowserBookmark } from "@/types/browser-bookmarks"

export async function getBrowserBookmarks(): Promise<BrowserBookmark[]> {
  return new Promise((resolve) => {
    if (!chrome?.bookmarks) {
      resolve([])
      return
    }

    chrome.bookmarks.getTree((tree) => {
      resolve(tree as BrowserBookmark[])
    })
  })
}

export function subscribeToBookmarkChanges(
  callback: () => void
) {
  if (!chrome?.bookmarks) {
    return () => {}
  }

  chrome.bookmarks.onCreated.addListener(callback)
  chrome.bookmarks.onRemoved.addListener(callback)
  chrome.bookmarks.onChanged.addListener(callback)

  return () => {
    chrome.bookmarks.onCreated.removeListener(callback)
    chrome.bookmarks.onRemoved.removeListener(callback)
    chrome.bookmarks.onChanged.removeListener(callback)
  }
}
