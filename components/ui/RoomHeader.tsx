'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Room } from '@/lib/constants/rooms'

export function RoomHeader({ room }: { room: Room }) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-4 mb-6">
      <motion.button
        onClick={() => router.push('/')}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-1.5 text-sm transition-colors shrink-0"
        style={{ color: 'rgba(242,232,213,0.35)' }}
      >
        <span>←</span>
        <span className="hidden sm:inline">The Hall</span>
      </motion.button>

      <div className="flex items-center gap-3 mx-auto">
        {/* <motion.span
          className="text-3xl sm:text-4xl"
          animate={{
            filter: [
              `drop-shadow(0 0 8px ${room.glowColor}60)`,
              `drop-shadow(0 0 18px ${room.glowColor}cc)`,
              `drop-shadow(0 0 8px ${room.glowColor}60)`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {room.icon}
        </motion.span> */}
        <h1
          className="text-2xl sm:text-3xl md:text-4xl"
          style={{
            fontFamily: 'var(--font-cinzel)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#f2e8d5',
            textShadow: `0 0 32px ${room.glowColor}60, 0 1px 3px rgba(0,0,0,0.9)`,
          }}
        >
          {room.displayName}
        </h1>
      </div>

      <div className="shrink-0 w-16 hidden sm:block" />
    </div>
  )
}
