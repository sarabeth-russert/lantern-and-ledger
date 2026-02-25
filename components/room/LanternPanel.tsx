'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ParchmentCard } from '@/components/ui/ParchmentCard'
import type { Room } from '@/lib/constants/rooms'

type Message = { role: 'user' | 'assistant'; content: string }

export function LanternPanel({ room }: { room: Room }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    setInput('')
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/lantern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomSlug: room.slug, messages: [...messages, userMsg] }),
      })

      if (!res.ok) throw new Error(await res.text())

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantContent += decoder.decode(value, { stream: true })
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: assistantContent },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'The lantern flickered — check your API key in .env.local.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <ParchmentCard className="h-full flex flex-col min-h-[460px]" accent={room.accentColor}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(242,232,213,0.07)' }}
      >
        {/* Lantern image with pulse ring */}
        <div className="relative shrink-0 w-9 h-9">
          <Image
            src="/lantern.png"
            alt="Lantern"
            width={36}
            height={36}
            className="lantern-flicker w-full h-full"
            style={{ objectFit: 'contain' }}
          />
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{
              boxShadow: [
                `0 0 0 0px ${room.glowColor}80`,
                `0 0 0 14px ${room.glowColor}00`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        </div>

        <div>
          <h2 className="font-serif text-lg leading-tight" style={{ color: '#f2e8d5' }}>
            The Lantern
          </h2>
          <p className="text-xs" style={{ color: 'rgba(242,232,213,0.38)' }}>
            {room.displayName} advisor
          </p>
        </div>

        {loading && (
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="ml-auto text-xs font-medium"
            style={{ color: room.accentColor }}
          >
            thinking…
          </motion.div>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-3"
        style={{ minHeight: 0 }}
      >
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8 space-y-3"
          >
            <div
              className="text-xs uppercase tracking-widest"
              style={{ color: 'rgba(242,232,213,0.25)' }}
            >
              The lantern awaits
            </div>
            <p className="text-sm italic" style={{ color: 'rgba(242,232,213,0.35)' }}>
              Ask anything about your {room.displayName.toLowerCase()} practice…
            </p>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed"
                style={
                  msg.role === 'user'
                    ? {
                        backgroundColor: '#6c0e11',
                        color: '#f2e8d5',
                      }
                    : {
                        backgroundColor: 'rgba(242,232,213,0.06)',
                        color: '#f2e8d5',
                        border: '1px solid rgba(242,232,213,0.09)',
                      }
                }
              >
                {msg.content}
                {loading && i === messages.length - 1 && msg.role === 'assistant' && (
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                    className="inline-block w-1.5 h-3.5 ml-1 rounded-sm align-middle"
                    style={{ backgroundColor: room.accentColor }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div
        className="px-5 py-4 flex gap-3 shrink-0"
        style={{ borderTop: '1px solid rgba(242,232,213,0.07)' }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Ask your lantern…"
          disabled={loading}
          className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
          style={{
            backgroundColor: 'rgba(242,232,213,0.06)',
            border: '1px solid rgba(242,232,213,0.09)',
            color: '#f2e8d5',
          }}
        />
        <motion.button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          whileTap={{ scale: 0.95 }}
          className="rounded-xl px-4 py-2.5 text-sm font-medium shrink-0 transition-colors"
          style={{
            backgroundColor: input.trim() && !loading ? '#6c0e11' : 'rgba(242,232,213,0.07)',
            color: '#f2e8d5',
            opacity: loading ? 0.5 : 1,
          }}
        >
          Send
        </motion.button>
      </div>
    </ParchmentCard>
  )
}
