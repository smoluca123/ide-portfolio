import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { baseMetadata, buildJsonLd } from '@/lib/seo'
import { Toaster } from '@/components/ui/sonner'

const jetbrainsMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = baseMetadata

export const viewport: Viewport = {
  themeColor: '#1E1E1E',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${syne.variable} bg-background`}>
      <body className="font-mono antialiased">
        <script
          type="application/ld+json"
          // JSON-LD is static, server-rendered structured data — safe to inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
        />
        {children}
        <Toaster position="bottom-right" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
