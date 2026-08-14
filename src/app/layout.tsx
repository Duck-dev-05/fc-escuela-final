import './globals.css'
import type { Metadata } from 'next'
import ClientLayout from '@/components/ClientLayout'

export const metadata: Metadata = {
  title: 'FC Escuela',
  description: 'Official FC Escuela Digital Portal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#020617] font-sans antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
