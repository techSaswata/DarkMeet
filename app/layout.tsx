import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DarkMeet - Next-Gen Video Conferencing',
  description: 'Experience the future of video conferencing with AI-powered features, stunning dark UI, and seamless collaboration tools.',
  icons: {
    icon: '/icon.png',
  },
  keywords: ['video conferencing', 'AI', 'collaboration', 'dark theme', 'meetings'],
  authors: [{ name: 'DarkMeet Team' }],
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'DarkMeet - Next-Gen Video Conferencing',
    description: 'Experience the future of video conferencing with AI-powered features',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DarkMeet - Next-Gen Video Conferencing',
    description: 'Experience the future of video conferencing with AI-powered features',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen bg-black">
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(20px)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#000',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#000',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
} 