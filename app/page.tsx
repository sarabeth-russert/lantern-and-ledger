'use client'

import { useScroll } from 'framer-motion'
import HallwayScene from '@/components/hall/HallwayScene'

export default function Hall() {
  const { scrollYProgress } = useScroll()

  return (
    // 500vh: plenty of scroll range to walk deep into the hallway
    <main className="relative" style={{ height: '1200vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <HallwayScene scrollYProgress={scrollYProgress} />

        {/* ── Hall header — sits above the vignette, never scrolls ── */}
        <div
          className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center pointer-events-none"
          style={{
            height: '96px',
            background: 'linear-gradient(to bottom, rgba(6,4,2,0.88) 0%, rgba(6,4,2,0.55) 65%, transparent 100%)',
            zIndex: 45,
          }}
        >
          {/* Decorative rule */}
          <div className="flex items-center gap-3 mb-1">
            <span style={{ color: 'rgba(196,152,64,0.5)', fontSize: '8px', letterSpacing: '4px' }}>── ✦ ──</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: '#c49840',
              textShadow: '0 0 28px rgba(196,152,64,0.55), 0 1px 2px rgba(0,0,0,0.9)',
              lineHeight: 1,
            }}
          >
            Lantern &amp; Ledger
          </h1>
        </div>
      </div>
    </main>
  )
}
