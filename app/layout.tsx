import type { Metadata } from 'next'
import { Lora, Inter, Cinzel_Decorative } from 'next/font/google'
import './globals.css'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cinzel = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cinzel',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lantern & Ledger',
  description: 'Your personal life rooms — organized, warm, and alive.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable} ${cinzel.variable}`}>
      <body
        className="min-h-screen overflow-x-hidden"
        style={{ backgroundColor: '#0f0d0a', color: '#f2e8d5' }}
      >
        {/* Grain overlay — more visible on dark */}
        <div
          className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay"
          style={{
            opacity: 0.06,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
          }}
          aria-hidden
        />
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
