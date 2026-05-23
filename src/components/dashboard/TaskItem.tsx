import { Check, Pencil, Trash2, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { type DashboardTodo } from "@/context/dashboard-state"

interface TaskItemProps {
  todo: DashboardTodo
  isEditing: boolean
  editLabel: string
  editStartDate: string
  editDueDate: string
  currentVal: number
  overdue: boolean
  setEditLabel: (val: string) => void
  setEditStartDate: (val: string) => void
  setEditDueDate: (val: string) => void
  onToggle: () => void
  onDelete: () => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onCommitEdit: () => void
  onDecrement: () => void
  onIncrement: () => void
}

function formatTaskDate(dateStr?: string): string {
  if (!dateStr) return "—"
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return "—"
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  } catch {
    return "—"
  }
}

export function TaskItem({
  todo,
  isEditing,
  editLabel,
  editStartDate,
  editDueDate,
  currentVal,
  overdue,
  setEditLabel,
  setEditStartDate,
  setEditDueDate,
  onToggle,
  onDelete,
  onStartEdit,
  onCancelEdit,
  onCommitEdit,
  onDecrement,
  onIncrement,
}: TaskItemProps) {
  const formattedStart = formatTaskDate(todo.startDate)
  const formattedDue = formatTaskDate(todo.dueDate)
  const todayIso = new Date().toISOString().split("T")[0]
  const isDueToday = todo.dueDate === todayIso

  return (
    <li className="group/task flex flex-col gap-3 rounded-xl border border-border/30 bg-muted/15 p-4 transition-colors hover:bg-muted/35">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={onToggle}
            disabled={isEditing}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors",
              todo.done
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary/30 bg-transparent",
              isEditing && "pointer-events-none opacity-40"
            )}
          >
            {todo.done ? <Check className="size-4" strokeWidth={3} /> : null}
          </button>

          {isEditing ? (
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onCommitEdit()
              }}
              className="min-w-0 flex-1 rounded-lg border border-border bg-card px-4 py-2 text-lg font-medium text-card-foreground outline-none focus:border-primary"
              autoFocus
            />
          ) : (
            <button
              type="button"
              onClick={onToggle}
              className={cn(
                "min-w-0 flex-1 text-left text-lg truncate",
                todo.done
                  ? "text-muted-foreground line-through"
                  : "font-medium text-card-foreground",
                overdue && "font-bold text-destructive"
              )}
            >
              {todo.label}
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {overdue ? (
            <span className="text-xs font-semibold uppercase tracking-wider text-destructive">Urgent</span>
          ) : todo.dueDate ? (
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              {isDueToday ? "Today" : formattedDue}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground/60">&nbsp;</span>
          )}

          <div className="hidden md:flex items-center gap-2">
            <div
              className={cn(
                "inline-flex items-center rounded-lg border border-border/60 bg-card p-0.5 shadow-sm",
                isEditing && "pointer-events-none opacity-40"
              )}
            >
              <button
                type="button"
                disabled={todo.done || currentVal === 0}
                onClick={onDecrement}
                className="flex size-6 items-center justify-center rounded-md font-sans text-sm font-bold text-muted-foreground hover:bg-muted"
              >
                −
              </button>
              <span className="w-12 text-center font-mono text-xs font-bold">
                {currentVal}%
              </span>
              <button
                type="button"
                disabled={todo.done || currentVal === 100}
                onClick={onIncrement}
                className="flex size-6 items-center justify-center rounded-md font-sans text-sm font-bold text-muted-foreground hover:bg-muted"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Input Panel row editing block drawer */}
      {isEditing && (
        <div className="mt-1 flex flex-wrap items-center gap-4 rounded-xl border border-border/40 bg-background/50 p-2.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="size-3.5 text-primary/70" />
            <span>Start:</span>
            <input
              type="date"
              value={editStartDate}
              onChange={(e) => setEditStartDate(e.target.value)}
              className="rounded border border-border/60 bg-card px-2 py-0.5 font-mono text-xs text-foreground outline-none"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="size-3.5 text-destructive/70" />
            <span>Finish:</span>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="rounded border border-border/60 bg-card px-2 py-0.5 font-mono text-xs text-foreground outline-none"
            />
          </div>
        </div>
      )}

      <div className="mt-0.5 flex items-center justify-end gap-3 border-t border-border/20 pt-2">
        {isEditing ? (
          <>
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
              onClick={onCommitEdit}
            >
              <Check className="size-3.5" strokeWidth={3} /> Save Changes
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
              onClick={onStartEdit}
            >
              <Pencil className="size-3" /> Edit Task
            </button>
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="size-3" /> Delete
            </button>
          </>
        )}
      </div>
    </li>
  )
}
