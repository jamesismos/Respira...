'use client'

import { useEffect, useState, useCallback } from 'react'
import { loadAppData, saveSettings } from '@/lib/storage'
import { calculateSmokeFreeSeconds, calculateMoneySaved } from '@/lib/stats'
import { savingsMilestones } from '@/data/milestones'

export default function MilestoneToast() {
  const [visible, setVisible] = useState(false)
  const [milestone, setMilestone] = useState<{ emoji: string; message: string; amount: number } | null>(null)

  const check = useCallback(() => {
    const data = loadAppData()
    if (!data.profile) return

    const secs = calculateSmokeFreeSeconds(data.profile.lastSmoked)
    const saved = calculateMoneySaved(data.profile, secs)
    const lastNotified = data.settings.lastNotifiedMilestone ?? 0

    const reached = savingsMilestones.filter(m => m.amount <= saved && m.amount > lastNotified)
    if (reached.length === 0) return

    const highest = reached[reached.length - 1]
    setMilestone(highest)
    setVisible(true)
    saveSettings({ ...data.settings, lastNotifiedMilestone: highest.amount })

    setTimeout(() => setVisible(false), 5000)
  }, [])

  useEffect(() => {
    check()
    const interval = setInterval(check, 30000)
    return () => clearInterval(interval)
  }, [check])

  if (!visible || !milestone) return null

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-2.5rem)] max-w-sm animate-slide-in">
      <div className="glass-card p-4 border-[rgba(52,211,153,0.3)] bg-[rgba(52,211,153,0.08)] flex items-center gap-3 shadow-lg shadow-[rgba(52,211,153,0.15)]">
        <span className="text-3xl shrink-0">{milestone.emoji}</span>
        <div className="min-w-0">
          <p className="text-[#34D399] text-xs font-semibold uppercase tracking-wide">Marco atingido!</p>
          <p className="text-[#F8FAFC] text-sm font-medium mt-0.5">{milestone.message}</p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 text-[#A7B4C2] hover:text-[#F8FAFC] text-lg leading-none ml-auto"
          aria-label="Fechar"
        >
          &times;
        </button>
      </div>
    </div>
  )
}
