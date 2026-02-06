import './globals.css'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'Creator Toolkit YouTube - Tools for YouTube Success',
  description: 'Free tools to help you create better YouTube content. Generate titles, hooks, thumbnails, SEO optimization, and more.',
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
