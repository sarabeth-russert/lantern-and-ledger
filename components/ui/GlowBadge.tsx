'use client'

import { motion } from 'framer-motion'

interface GlowBadgeProps {
  icon: string
  color: string
  pulse?: boolean
}

export function GlowBadge({ icon, color, pulse = true }: GlowBadgeProps) {
  return (
    <motion.span
      animate={
        pulse
          ? {
              filter: [
                `drop-shadow(0 0 4px ${color}60)`,
                `drop-shadow(0 0 14px ${color}cc)`,
                `drop-shadow(0 0 4px ${color}60)`,
              ],
              scale: [1, 1.07, 1],
            }
          : undefined
      }
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      className="inline-block"
    >
      {icon}
    </motion.span>
  )
}
