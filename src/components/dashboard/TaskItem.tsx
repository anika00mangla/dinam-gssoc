import { Check, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { type DashboardTodo } from "@/context/dashboard-state"

interface TaskItemProps {
  todo: DashboardTodo
  isEditing?: boolean
  editLabel?: string
  editStartDate?: string
  editDueDate?: string
  currentVal?: number
  overdue?: boolean
  setEditLabel?: (val: string) => void
  setEditStartDate?: (val: string) => void
  setEditDueDate?: (val: string) => void
  onToggle?: () => void
  onDelete?: () => void
  onStartEdit?: () => void
  onCancelEdit?: () => void
  onCommitEdit?: () => void
  onDecrement?: () => void
  onIncrement?: () => void
}

export function TaskItem(props: TaskItemProps) {
  const {
    todo,
    isEditing,
    editLabel,
    setEditLabel,
    onToggle,
    onDelete,
    onStartEdit,
    onCancelEdit,
    onCommitEdit,
  } = props
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
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={todo.done}
            className={cn(
              "text-sm font-medium transition-all cursor-pointer truncate text-left bg-transparent border-none p-0",
              todo.done
                ? "text-muted-foreground/40 line-through"
                : "text-foreground/90"
            )}
          >
            {todo.label}
          </button>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover/task:opacity-100 group-focus-within/task:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={isEditing ? onCancelEdit : onStartEdit}
          aria-label={isEditing ? "Cancel edit" : "Edit task"}
          aria-expanded={isEditing}
          className="p-1 text-muted-foreground/40 hover:text-foreground transition-colors focus:outline-none focus-visible:shadow-focus"
        >
          <Pencil className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete task"
          className="p-1 text-muted-foreground/40 hover:text-destructive transition-colors focus:outline-none focus-visible:shadow-focus"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </li>
  )
}
