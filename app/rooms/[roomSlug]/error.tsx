'use client'

import { motion } from 'framer-motion'

export default function RoomError({ reset }: { reset: () => void }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: '#0f0d0a' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-xs"
      >
        <div className="text-4xl mb-4 lantern-flicker">🕯️</div>
        <h2 className="font-serif text-2xl mb-2" style={{ color: '#f2e8d5' }}>
          The lantern flickered…
        </h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(242,232,213,0.42)' }}>
          Something went wrong in this room.
        </p>
        <motion.button
          onClick={reset}
          whileTap={{ scale: 0.97 }}
          className="rounded-xl px-6 py-2.5 text-sm font-medium"
          style={{ backgroundColor: '#6c0e11', color: '#f2e8d5' }}
        >
          Try again
        </motion.button>
      </motion.div>
    </div>
  )
}
