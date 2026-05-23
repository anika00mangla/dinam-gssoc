import { SquarePenIcon } from "@/components/animated-icons/square-pen-icon"
import { useState } from "react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useDashboardState } from "@/context/dashboard-state"
import {
  QUICK_LAUNCH_ICON_POOL,
  type QuickLaunchItem,
} from "@/data/dashboard-mock"
import {
  fallbackNameFromQuickLaunchHref,
  normalizeQuickLaunchHref,
} from "@/lib/quick-launch-utils"

import {
  QuickLaunchEditModal,
  type QuickLaunchDraftSlot,
} from "./QuickLaunchEditModal"
import { QuickLaunchIcon } from "./QuickLaunchIcon"

function draftToItems(draft: QuickLaunchDraftSlot[]): QuickLaunchItem[] {
  const next: QuickLaunchItem[] = []
  for (const slot of draft) {
    const nameRaw = slot.name.trim()
    const hrefRaw = slot.href.trim()
    if (!nameRaw && !hrefRaw) continue
    const href = normalizeQuickLaunchHref(hrefRaw)
    if (!nameRaw && href === "#") continue
    const name = nameRaw || fallbackNameFromQuickLaunchHref(href)
    const icon =
      slot.icon ??
      QUICK_LAUNCH_ICON_POOL[next.length % QUICK_LAUNCH_ICON_POOL.length]!
    next.push({
      id: slot.id ?? `q-${crypto.randomUUID()}`,
      name,
      href,
      icon,
    })
  }
  return next
}

export function QuickLaunchPanel() {
  const { quickLaunchItems, setQuickLaunchItems } = useDashboardState()
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft] = useState<QuickLaunchDraftSlot[]>(() =>
    quickLaunchItems.map((item) => ({
      id: item.id,
      name: item.name,
      href: item.href === "#" ? "" : item.href,
      icon: item.icon,
    }))
  )

  const openModal = () => {
    setDraft(
      quickLaunchItems.length > 0
        ? quickLaunchItems.map((item) => ({
            id: item.id,
            name: item.name,
            href: item.href === "#" ? "" : item.href,
            icon: item.icon,
          }))
        : [{ name: "", href: "" }]
    )
    setModalOpen(true)
  }

  const save = () => {
    setQuickLaunchItems(draftToItems(draft))
    setModalOpen(false)
  }

  return (
    <>
      <article className="glass-card rounded-xl p-8">
        <div className="flex items-center justify-between gap-2">
          <h2 className={dashboardSectionLabelClassName}>JUMP BACK IN</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={openModal}
                className="text-muted-foreground"
                aria-label="Edit quick launch links"
              >
                <SquarePenIcon
                  size={16}
                  className="transition-colors group-hover:text-foreground"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>
              Edit quick links
            </TooltipContent>
          </Tooltip>
        </div>
        {quickLaunchItems.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            No shortcuts yet.{" "}
            <button
              type="button"
              className="font-medium text-primary underline-offset-2 hover:underline"
              onClick={openModal}
            >
              Add links
            </button>
          </p>
        ) : (
            <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-4 sm:gap-x-6 sm:gap-y-6 justify-items-center">
            {quickLaunchItems.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <a
                    href={item.href}
                    {...(item.href.startsWith("http")
                      ? {
                          target: "_blank",
                          rel: "noreferrer noopener",
                        }
                      : {})}
                    className="group flex flex-col items-center outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    aria-label={item.name}
                  >
                    <span className="shortcut-btn">
                      <span className="icon-plate">
                        <QuickLaunchIcon item={item} />
                      </span>
                    </span>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={6}>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{item.name}</span>
                    {item.href !== "#" ? (
                      <span className="max-w-56 truncate text-[0.65rem] opacity-80">
                        {item.href}
                      </span>
                    ) : null}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}
      </article>

      <QuickLaunchEditModal
        open={modalOpen}
        draft={draft}
        onDraftChange={setDraft}
        onClose={() => setModalOpen(false)}
        onSave={save}
      />
    </>
  )
}
