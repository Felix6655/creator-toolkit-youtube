import './globals.css'
import { Toaster } from 'sonner'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://creator-toolkit-youtube.vercel.app'

export const metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Creator Toolkit YouTube - Free Tools for YouTube Success',
    template: '%s | Creator Toolkit YouTube',
  },
  description: 'Free professional tools for YouTube creators. Generate click-worthy titles, script outlines, thumbnail briefs, SEO optimization, and upload checklists. No AI keys required.',
  keywords: [
    'YouTube tools',
    'YouTube title generator',
    'YouTube SEO',
    'video script outline',
    'thumbnail ideas',
    'YouTube creator tools',
    'content creator toolkit',
    'YouTube growth',
    'video marketing',
    'YouTube optimization',
  ],
  authors: [{ name: 'Creator Toolkit YouTube' }],
  creator: 'Creator Toolkit YouTube',
  publisher: 'Creator Toolkit YouTube',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'Creator Toolkit YouTube',
    title: 'Creator Toolkit YouTube - Free Tools for YouTube Success',
    description: 'Free professional tools for YouTube creators. Generate titles, scripts, thumbnails, SEO optimization, and more. No AI keys required.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Creator Toolkit YouTube - Free Tools for YouTube Success',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creator Toolkit YouTube - Free Tools for YouTube Success',
    description: 'Free professional tools for YouTube creators. Generate titles, scripts, thumbnails, and SEO optimization.',
    images: ['/og.png'],
    creator: '@creatortoolkit',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: APP_URL,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
