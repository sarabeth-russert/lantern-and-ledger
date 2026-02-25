'use client'

import { motion, useTransform, useSpring, useMotionTemplate, type MotionValue } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ROOMS } from '@/lib/constants/rooms'
import { STAGGER_CONTAINER, DOORWAY_ENTRANCE } from '@/lib/motion'
import { HallwayHotspot } from './HallwayDoor'
import { DustParticles } from './DustParticles'
import { FogWisps } from './FogWisps'

// Wall sconces — tuned to illustrated lantern positions in hallway-zoom-out.png.
const SCONCES = [
  // Right wall lanterns (near → far)
  { x: 96.5,   y: 18,   depth: 0.15 },
  { x: 69.2, y: 26, depth: 0.38 },
  { x: 60, y: 32.2, depth: 0.60 },
  // Left wall lanterns (near → far)
  { x: 22.3,   y: 26, depth: 0.15 },
  { x: 32,   y: 31.7,   depth: 0.38 },
  { x: 37.2,   y: 36.2, depth: 0.60 },
]

// Invisible clickable hotspots — tuned via DevTools against hallway-zoom-out.png.
const HOTSPOT_CONFIG = [
  { slug: 'banjo',   x: 75,  y:  5, w: 25, h: 75 }, // Banjo Hollow,    right wall near
  { slug: 'garden',  x: -7,  y: 10, w: 20, h: 65 }, // Potting Shed,    left wall near
  { slug: 'school',  x: 62,  y: 32, w: 9, h: 30 }, // Scholar's Den,   right wall mid
  { slug: 'work',    x: 22,  y: 28, w:  7, h: 38 }, // Workhall,        left wall mid
  { slug: 'finance', x: 55,  y: 38, w:  5, h: 20 }, // Counting Room,   right wall far
  { slug: 'workout', x: 32,  y: 35, w:  4, h: 20 }, // Training Yard,   left wall far
]

interface Props {
  scrollYProgress: MotionValue<number>
}

