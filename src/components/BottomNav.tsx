'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Heart, BookOpen, BarChart2, Settings } from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { href: '/home', icon: Home, label: 'Início' },
  { href: '/sos', icon: Heart, label: 'SOS' },
  { href: '/triggers', icon: BookOpen, label: 'Diário' },
  { href: '/progress', icon: BarChart2, label: 'Progresso' },
  { href: '/settings', icon: Settings, label: 'Config' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-auto max-w-md bg-[#0F1B24]/95 backdrop-blur-xl border-t border-[rgba(56,189,248,0.15)]">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            const isSOS = href === '/sos'

            return (
              <Link
                key={href}
                href={href}
                id={`nav-${label.toLowerCase()}`}
                className={clsx(
                  'flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200',
                  isSOS
                    ? 'bg-gradient-to-br from-[#38BDF8] to-[#34D399] text-white px-4 py-2 -mt-4 shadow-lg shadow-[#38BDF8]/30'
                    : isActive
                    ? 'text-[#38BDF8]'
                    : 'text-[#A7B4C2]'
                )}
              >
                <Icon
                  size={isSOS ? 22 : 20}
                  strokeWidth={isActive || isSOS ? 2.5 : 1.8}
                />
                <span className={clsx('text-[10px] font-medium', isSOS && 'text-white')}>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
