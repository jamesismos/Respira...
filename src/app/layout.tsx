import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import MilestoneToast from '@/components/MilestoneToast'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Respira',
  description: 'Uma vontade de cada vez. App local para parar de fumar.',
  manifest: '/manifest.json',
  applicationName: 'Respira',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Respira',
  },
  icons: {
    icon: '/icons/respira_app_icon.png',
    apple: '/icons/respira_app_icon.png',
  },
  keywords: ['parar de fumar', 'saúde', 'cigarro', 'respiração'],
}

export const viewport: Viewport = {
  themeColor: '#07111A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/respira_app_icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-[#07111A] text-[#F8FAFC] font-sans antialiased min-h-screen">
        <MilestoneToast />
        {children}
      </body>
    </html>
  )
}
