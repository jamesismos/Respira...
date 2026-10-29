import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import NotificationScheduler from '@/components/NotificationScheduler'
import StorageRecoveryGuard from '@/components/StorageRecoveryGuard'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://respira-nine.vercel.app'),
  applicationName: 'Respira',
  title: {
    default: 'Respira — Uma vontade de cada vez',
    template: '%s | Respira',
  },
  description:
    'Um app gratuito, local e privado para apoiar quem quer parar de fumar, registrar gatilhos e acompanhar o progresso sem culpa.',
  openGraph: {
    type: 'website',
    url: 'https://respira-nine.vercel.app',
    locale: 'pt_BR',
    siteName: 'Respira',
    title: 'Respira — Uma vontade de cada vez',
    description: 'Apoio prático para atravessar a vontade de fumar, acompanhar seu progresso e aprender com os gatilhos. Sem conta e sem coleta de dados.',
  },
  twitter: {
    card: 'summary',
    title: 'Respira — Uma vontade de cada vez',
    description: 'Um app gratuito e privado para apoiar quem quer parar de fumar, sem culpa e sem coleta de dados.',
  },
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
        <StorageRecoveryGuard />
        <NotificationScheduler />
        {children}
      </body>
    </html>
  )
}
