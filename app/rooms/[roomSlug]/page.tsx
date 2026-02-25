'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { getRoomBySlug } from '@/lib/constants/rooms'
import { RoomHeader } from '@/components/ui/RoomHeader'
import { LanternPanel } from '@/components/room/LanternPanel'
import { LedgerPanel } from '@/components/room/LedgerPanel'
import { TaskBoard } from '@/components/room/TaskBoard'
import { DayTable } from '@/components/room/DayTable'
import { PAGE_TRANSITION, PANEL_ENTRANCE } from '@/lib/motion'

const PANEL_DELAY_MS = 4000

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomSlug: string }>
}) {
  const { roomSlug } = use(params)
  const room = getRoomBySlug(roomSlug)
  if (!room) notFound()

  const [panelsVisible, setPanelsVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setPanelsVisible(true), PANEL_DELAY_MS)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {/* ── Fixed room background illustration ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('/rooms/${room.slug}-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -2,
        }}
      />

      {/* ── Dark overlay: vignette + room color tint ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 120% 120% at 50% 50%, rgba(4,2,1,0.25) 0%, rgba(4,2,1,0.72) 100%),
            linear-gradient(to bottom, rgba(4,2,1,0.45) 0%, rgba(4,2,1,0.00) 25%, rgba(4,2,1,0.00) 75%, rgba(4,2,1,0.55) 100%)
          `,
          zIndex: -1,
        }}
      />

      {/* ── Room color atmospheric glow ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 40% at 50% -5%, ${room.glowColor}20 0%, transparent 60%)`,
          zIndex: -1,
        }}
      />

      <motion.main
        key={`room-${roomSlug}`}
        variants={PAGE_TRANSITION}
        initial="initial"
        animate="animate"
        className="min-h-screen"
        style={{ backgroundColor: 'transparent' }}
      >
        {/* Room accent top stripe */}
        <div
          className="h-px w-full"
          style={{
            background: `linear-gradient(to right, transparent, ${room.glowColor}80, transparent)`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <RoomHeader room={room} />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={panelsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
          >
            {/* Left: Lantern + Day Table */}
            <div className="flex flex-col gap-4">
              <motion.div custom={0} variants={PANEL_ENTRANCE}
                initial="hidden" animate={panelsVisible ? 'visible' : 'hidden'}
              >
                <LanternPanel room={room} />
              </motion.div>
              <motion.div custom={3} variants={PANEL_ENTRANCE}
                initial="hidden" animate={panelsVisible ? 'visible' : 'hidden'}
              >
                <DayTable roomSlug={room.slug} accentColor={room.accentColor} />
              </motion.div>
            </div>

            {/* Right: Task Board + Ledger */}
            <div className="flex flex-col gap-4">
              <motion.div custom={1} variants={PANEL_ENTRANCE}
                initial="hidden" animate={panelsVisible ? 'visible' : 'hidden'}
              >
                <TaskBoard roomSlug={room.slug} accentColor={room.accentColor} />
              </motion.div>
              <motion.div custom={2} variants={PANEL_ENTRANCE}
                initial="hidden" animate={panelsVisible ? 'visible' : 'hidden'}
              >
                <LedgerPanel roomSlug={room.slug} accentColor={room.accentColor} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.main>
    </>
  )
}
