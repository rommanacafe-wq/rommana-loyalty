import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _inter = Inter({ subsets: ["latin"] });
const _playfair = Playfair_Display({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

<head>
  <link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#620b0b" />
<link rel="icon" href="/icon-192.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
</head>
export const metadata: Metadata = {
  title: 'Rommana Rewards - Cafe Loyalty Program',
  description: 'Earn points with every purchase at Rommana Cafe. Redeem for free drinks, pastries, and more. Join our loyalty program today!',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-192.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-192.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#6b2c3d',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
