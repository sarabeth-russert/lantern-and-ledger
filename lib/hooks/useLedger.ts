'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export type EntryType = 'notes' | 'goals' | 'plans'

export type LedgerEntry = {
  id: string
  title: string | null
  body: string | null
  entry_type: EntryType
  is_pinned: boolean
  created_at: string
}

const DEMO_ENTRIES: Record<string, LedgerEntry[]> = {
  banjo: [
    {
      id: 'd1',
      title: 'Practice philosophy',
      body: '15 minutes daily beats 2 hours on weekends. Consistency over intensity.',
      entry_type: 'notes',
      is_pinned: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'd2',
      title: 'Master repertoire by June',
      body: 'Learn 10 songs I can play confidently at any tempo.',
      entry_type: 'goals',
      is_pinned: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'd3',
      title: 'Year plan',
      body: 'Q1: fundamentals. Q2: 10 songs. Q3: first jam session. Q4: record something.',
      entry_type: 'plans',
      is_pinned: false,
      created_at: new Date().toISOString(),
    },
  ],
  garden: [
    {
      id: 'd1',
      title: 'Water schedule',
      body: 'Raised beds: every 2 days. Containers: daily in summer.',
      entry_type: 'notes',
      is_pinned: true,
      created_at: new Date().toISOString(),
    },
  ],
  school: [
    {
      id: 'd1',
      title: 'Study method',
      body: 'Pomodoro: 25 min focused, 5 min break. Review notes within 24 hours of lecture.',
      entry_type: 'notes',
      is_pinned: true,
      created_at: new Date().toISOString(),
    },
  ],
  work: [
    {
      id: 'd1',
      title: 'Weekly review template',
      body: 'Every Friday: clear inbox, update project boards, write next week priorities.',
      entry_type: 'notes',
      is_pinned: true,
      created_at: new Date().toISOString(),
    },
  ],
  finance: [
    {
      id: 'd1',
      title: 'Budget rule',
      body: '50/30/20: needs, wants, savings. Track weekly, review monthly.',
      entry_type: 'notes',
      is_pinned: true,
      created_at: new Date().toISOString(),
    },
  ],
  workout: [
    {
      id: 'd1',
      title: 'Current program',
      body: 'M/W/F: strength. T/Th: cardio. Weekend: active recovery or rest.',
      entry_type: 'notes',
      is_pinned: true,
      created_at: new Date().toISOString(),
    },
  ],
}

const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL

export function useLedger(roomSlug: string, entryType: EntryType) {
  const [entries, setEntries] = useState<LedgerEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [roomId, setRoomId] = useState<string | null>(null)
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  useEffect(() => {
    if (isDemoMode) {
      const all = DEMO_ENTRIES[roomSlug] ?? []
      setEntries(all.filter((e) => e.entry_type === entryType))
      setLoading(false)
      return
    }

    const supabase = createClient()

    async function load() {
      setLoading(true)
      const { data: room } = await supabase
        .from('rooms')
        .select('id')
        .eq('slug', roomSlug)
        .single()

      if (!room) { setLoading(false); return }
      setRoomId(room.id)

      const { data } = await supabase
        .from('ledger_entries')
        .select('id, title, body, entry_type, is_pinned, created_at')
        .eq('room_id', room.id)
        .eq('entry_type', entryType)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })

      setEntries((data as LedgerEntry[]) ?? [])
      setLoading(false)
    }

    load()
  }, [roomSlug, entryType])

  const addEntry = useCallback(async (fields: Pick<LedgerEntry, 'title' | 'body' | 'entry_type'>) => {
    const newEntry: LedgerEntry = {
      id: crypto.randomUUID(),
      title: fields.title,
      body: fields.body,
      entry_type: fields.entry_type,
      is_pinned: false,
      created_at: new Date().toISOString(),
    }

    setEntries((prev) => [newEntry, ...prev])

    if (isDemoMode) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !roomId) return

    const { data } = await supabase
      .from('ledger_entries')
      .insert({ ...fields, room_id: roomId, user_id: user.id })
      .select()
      .single()

    if (data) {
      setEntries((prev) => prev.map((e) => (e.id === newEntry.id ? data : e)))
    }
  }, [roomId])

  const updateEntry = useCallback((id: string, fields: Partial<LedgerEntry>) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...fields } : e))
    )

    if (isDemoMode) return

    // Debounced save
    clearTimeout(saveTimers.current[id])
    saveTimers.current[id] = setTimeout(async () => {
      const supabase = createClient()
      await supabase.from('ledger_entries').update(fields).eq('id', id)
    }, 800)
  }, [])

  const deleteEntry = useCallback(async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))

    if (isDemoMode) return

    const supabase = createClient()
    await supabase.from('ledger_entries').delete().eq('id', id)
  }, [])

  return { entries, loading, addEntry, updateEntry, deleteEntry }
}
