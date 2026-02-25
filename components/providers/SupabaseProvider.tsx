'use client'

import { createContext, useContext, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type SupabaseContextType = SupabaseClient | null

const SupabaseContext = createContext<SupabaseContextType>(null)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState<SupabaseContextType>(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }
    return createClient()
  })

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  return useContext(SupabaseContext)
}
