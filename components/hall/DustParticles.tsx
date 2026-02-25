'use client'

// Deterministic "random" values — no hydration mismatch
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  top: 20 + ((i * 37) % 60),
  left: 10 + ((i * 53) % 80),
  size: 1 + (i % 3),
  duration: 10 + ((i * 7) % 12),
  delay: (i * 4) % 8,
}))

export function DustParticles() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 20, transform: 'translateZ(0)' }}
    >
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            backgroundColor: 'rgba(245, 200, 66, 0.4)',
            animation: `dust-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  )
}
