'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export type Task = {
  id: string
  title: string
  is_complete: boolean
  sort_order: number
  due_date?: string | null
}

const DEMO_TASKS: Record<string, Task[]> = {
  banjo: [
    { id: 'd1', title: 'Practice fingerpicking patterns', is_complete: false, sort_order: 0 },
    { id: 'd2', title: 'Learn "Cripple Creek"', is_complete: false, sort_order: 1 },
    { id: 'd3', title: 'Tune the fifth string peg', is_complete: true, sort_order: 2 },
  ],
  garden: [
    { id: 'd1', title: 'Water the raised beds', is_complete: false, sort_order: 0 },
    { id: 'd2', title: 'Plant spring tomato seeds', is_complete: false, sort_order: 1 },
    { id: 'd3', title: 'Prune the rose bushes', is_complete: true, sort_order: 2 },
  ],
  school: [
    { id: 'd1', title: 'Read Chapter 4 notes', is_complete: false, sort_order: 0 },
    { id: 'd2', title: 'Flashcard review session', is_complete: false, sort_order: 1 },
    { id: 'd3', title: 'Submit essay draft', is_complete: false, sort_order: 2 },
  ],
  work: [
    { id: 'd1', title: 'Review open pull requests', is_complete: false, sort_order: 0 },
    { id: 'd2', title: 'Write weekly update', is_complete: false, sort_order: 1 },
    { id: 'd3', title: 'Clear inbox to zero', is_complete: true, sort_order: 2 },
  ],
  finance: [
    { id: 'd1', title: 'Log February expenses', is_complete: false, sort_order: 0 },
    { id: 'd2', title: 'Review savings goal progress', is_complete: false, sort_order: 1 },
    { id: 'd3', title: 'Pay credit card bill', is_complete: true, sort_order: 2 },
  ],
  workout: [
    { id: 'd1', title: 'Morning run — 30 min', is_complete: false, sort_order: 0 },
    { id: 'd2', title: 'Upper body strength circuit', is_complete: false, sort_order: 1 },
    { id: 'd3', title: 'Evening stretch routine', is_complete: true, sort_order: 2 },
  ],
}

const DEFAULT_DEMO: Task[] = [
  { id: 'd1', title: 'First task', is_complete: false, sort_order: 0 },
]

const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL

export function useTasks(roomSlug: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [roomId, setRoomId] = useState<string | null>(null)

  // Load room id + tasks
  useEffect(() => {
    if (isDemoMode) {
      setTasks(DEMO_TASKS[roomSlug] ?? DEFAULT_DEMO)
      setLoading(false)
      return
    }

    const supabase = createClient()

    async function load() {
      setLoading(true)
      // Get room
      const { data: room } = await supabase
        .from('rooms')
        .select('id')
        .eq('slug', roomSlug)
        .single()

      if (!room) { setLoading(false); return }
      setRoomId(room.id)

      const { data } = await supabase
        .from('tasks')
        .select('id, title, is_complete, sort_order, due_date')
        .eq('room_id', room.id)
        .order('sort_order')

      setTasks(data ?? [])
      setLoading(false)
    }

    load()
  }, [roomSlug])

  const addTask = useCallback(async (title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      is_complete: false,
      sort_order: tasks.length,
    }

    // Optimistic
    setTasks((prev) => [...prev, newTask])

    if (isDemoMode) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !roomId) return

    const { data } = await supabase
      .from('tasks')
      .insert({ title, room_id: roomId, user_id: user.id, sort_order: tasks.length })
      .select()
      .single()

    if (data) {
      setTasks((prev) => prev.map((t) => (t.id === newTask.id ? data : t)))
    }
  }, [tasks.length, roomId])

  const toggleTask = useCallback(async (id: string, complete: boolean) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, is_complete: complete } : t
      )
    )

    if (isDemoMode) return

    const supabase = createClient()
    await supabase
      .from('tasks')
      .update({ is_complete: complete, completed_at: complete ? new Date().toISOString() : null })
      .eq('id', id)
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))

    if (isDemoMode) return

    const supabase = createClient()
    await supabase.from('tasks').delete().eq('id', id)
  }, [])

  return { tasks, loading, addTask, toggleTask, deleteTask }
}
