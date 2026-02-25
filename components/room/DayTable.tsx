'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ParchmentCard } from '@/components/ui/ParchmentCard'
import { useDayTable } from '@/lib/hooks/useDayTable'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatTime(time: string | null): string {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'pm' : 'am'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')}${ampm}`
}

interface DayTableProps {
  roomSlug: string
  accentColor: string
}

export function DayTable({ roomSlug, accentColor }: DayTableProps) {
  const today = new Date().getDay()
  const [selectedDay, setSelectedDay] = useState(today)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', start_time: '09:00', end_time: '10:00' })

  const { blocks, loading, addBlock, deleteBlock } = useDayTable(roomSlug, selectedDay)

  async function handleAdd() {
    if (!form.title.trim()) return
    await addBlock({
      title: form.title.trim(),
      day_of_week: selectedDay,
      start_time: form.start_time,
      end_time: form.end_time,
      is_recurring: true,
    })
    setForm({ title: '', start_time: '09:00', end_time: '10:00' })
    setAdding(false)
  }

  const sorted = [...blocks].sort((a, b) => {
    if (!a.start_time) return 1
    if (!b.start_time) return -1
    return a.start_time.localeCompare(b.start_time)
  })

  return (
    <ParchmentCard className="flex flex-col h-full" accent={accentColor}>
      <div
        className="px-5 pt-4 pb-3 shrink-0"
        style={{ borderBottom: '1px solid rgba(242,232,213,0.07)' }}
      >
        <h2 className="font-serif text-lg" style={{ color: '#f2e8d5' }}>
          Day Table
        </h2>

        {/* Week strip */}
        <div className="flex gap-1 mt-2.5">
          {DAYS.map((day, i) => (
            <button
              key={day}
              onClick={() => setSelectedDay(i)}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={
                selectedDay === i
                  ? { backgroundColor: '#6c0e11', color: '#f2e8d5' }
                  : i === today
                  ? { color: '#f2e8d5', border: '1px solid rgba(242,232,213,0.18)' }
                  : { color: 'rgba(242,232,213,0.30)' }
              }
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4" style={{ minHeight: 0 }}>
        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'rgba(242,232,213,0.28)' }}>
          {DAY_FULL[selectedDay]}
        </p>

        {loading && (
          <p className="text-sm text-center py-4" style={{ color: 'rgba(242,232,213,0.28)' }}>
            Loading…
          </p>
        )}

        {!loading && sorted.length === 0 && !adding && (
          <p className="text-sm italic" style={{ color: 'rgba(242,232,213,0.25)' }}>
            Nothing scheduled.
          </p>
        )}

        <div className="space-y-2">
          <AnimatePresence>
            {sorted.map((block) => (
              <motion.div
                key={block.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8, height: 0 }}
                transition={{ duration: 0.22 }}
                className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5"
                style={{
                  backgroundColor: `${accentColor}12`,
                  borderLeft: `2px solid ${accentColor}70`,
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#f2e8d5' }}>
                    {block.title}
                  </p>
                  {(block.start_time || block.end_time) && (
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(242,232,213,0.42)' }}>
                      {formatTime(block.start_time)}
                      {block.end_time && ` — ${formatTime(block.end_time)}`}
                    </p>
                  )}
                </div>
                {block.is_recurring && (
                  <span className="text-xs shrink-0" style={{ color: 'rgba(242,232,213,0.22)' }}>
                    ↻
                  </span>
                )}
                <button
                  onClick={() => deleteBlock(block.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs shrink-0"
                  style={{ color: 'rgba(242,232,213,0.22)' }}
                >
                  ×
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {adding && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-3 space-y-2"
              style={{
                border: '1px solid rgba(242,232,213,0.12)',
                backgroundColor: 'rgba(242,232,213,0.04)',
              }}
            >
              <input
                autoFocus
                placeholder="Block title…"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: '#f2e8d5' }}
              />
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={form.start_time}
                  onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
                  className="flex-1 bg-transparent text-xs outline-none"
                  style={{ color: 'rgba(242,232,213,0.60)' }}
                />
                <span className="text-xs" style={{ color: 'rgba(242,232,213,0.25)' }}>→</span>
                <input
                  type="time"
                  value={form.end_time}
                  onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
                  className="flex-1 bg-transparent text-xs outline-none"
                  style={{ color: 'rgba(242,232,213,0.60)' }}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleAdd}
                  className="text-xs px-3 py-1 rounded-lg font-medium"
                  style={{ backgroundColor: '#6c0e11', color: '#f2e8d5' }}
                >
                  Save
                </button>
                <button
                  onClick={() => setAdding(false)}
                  className="text-xs"
                  style={{ color: 'rgba(242,232,213,0.38)' }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div
        className="px-5 py-3 shrink-0"
        style={{ borderTop: '1px solid rgba(242,232,213,0.07)' }}
      >
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 text-sm"
          style={{ color: 'rgba(242,232,213,0.38)' }}
        >
          <span className="text-base leading-none">+</span>
          <span>Add block</span>
        </button>
      </div>
    </ParchmentCard>
  )
}
