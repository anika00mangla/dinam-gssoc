"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
// DnD temporarily removed to avoid heavy dependency when not in use.

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { useDashboardState } from "@/context/dashboard-state"
import { Button } from "@/components/ui/button"
import { TaskItem } from "./TaskItem"

export function TasksSection() {
  const { todos = [], addTodo, toggleTodo, updateTodo, deleteTodo, clearCompletedTodos } = useDashboardState()
  const [newTaskLabel, setNewTaskLabel] = useState("")

  const addTask = () => {
    const label = newTaskLabel.trim()
    if (!label) return
    addTodo(label, "", "", 0)
    setNewTaskLabel("")
  }

  return (
    <article className="glass-card flex min-h-0 flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className={dashboardSectionLabelClassName}>Focus Items</h2>
        <div className="flex items-center gap-1">
           {todos.filter((t) => t.done).length > 0 && (
            <button
              type="button"
              onClick={clearCompletedTodos}
              className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/40 hover:text-destructive transition-colors mr-2"
            >
              Clear ({todos.filter((t) => t.done).length})
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 transition-all">
        {(!todos || todos.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-2 opacity-40">
            <p className="text-xs font-medium">No focus items yet...</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1 mb-4">
            {todos.map((todo) => (
              <TaskItem
                key={todo.id}
                todo={todo}
                onToggle={() => toggleTodo(todo.id)}
                onDelete={() => deleteTodo(todo.id)}
                onUpdate={(label) => updateTodo(todo.id, { label })}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="relative flex-1">
           <input
            type="text"
            value={newTaskLabel}
            onChange={(e) => setNewTaskLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask()
            }}
            placeholder="New task title..."
            className="w-full h-9 bg-white/5 rounded-xl px-4 text-xs outline-none border border-transparent focus:border-white/10 transition-all placeholder:text-muted-foreground/30"
          />
        </div>
        <Button
          type="button"
          onClick={addTask}
          className="h-9 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-foreground font-semibold text-xs border border-white/5 shadow-sm transition-all active:scale-95"
        >
          <Plus className="size-3.5 mr-1" strokeWidth={3} />
          Add task
        </Button>
      </div>
    </article>
  )
}
