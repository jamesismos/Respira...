import clsx from 'clsx'
import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  icon?: ReactNode
  highlight?: boolean
  className?: string
}

export default function StatCard({ label, value, sub, icon, highlight, className }: StatCardProps) {
  return (
    <div
      className={clsx(
        'glass-card p-4 flex flex-col gap-1 transition-transform duration-200 active:scale-[0.98]',
        highlight && 'border-[rgba(56,189,248,0.3)] bg-[rgba(56,189,248,0.05)]',
        className
      )}
    >
      {icon && (
        <div className="text-[#38BDF8] mb-1">{icon}</div>
      )}
      <p className="text-[#A7B4C2] text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className={clsx('text-2xl font-bold leading-tight', highlight ? 'gradient-text' : 'text-[#F8FAFC]')}>
        {value}
      </p>
      {sub && <p className="text-[#A7B4C2] text-xs">{sub}</p>}
    </div>
  )
}
