'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ParchmentCard } from '@/components/ui/ParchmentCard'
import { useLedger, type EntryType, type LedgerEntry } from '@/lib/hooks/useLedger'

const TABS: { key: EntryType; label: string; singular: string }[] = [
  { key: 'notes', label: 'Notes', singular: 'note' },
  { key: 'goals', label: 'Goals', singular: 'goal' },
  { key: 'plans', label: 'Plans', singular: 'plan' },
]

interface LedgerPanelProps {
  roomSlug: string
  accentColor: string
}

export function LedgerPanel({ roomSlug, accentColor }: LedgerPanelProps) {
  const [activeTab, setActiveTab] = useState<EntryType>('notes')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')

  const { entries, loading, addEntry, updateEntry, deleteEntry } = useLedger(roomSlug, activeTab)
  const tab = TABS.find((t) => t.key === activeTab)!

  async function handleAdd() {
    if (!newTitle.trim() && !newBody.trim()) return
    await addEntry({ title: newTitle || null, body: newBody || null, entry_type: activeTab })
    setNewTitle('')
    setNewBody('')
    setAdding(false)
  }

  return (
    <ParchmentCard className="flex flex-col h-full" accent={accentColor}>
      {/* Header + Tabs */}
      <div
        className="px-5 pt-4 pb-3 shrink-0"
        style={{ borderBottom: '1px solid rgba(242,232,213,0.07)' }}
      >
        <h2 className="font-serif text-lg" style={{ color: '#f2e8d5' }}>
          The Ledger
        </h2>
        <div className="flex gap-1 mt-2.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setActiveTab(t.key); setEditingId(null) }}
              className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
              style={
                activeTab === t.key
                  ? { backgroundColor: '#6c0e11', color: '#f2e8d5' }
                  : { color: 'rgba(242,232,213,0.38)' }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5" style={{ minHeight: 0 }}>
        {loading && (
          <p className="text-sm text-center py-4" style={{ color: 'rgba(242,232,213,0.28)' }}>
            Loading…
          </p>
        )}
        {!loading && entries.length === 0 && !adding && (
          <p className="text-sm italic text-center py-4" style={{ color: 'rgba(242,232,213,0.28)' }}>
            No {tab.label.toLowerCase()} yet.
          </p>
        )}

        <AnimatePresence>
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              isEditing={editingId === entry.id}
              onEdit={() => setEditingId(entry.id)}
              onDone={() => setEditingId(null)}
              onChange={(fields) => updateEntry(entry.id, fields)}
              onDelete={() => deleteEntry(entry.id)}
              accentColor={accentColor}
            />
          ))}
        </AnimatePresence>

        {adding && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-3 space-y-2"
            style={{
              backgroundColor: 'rgba(242,232,213,0.05)',
              border: '1px solid rgba(242,232,213,0.12)',
            }}
          >
            <input
              autoFocus
              placeholder={`${tab.label} title (optional)`}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-transparent text-sm font-medium outline-none pb-1"
              style={{
                color: '#f2e8d5',
                borderBottom: '1px solid rgba(242,232,213,0.14)',
              }}
            />
            <textarea
              placeholder="Write here…"
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              rows={3}
              className="w-full bg-transparent text-sm outline-none resize-none"
              style={{ color: 'rgba(242,232,213,0.75)' }}
            />
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAdd}
                className="text-xs px-3 py-1 rounded-lg font-medium"
                style={{ backgroundColor: '#6c0e11', color: '#f2e8d5' }}
              >
                Save
              </button>
              <button
                onClick={() => { setAdding(false); setNewTitle(''); setNewBody('') }}
                className="text-xs"
                style={{ color: 'rgba(242,232,213,0.38)' }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 shrink-0"
        style={{ borderTop: '1px solid rgba(242,232,213,0.07)' }}
      >
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: 'rgba(242,232,213,0.38)' }}
        >
          <span className="text-base leading-none">+</span>
          <span>Add {tab.singular}</span>
        </button>
      </div>
    </ParchmentCard>
  )
}

// ─── Entry Card ───────────────────────────────────────────────────────────────

interface EntryCardProps {
  entry: LedgerEntry
  isEditing: boolean
  onEdit: () => void
  onDone: () => void
  onChange: (fields: Partial<LedgerEntry>) => void
  onDelete: () => void
  accentColor: string
}

function EntryCard({ entry, isEditing, onEdit, onDone, onChange, onDelete, accentColor }: EntryCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -8, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.22 }}
      className="group rounded-xl p-3"
      style={{
        backgroundColor: 'rgba(242,232,213,0.04)',
        border: '1px solid rgba(242,232,213,0.07)',
      }}
    >
      {entry.is_pinned && (
        <span className="text-xs mb-1.5 block" style={{ color: accentColor }}>
          📌 pinned
        </span>
      )}

      {isEditing ? (
        <div className="space-y-2">
          <input
            autoFocus
            value={entry.title ?? ''}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full bg-transparent text-sm font-medium outline-none pb-1"
            style={{ color: '#f2e8d5', borderBottom: '1px solid rgba(242,232,213,0.14)' }}
            placeholder="Title"
          />
          <textarea
            value={entry.body ?? ''}
            onChange={(e) => onChange({ body: e.target.value })}
            rows={3}
            className="w-full bg-transparent text-sm outline-none resize-none"
            style={{ color: 'rgba(242,232,213,0.75)' }}
            placeholder="Write here…"
          />
          <div className="flex gap-3 pt-1">
            <button onClick={onDone} className="text-xs" style={{ color: 'rgba(242,232,213,0.45)' }}>
              Done
            </button>
            <button onClick={onDelete} className="text-xs ml-auto" style={{ color: 'rgba(180,60,60,0.7)' }}>
              Delete
            </button>
          </div>
        </div>
      ) : (
        <button className="text-left w-full" onClick={onEdit}>
          {entry.title && (
            <p className="text-sm font-medium" style={{ color: '#f2e8d5' }}>
              {entry.title}
            </p>
          )}
          {entry.body && (
            <p className="text-xs mt-1 line-clamp-2" style={{ color: 'rgba(242,232,213,0.55)' }}>
              {entry.body}
            </p>
          )}
          {!entry.title && !entry.body && (
            <p className="text-xs italic" style={{ color: 'rgba(242,232,213,0.25)' }}>
              Empty — click to edit
            </p>
          )}
        </button>
      )}
    </motion.div>
  )
}
