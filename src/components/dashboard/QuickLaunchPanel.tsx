import { SquarePen, Globe } from "lucide-react"
import { useState } from "react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
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

// Helper to get brand colors for the pop-up preview without touching the data types
const getBrandColor = (icon: string) => {
    const colors: Record<string, string> = {
        mail: "#EA4335",
        file: "#4285F4",
        calendar: "#34A853",
        terminal: "#24292F",
        folder: "#FBBC04",
        music: "#FF0000",
        camera: "#E1306C",
    }
    return colors[icon.toLowerCase()] || "#6366f1"
}

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
        })),
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
                : [{ name: "", href: "" }],
        )
        setModalOpen(true)
    }

    const save = () => {
        setQuickLaunchItems(draftToItems(draft))
        setModalOpen(false)
    }

    return (
        <TooltipProvider>
            <article className="rounded-2xl bg-card p-6 shadow-md ring-1 ring-border/40 lg:p-7">
                <div className="flex items-center justify-between gap-2">
                    <h2 className={dashboardSectionLabelClassName}>
                        Jump back in
                    </h2>
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
                                <SquarePen className="size-4" strokeWidth={2} />
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
                    <div className="mt-6 grid grid-cols-4 gap-3 sm:gap-4">
                        {quickLaunchItems.map((item) => (
                            <Tooltip key={item.id} delayDuration={100}>
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
                                        <span className="flex size-13 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border/50 transition duration-300 group-hover:shadow-md sm:size-14">
                                            <QuickLaunchIcon item={item} />
                                        </span>
                                    </a>
                                </TooltipTrigger>
                                
                                {/* NEW: ENHANCED POP-UP CONTENT */}
                                <TooltipContent 
                                    side="bottom" 
                                    sideOffset={12} 
                                    className="flex flex-col items-center gap-3 p-4 bg-popover border border-border rounded-xl shadow-2xl animate-in zoom-in-95 duration-200"
                                >
                                    <div 
                                        className="flex size-12 items-center justify-center rounded-lg bg-muted/30 shadow-inner"
                                        style={{ color: getBrandColor(item.icon) }}
                                    >
                                        <QuickLaunchIcon item={item} />
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                                            Quick Launch
                                        </span>
                                        <span className="font-bold text-sm text-foreground">
                                            {item.name}
                                        </span>
                                        {item.href !== "#" && (
                                            <span className="mt-1 max-w-[120px] truncate text-[10px] text-muted-foreground italic">
                                                {item.href.replace('https://', '')}
                                            </span>
                                        )}
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
        </TooltipProvider>
    )
}