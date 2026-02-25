export default function RoomLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0d0a' }}>
      <div className="h-px w-full animate-pulse" style={{ backgroundColor: 'rgba(242,232,213,0.08)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-4 w-14 rounded animate-pulse" style={{ backgroundColor: 'rgba(242,232,213,0.06)' }} />
          <div className="h-9 w-44 rounded-xl animate-pulse mx-auto" style={{ backgroundColor: 'rgba(242,232,213,0.06)' }} />
          <div className="w-16 hidden sm:block" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl animate-pulse"
              style={{
                height: i === 0 ? '460px' : '300px',
                backgroundColor: 'rgba(242,232,213,0.04)',
                animationDelay: `${i * 80}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
