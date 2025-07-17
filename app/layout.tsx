import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Foxy Gateway',
  description: 'All in One Payment Gateway',
  generator: 'me',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
