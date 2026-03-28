import './globals.css'
import type { Metadata } from 'next'
import ClientLayout from '@/components/ClientLayout'

export const metadata: Metadata = {
  title: 'FC ESCUELA',
  description: 'Official FC Escuela Digital Portal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 font-sans selection:bg-yellow-500/30 selection:text-yellow-200">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
