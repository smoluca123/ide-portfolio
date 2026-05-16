import type { Metadata } from 'next'
import { Geist_Mono, Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const jetbrainsMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })
const syne = Syne({ subsets: ['latin'], variable: '--font-serif', weight: ['400', '600', '700', '800'] })

export const metadata: Metadata = {
  title: 'Aahana Bobade | Portfolio',
  description: 'Personal portfolio of Aahana Bobade — Software Developer & AI Engineer',
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
