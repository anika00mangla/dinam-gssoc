import { Check, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { type DashboardTodo, useDashboardState } from "@/context/dashboard-state"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface TaskItemProps {
  todo: DashboardTodo
}

export function TaskItem({
  todo,
  isEditing,
  editLabel,
  setEditLabel,
  onToggle,
  onDelete,
  onStartEdit,
  onCancelEdit,
  onCommitEdit,
}: TaskItemProps) {
  return (
    <li className="group/task flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "size-5 shrink-0 rounded-full border-2 transition-all",
            todo.done
              ? "bg-foreground border-foreground text-background"
              : "border-muted-foreground/30 bg-transparent hover:border-muted-foreground/60"
          )}
        >
          {todo.done && <Check className="size-3 mx-auto" strokeWidth={4} />}
        </button>

        {isEditing ? (
          <input
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onCommitEdit()
              if (e.key === "Escape") onCancelEdit()
            }}
            className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-foreground p-0 focus:ring-0"
            autoFocus
          />
        ) : (
          <span
            onClick={onToggle}
            className={cn(
              "text-sm font-medium transition-all cursor-pointer truncate",
              todo.done
                ? "text-muted-foreground/40 line-through"
                : "text-foreground/90"
            )}
          >
            {todo.label}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover/task:opacity-100 transition-opacity">
        {!isEditing && (
          <button
            onClick={onStartEdit}
            className="p-1 text-muted-foreground/40 hover:text-foreground transition-colors"
          >
            <Pencil className="size-3.5" />
          </button>
        )}
        <button
          onClick={onDelete}
          className="p-1 text-muted-foreground/40 hover:text-destructive transition-colors"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </li>
  )
}
