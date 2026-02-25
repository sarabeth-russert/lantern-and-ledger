'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { getRoomBySlug } from '@/lib/constants/rooms'
import { RoomHeader } from '@/components/ui/RoomHeader'
import { LanternPanel } from '@/components/room/LanternPanel'
import { LedgerPanel } from '@/components/room/LedgerPanel'
import { TaskBoard } from '@/components/room/TaskBoard'
import { DayTable } from '@/components/room/DayTable'
import { PAGE_TRANSITION, PANEL_ENTRANCE, STAGGER_CONTAINER } from '@/lib/motion'

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomSlug: string }>
}) {
  const { roomSlug } = use(params)
  const room = getRoomBySlug(roomSlug)
  if (!room) notFound()

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
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
          >
            {/* Left: Lantern + Day Table */}
            <div className="flex flex-col gap-4">
              <motion.div custom={0} variants={PANEL_ENTRANCE} className="flex flex-col flex-1">
                <LanternPanel room={room} />
              </motion.div>
              <motion.div custom={3} variants={PANEL_ENTRANCE}>
                <DayTable roomSlug={room.slug} accentColor={room.accentColor} />
              </motion.div>
            </div>

            {/* Right: Task Board + Ledger */}
            <div className="flex flex-col gap-4">
              <motion.div custom={1} variants={PANEL_ENTRANCE}>
                <TaskBoard roomSlug={room.slug} accentColor={room.accentColor} />
              </motion.div>
              <motion.div custom={2} variants={PANEL_ENTRANCE}>
                <LedgerPanel roomSlug={room.slug} accentColor={room.accentColor} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.main>
    </>
  )
}