export default function HallwayScene({ scrollYProgress }: Props) {
  // Scroll zoom: scale 1 = entrance, scale 8 = deep inside the hallway.
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 8])
  const smoothScale = useSpring(sceneScale, { stiffness: 45, damping: 45 })

  // Subtle leftward pan: shifting the zoom origin slightly right causes the scene
  // to expand more toward the left as you scroll in — camera drifts left naturally.
  const originX = useTransform(scrollYProgress, [0, 1], [50, 50])
  const transformOrigin = useMotionTemplate`${originX}% 42%`


  const hotspots = HOTSPOT_CONFIG.map((cfg) => ({
    ...cfg,
    room: ROOMS.find((r) => r.slug === cfg.slug)!,
  }))

  return (
    <>
      {/* ─── Desktop Hallway (md+) ─────────────────────────────────────────── */}
      <div className="hidden md:block relative w-full h-full">
        {/* Dark base — visible before images load */}
        <div className="absolute inset-0" style={{ backgroundColor: '#0a0806' }} />

        {/* Scaling scene */}
        <motion.div
          className="absolute inset-0"
          style={{
            scale: smoothScale,
            transformOrigin: transformOrigin,
            willChange: 'transform',
          }}
        >
          {/* ── Hallway background ── */}
          {/* Image is 512×512 (square). cover on any landscape viewport always scales
              to fill full width — only top/bottom are clipped, never the sides. */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/hall/hallway-zoom-out.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* ── Ambient ceiling lantern glow ── */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background:
                'radial-gradient(ellipse 40% 18% at 58% 0%, rgba(245,160,40,0.10) 0%, transparent 70%)',
              zIndex: 5,
            }}
          />

          {/* ── Roiling fog at vanishing point ── */}
          <FogWisps scrollYProgress={scrollYProgress} />

          {/* ── Wall sconces (animated flicker over illustrated lanterns) ── */}
          {SCONCES.map((s, i) => {
            const sz = 1 - s.depth * 0.52
            return (
              <motion.div
                key={i}
                className="absolute pointer-events-none"
                style={{ left: `${s.x}%`, top: `${s.y}%`, zIndex: 22 }}
                animate={{ opacity: [0.6, 1, 0.4, 0.9, 0.65, 1, 0.3, 0.85, 0.55, 1, 0.6] }}
                transition={{
                  duration: 1.6 + i * 0.45,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.38,
                }}
              >
                <div
                  className="absolute"
                  style={{
                    transform: 'translate(-50%, -50%)',
                    width:  `${Math.round(220 * sz)}px`,
                    height: `${Math.round(280 * sz)}px`,
                    background: 'radial-gradient(ellipse at 50% 35%, rgba(210,120,20,0.15) 0%, transparent 65%)',
                    filter: 'blur(12px)',
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    transform: 'translate(-50%, -50%)',
                    width:  `${Math.round(90 * sz)}px`,
                    height: `${Math.round(90 * sz)}px`,
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse at center, rgba(255,175,35,0.65) 0%, rgba(220,120,15,0.28) 40%, transparent 70%)',
                    filter: `blur(${Math.round(5 * sz)}px)`,
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    transform: 'translate(-50%, -50%)',
                    width:  `${Math.round(7 * sz)}px`,
                    height: `${Math.round(9 * sz)}px`,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,230,120,0.98)',
                    boxShadow: `0 0 ${Math.round(8 * sz)}px ${Math.round(4 * sz)}px rgba(255,180,40,0.80)`,
                  }}
                />
              </motion.div>
            )
          })}

          {/* ── Dust particles ── */}
          <DustParticles />

          {/* ── Door hotspots ── */}
          {hotspots.map(({ room, x, y, w, h }) => (
            <HallwayHotspot key={room.slug} room={room} x={x} y={y} w={w} h={h} />
          ))}
        </motion.div>

        {/* ── Vignette PNG — outside scaling div, always fills viewport ── */}
        <img
          src="/hall/vignette.png"
          alt=""
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ objectFit: 'cover', zIndex: 40, mixBlendMode: 'multiply' }}
          draggable={false}
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement
            el.style.display = 'none'
            const fallback = el.nextElementSibling as HTMLElement | null
            if (fallback) fallback.style.display = 'block'
          }}
        />
        {/* CSS vignette fallback */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            display: 'none',
            zIndex: 40,
            background:
              'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.72) 100%)',
          }}
        />
      </div>

      {/* ─── Mobile Fallback (< md) ──────────────────────────────────────────── */}
      <MobileHall />
    </>
  )
}

// ─── Mobile: simple vertical dark layout ────────────────────────────────────
function MobileHall() {
  const router = useRouter()

  return (
    <div
      className="md:hidden flex flex-col items-center px-4 pt-12 pb-16 min-h-screen"
      style={{ backgroundColor: '#0a0806' }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 28% at 50% 0%, rgba(245,160,40,0.09) 0%, transparent 60%)',
        }}
      />
      <h1
        className="font-serif text-3xl mb-1 tracking-tight relative z-10"
        style={{ color: '#f2e8d5' }}
      >
        The Hall
      </h1>
      <p
        className="text-xs tracking-widest uppercase mb-8 relative z-10"
        style={{ color: 'rgba(242,232,213,0.28)' }}
      >
        Choose your room
      </p>
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-sm flex flex-col gap-3"
      >
        {ROOMS.map((room) => (
          <motion.button
            key={room.slug}
            variants={DOORWAY_ENTRANCE}
            onClick={() => router.push(`/rooms/${room.slug}`)}
            className="flex items-center gap-4 px-4 py-4 rounded-xl text-left cursor-pointer w-full"
            style={{
              backgroundColor: room.bgColor,
              border: '1px solid rgba(242,232,213,0.07)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            }}
            whileHover={{
              boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 20px 4px ${room.glowColor}33`,
            }}
            whileTap={{ scale: 0.97 }}
            aria-label={`Enter ${room.displayName}`}
          >
            <span
              className="text-2xl flex-shrink-0"
              style={{ filter: `drop-shadow(0 0 6px ${room.glowColor}90)` }}
            >
              {room.icon}
            </span>
            <div>
              <div className="font-serif text-base" style={{ color: 'rgba(242,232,213,0.95)' }}>
                {room.displayName}
              </div>
              <div className="text-xs mt-0.5" style={{ color: `${room.glowColor}99` }}>
                {room.tagline}
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
