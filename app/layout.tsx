import type { Metadata } from 'next'
import { Geist_Mono, Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { portfolio } from '@/lib/portfolio'

const jetbrainsMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })
const syne = Syne({ subsets: ['latin'], variable: '--font-serif', weight: ['400', '600', '700', '800'] })

export const metadata: Metadata = {
  title: `${portfolio.identity.fullName} | Portfolio`,
  description: `Personal portfolio of ${portfolio.identity.fullName} — ${portfolio.identity.roles[0]}`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${syne.variable} bg-background`}>
      <body className="font-mono antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
