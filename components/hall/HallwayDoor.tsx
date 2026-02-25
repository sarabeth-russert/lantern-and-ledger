'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Room } from '@/lib/constants/rooms'

interface Props {
  room: Room
  x: number   // left edge as viewport %
  y: number   // top edge as viewport %
  w: number   // width as viewport %
  h: number   // height as viewport %
}

// Invisible clickable hotspot overlaid on an illustrated door in the background image.
// Hover → diffuse room-colored glow, as if light intensifies from within.
export function HallwayHotspot({ room, x, y, w, h }: Props) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.button
      onClick={() => router.push(`/rooms/${room.slug}`)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
      className="absolute cursor-pointer focus:outline-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        height: `${h}%`,
        zIndex: 30,
      }}
      aria-label={`Enter ${room.displayName}`}
    >
      {/* Diffuse glow — extends beyond hotspot bounds so it bleeds naturally into the scene */}
      <motion.div
        className="pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '-30%',
          left: '-20%',
          right: '-20%',
          bottom: '-20%',
          background: `radial-gradient(ellipse at 50% 60%, ${room.glowColor}30 0%, ${room.glowColor}12 40%, transparent 70%)`,
          filter: 'blur(10px)',
        }}
      />
    </motion.button>
  )
}
