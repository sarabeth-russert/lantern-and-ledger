'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ParchmentCard } from '@/components/ui/ParchmentCard'
import { useTasks } from '@/lib/hooks/useTasks'

interface TaskBoardProps {
  roomSlug: string
  accentColor: string
}

export function TaskBoard({ roomSlug, accentColor }: TaskBoardProps) {
  const [newTitle, setNewTitle] = useState('')
  const [showDone, setShowDone] = useState(true)
  const { tasks, loading, addTask, toggleTask, deleteTask } = useTasks(roomSlug)

  const openTasks = tasks.filter((t) => !t.is_complete)
  const doneTasks = tasks.filter((t) => t.is_complete)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    setNewTitle('')
    await addTask(title)
  }

  return (
    <ParchmentCard className="flex flex-col h-full" accent={accentColor}>
      <div
        className="px-5 py-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(242,232,213,0.07)' }}
      >
        <h2 className="font-serif text-lg" style={{ color: '#f2e8d5' }}>
          Task Board
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4" style={{ minHeight: 0 }}>
        {loading && (
          <p className="text-sm text-center py-4" style={{ color: 'rgba(242,232,213,0.28)' }}>
            Loading…
          </p>
        )}

        {/* Open tasks */}
        <AnimatePresence initial={false}>
          {openTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="group flex items-start gap-3 py-2.5"
            >
              {/* Circle checkbox */}
              <motion.button
                onClick={() => toggleTask(task.id, true)}
                whileHover={{
                  boxShadow: `0 0 0 4px ${accentColor}30`,
                  borderColor: accentColor,
                }}
                whileTap={{ scale: 0.85 }}
                className="mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 transition-all"
                style={{ borderColor: 'rgba(242,232,213,0.22)' }}
                aria-label={`Complete: ${task.title}`}
              />

              <span className="flex-1 text-sm leading-relaxed" style={{ color: '#f2e8d5' }}>
                {task.title}
              </span>

              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs shrink-0 mt-0.5"
                style={{ color: 'rgba(242,232,213,0.22)' }}
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {openTasks.length === 0 && !loading && (
          <p className="text-sm italic py-2" style={{ color: 'rgba(242,232,213,0.25)' }}>
            No open tasks — add one below.
          </p>
        )}

        {/* Done section */}
        {doneTasks.length > 0 && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(242,232,213,0.07)' }}>
            <button
              onClick={() => setShowDone((v) => !v)}
              className="flex items-center gap-1.5 text-xs uppercase tracking-wider mb-2"
              style={{ color: 'rgba(242,232,213,0.28)' }}
            >
              <span
                className="inline-block transition-transform duration-200"
                style={{ transform: showDone ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                ›
              </span>
              Done ({doneTasks.length})
            </button>

            <AnimatePresence>
              {showDone && doneTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 0.4, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="group flex items-start gap-3 py-2"
                >
                  <button
                    onClick={() => toggleTask(task.id, false)}
                    className="mt-0.5 w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-xs"
                    style={{ backgroundColor: 'rgba(242,232,213,0.15)', color: 'rgba(242,232,213,0.5)' }}
                  >
                    ✓
                  </button>
                  <span className="flex-1 text-sm line-through" style={{ color: 'rgba(242,232,213,0.5)' }}>
                    {task.title}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    style={{ color: 'rgba(242,232,213,0.22)' }}
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="px-5 py-3 flex gap-2 shrink-0"
        style={{ borderTop: '1px solid rgba(242,232,213,0.07)' }}
      >
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New task…"
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: '#f2e8d5' }}
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="text-sm shrink-0 transition-colors"
          style={{ color: newTitle.trim() ? 'rgba(242,232,213,0.6)' : 'rgba(242,232,213,0.18)' }}
        >
          Add
        </button>
      </form>
    </ParchmentCard>
  )
}
