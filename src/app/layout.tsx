import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

/**
 * metadataBase sets the base URL for all metadata across the app.
 * Open Graph tags and other metadata that use relative URLs will
 * automatically resolve against this base URL.
 *
 * Priority: NEXT_PUBLIC_APP_URL (custom domain) > VERCEL_URL (auto-set by Vercel) > localhost
 */
function getBaseUrl(): URL {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return new URL(process.env.NEXT_PUBLIC_APP_URL)
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`)
  }
  return new URL('http://localhost:3000')
}

export const metadata: Metadata = {
  metadataBase: getBaseUrl(),
  title: 'Invoice - 견적서 관리 시스템',
  description:
    'Notion 기반 견적서 관리 시스템. 공유 링크를 통해 견적서를 조회하세요.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
