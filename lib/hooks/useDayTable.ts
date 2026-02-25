'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export type ScheduleBlock = {
  id: string
  title: string
  day_of_week: number | null
  start_time: string | null
  end_time: string | null
  is_recurring: boolean
}

const DEMO_BLOCKS: Record<string, ScheduleBlock[]> = {
  banjo: [
    { id: 'd1', title: 'Morning practice', day_of_week: 1, start_time: '07:30', end_time: '08:00', is_recurring: true },
    { id: 'd2', title: 'Lesson', day_of_week: 3, start_time: '18:00', end_time: '19:00', is_recurring: true },
    { id: 'd3', title: 'Evening session', day_of_week: 6, start_time: '20:00', end_time: '21:00', is_recurring: true },
  ],
  garden: [
    { id: 'd1', title: 'Morning watering', day_of_week: 1, start_time: '08:00', end_time: '08:30', is_recurring: true },
    { id: 'd2', title: 'Weekend garden time', day_of_week: 6, start_time: '09:00', end_time: '11:00', is_recurring: true },
  ],
  school: [
    { id: 'd1', title: 'Morning study block', day_of_week: 1, start_time: '08:00', end_time: '10:00', is_recurring: true },
    { id: 'd2', title: 'Review session', day_of_week: 3, start_time: '19:00', end_time: '20:00', is_recurring: true },
  ],
  work: [
    { id: 'd1', title: 'Deep work block', day_of_week: 1, start_time: '09:00', end_time: '12:00', is_recurring: true },
    { id: 'd2', title: 'Weekly review', day_of_week: 5, start_time: '16:00', end_time: '17:00', is_recurring: true },
  ],
  finance: [
    { id: 'd1', title: 'Expense logging', day_of_week: 0, start_time: '10:00', end_time: '10:30', is_recurring: true },
    { id: 'd2', title: 'Monthly review', day_of_week: 0, start_time: '11:00', end_time: '12:00', is_recurring: false },
  ],
  workout: [
    { id: 'd1', title: 'Strength training', day_of_week: 1, start_time: '06:30', end_time: '07:30', is_recurring: true },
    { id: 'd2', title: 'Cardio run', day_of_week: 2, start_time: '06:30', end_time: '07:00', is_recurring: true },
    { id: 'd3', title: 'Strength training', day_of_week: 3, start_time: '06:30', end_time: '07:30', is_recurring: true },
  ],
}

const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL

export function useDayTable(roomSlug: string, dayOfWeek: number) {
  const [allBlocks, setAllBlocks] = useState<ScheduleBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [roomId, setRoomId] = useState<string | null>(null)

  const blocks = allBlocks.filter((b) => b.day_of_week === dayOfWeek)

  useEffect(() => {
    if (isDemoMode) {
      setAllBlocks(DEMO_BLOCKS[roomSlug] ?? [])
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
        .from('schedule_blocks')
        .select('id, title, day_of_week, start_time, end_time, is_recurring')
        .eq('room_id', room.id)
        .order('start_time')

      setAllBlocks((data as ScheduleBlock[]) ?? [])
      setLoading(false)
    }

    load()
  }, [roomSlug])

  const addBlock = useCallback(async (fields: Omit<ScheduleBlock, 'id'>) => {
    const newBlock: ScheduleBlock = { id: crypto.randomUUID(), ...fields }
    setAllBlocks((prev) => [...prev, newBlock])

    if (isDemoMode) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !roomId) return

    const { data } = await supabase
      .from('schedule_blocks')
      .insert({ ...fields, room_id: roomId, user_id: user.id })
      .select()
      .single()

    if (data) {
      setAllBlocks((prev) => prev.map((b) => (b.id === newBlock.id ? data : b)))
    }
  }, [roomId])

  const deleteBlock = useCallback(async (id: string) => {
    setAllBlocks((prev) => prev.filter((b) => b.id !== id))

    if (isDemoMode) return

    const supabase = createClient()
    await supabase.from('schedule_blocks').delete().eq('id', id)
  }, [])

  return { blocks, allBlocks, loading, addBlock, deleteBlock }
}
