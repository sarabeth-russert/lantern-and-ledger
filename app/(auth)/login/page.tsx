'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PAGE_TRANSITION } from '@/lib/motion'

type Mode = 'login' | 'signup'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<Mode>('login')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <motion.div
      variants={PAGE_TRANSITION}
      initial="initial"
      animate="animate"
      className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{ backgroundColor: '#0f0d0a' }}
    >
      {/* Atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 110%, rgba(108,14,17,0.28) 0%, transparent 65%),
                       radial-gradient(ellipse 40% 25% at 50% -5%, rgba(245,200,66,0.08) 0%, transparent 60%)`,
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4 inline-block lantern-flicker">🏮</div>
          <h1 className="font-serif text-3xl" style={{ color: '#f2e8d5' }}>
            Lantern &amp; Ledger
          </h1>
          {/* Red decorative rule */}
          <div className="flex items-center justify-center gap-3 my-3">
            <div className="h-px w-10" style={{ backgroundColor: 'rgba(108,14,17,0.6)' }} />
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#6c0e11' }} />
            <div className="h-px w-10" style={{ backgroundColor: 'rgba(108,14,17,0.6)' }} />
          </div>
          <p className="text-sm" style={{ color: 'rgba(242,232,213,0.35)' }}>
            Your personal life rooms
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: '#161210',
            border: '1px solid rgba(242,232,213,0.08)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-xs uppercase tracking-wider mb-1.5"
                style={{ color: 'rgba(242,232,213,0.40)' }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{
                  backgroundColor: 'rgba(242,232,213,0.06)',
                  border: '1px solid rgba(242,232,213,0.10)',
                  color: '#f2e8d5',
                }}
              />
            </div>

            <div>
              <label
                className="block text-xs uppercase tracking-wider mb-1.5"
                style={{ color: 'rgba(242,232,213,0.40)' }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{
                  backgroundColor: 'rgba(242,232,213,0.06)',
                  border: '1px solid rgba(242,232,213,0.10)',
                  color: '#f2e8d5',
                }}
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: '#c0392b' }}>
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-xl py-2.5 text-sm font-medium transition-colors"
              style={{
                backgroundColor: loading ? 'rgba(108,14,17,0.5)' : '#6c0e11',
                color: '#f2e8d5',
              }}
            >
              {loading ? '…' : mode === 'login' ? 'Enter the Hall' : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: 'rgba(242,232,213,0.32)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have one? '}
            <button
              onClick={() => setMode((m) => (m === 'login' ? 'signup' : 'login'))}
              className="underline"
              style={{ color: 'rgba(242,232,213,0.55)' }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  )
}
