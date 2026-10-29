import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import NotificationScheduler from '@/components/NotificationScheduler'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  applicationName: 'Respira',
  title: {
    default: 'Respira — Uma vontade de cada vez',
    template: '%s | Respira',
  },
  description:
    'Um app local e privado para apoiar quem quer parar de fumar, sem culpa, sem conta e sem coleta de dados.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/respira_app_icon.png',
    apple: '/icons/respira_app_icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Respira',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#07111A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="bg-[#07111A] text-[#F8FAFC] font-sans antialiased min-h-screen">
        <NotificationScheduler />
        {children}
      </body>
    </html>
  )
}
