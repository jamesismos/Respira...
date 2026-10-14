import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Respira — Projeto encerrado',
  description:
    'O projeto Respira foi descontinuado. Esta página registra o encerramento do desenvolvimento.',
  icons: {
    icon: '/icons/respira_app_icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#07111A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="bg-[#07111A] text-[#F8FAFC] font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
