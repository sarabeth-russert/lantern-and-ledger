import { cn } from '@/lib/utils'

interface ParchmentCardProps {
  children: React.ReactNode
  className?: string
  accent?: string
}

// Dark adventurer panel — the "parchment" is now aged dark wood / leather
export function ParchmentCard({ children, className, accent }: ParchmentCardProps) {
  return (
    <div
      className={cn('rounded-2xl overflow-hidden flex flex-col', className)}
      style={{
        backgroundColor: 'rgba(10, 7, 4, 0.72)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: `1px solid rgba(242,232,213,0.09)`,
        boxShadow: '0 8px 40px rgba(0,0,0,0.60)',
        borderLeft: accent ? `2px solid ${accent}70` : undefined,
      }}
    >
      {children}
    </div>
  )
}
