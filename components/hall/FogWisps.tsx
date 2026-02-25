'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'

// Wisps are centered at the vanishing point (50%, 42%) via negative margins.
// Drift uses pixel values — predictable, no percentage-sizing surprises.
// Prime durations keep the wisps from ever fully syncing.
const WISPS = [
  {
    w: 480, h: 300, blur: 28,
    color: 'rgba(175,185,195,',   // cool blue-grey
    x: [-18, 14, -22, 8, -18],
    y: [-10, 18, -14, 22, -10],
    scale: [1.0,  1.15, 0.88, 1.12, 1.0],
    opacity: [0.35, 0.50, 0.28, 0.45, 0.35],
    duration: 9,  delay: 0,
  },
  {
    w: 360, h: 240, blur: 20,
    color: 'rgba(155,165,175,',   // slightly cooler
    x: [12, -20, 8, -16, 12],
    y: [16, -8,  20, -12, 16],
    scale: [0.90, 1.20, 0.85, 1.05, 0.90],
    opacity: [0.28, 0.18, 0.38, 0.22, 0.28],
    duration: 13, delay: 1.8,
  },
  {
    w: 560, h: 200, blur: 36,
    color: 'rgba(190,195,205,',   // lightest, most diffuse
    x: [-8,  20, -16, 24, -8],
    y: [20, -14,  18, -10, 20],
    scale: [1.10, 0.82, 1.22, 0.94, 1.10],
    opacity: [0.22, 0.38, 0.18, 0.32, 0.22],
    duration: 11, delay: 3.2,
  },
  {
    w: 300, h: 340, blur: 18,
    color: 'rgba(200,195,185,',   // warm grey — hint of lantern, not full amber
    x: [22, -12, 18, -20, 22],
    y: [-14, 10, -18,  8, -14],
    scale: [0.85, 1.10, 0.95, 0.88, 0.85],
    opacity: [0.25, 0.40, 0.20, 0.35, 0.25],
    duration: 7,  delay: 5.0,
  },
]

interface Props {
  scrollYProgress: MotionValue<number>
}

export function FogWisps({ scrollYProgress }: Props) {
  // Fade from fully visible at scroll=0 to gone at scroll=0.6
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.7, 0])

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: '50%', top: '42%', opacity, zIndex: 8 }}
    >
      {WISPS.map((w, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width:  w.w,
            height: w.h,
            // Negative margins center each wisp at the parent's anchor point
            marginLeft: -w.w / 2,
            marginTop:  -w.h / 2,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center,
              ${w.color}0.90) 0%,
              ${w.color}0.40) 50%,
              transparent 75%)`,
            filter: `blur(${w.blur}px)`,
          }}
          animate={{
            x:       w.x,
            y:       w.y,
            scale:   w.scale,
            opacity: w.opacity,
          }}
          transition={{
            duration: w.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: w.delay,
          }}
        />
      ))}
    </motion.div>
  )
}
