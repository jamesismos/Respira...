'use client'

import { useEffect, useState, useCallback } from 'react'
import { loadAppData, getBestStreakDays } from '@/lib/storage'
import {
  calculateSmokeFreeSeconds,
  calculateMoneySaved,
  calculateCigarettesAvoided,
  formatCurrency,
  formatSmokeFreeTime,
} from '@/lib/stats'
import type { UserProfile, CravingLog } from '@/types'
import { defaultTriggers } from '@/data/triggers'
import { localDateKey } from '@/lib/dates'
import BottomNav from '@/components/BottomNav'
import StatCard from '@/components/StatCard'
import { BarChart2, Trophy, TrendingUp, Zap, Target } from 'lucide-react'

export default function ProgressPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState({
    days: 0, hours: 0,
    moneySaved: 0,
    cigarettesAvoided: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalCravings: 0,
    totalResisted: 0,
  })
  const [topTriggers, setTopTriggers] = useState<{ id: string; label: string; emoji: string; count: number }[]>([])
  const [last14Days, setLast14Days] = useState<{ label: string; resisted: number; relapsed: number }[]>([])

  const refresh = useCallback(() => {
    const data = loadAppData()
    if (!data.profile) return
    const p = data.profile
    setProfile(p)

    const secs = calculateSmokeFreeSeconds(p.lastSmoked)
    const time = formatSmokeFreeTime(secs)
    const best = getBestStreakDays()

    setStats({
      days: time.days,
      hours: time.hours,
      moneySaved: calculateMoneySaved(p, secs),
      cigarettesAvoided: calculateCigarettesAvoided(p, secs),
      currentStreak: Math.floor(secs / 86400),
      bestStreak: Math.max(best, Math.floor(secs / 86400)),
      totalCravings: data.cravingLogs.length,
      totalResisted: data.cravingLogs.filter(l => l.resisted).length,
    })

    // Top triggers
    const triggerCount: Record<string, number> = {}
    data.cravingLogs.forEach((l: CravingLog) => {
      triggerCount[l.trigger] = (triggerCount[l.trigger] || 0) + 1
    })
    const sorted = Object.entries(triggerCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => {
        const t = defaultTriggers.find(x => x.id === id)
        return { id, label: t?.label ?? id, emoji: t?.emoji ?? '💭', count }
      })
    setTopTriggers(sorted)

    // Last 14 days chart
    const days14: { label: string; resisted: number; relapsed: number }[] = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = localDateKey(d)
      const dayLogs = data.cravingLogs.filter((l: CravingLog) => localDateKey(new Date(l.timestamp)) === key)
      days14.push({
        label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        resisted: dayLogs.filter((l: CravingLog) => l.resisted).length,
        relapsed: dayLogs.filter((l: CravingLog) => !l.resisted).length,
      })
    }
    setLast14Days(days14)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  if (!profile) return null

  const maxBar = Math.max(...last14Days.map(d => d.resisted + d.relapsed), 1)

  return (
    <div className="min-h-screen bg-[#07111A] flex flex-col pb-safe mb-nav">
      <div className="max-w-md mx-auto w-full px-5 pt-10 flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center gap-2">
          <BarChart2 size={20} className="text-[#38BDF8]" />
          <h1 className="text-xl font-bold text-[#F8FAFC]">Progresso</h1>
        </div>

        {/* Sequência */}
        <div className="glass-card p-5 flex justify-between items-center border-[rgba(56,189,248,0.25)]">
          <div>
            <p className="text-[#A7B4C2] text-xs font-medium uppercase tracking-wide">Sequência atual</p>
            <p className="text-4xl font-black gradient-text">{stats.currentStreak}</p>
            <p className="text-[#A7B4C2] text-xs">dias consecutivos</p>
          </div>
          <div className="w-px h-12 bg-[rgba(56,189,248,0.15)]" />
          <div className="text-right">
            <p className="text-[#A7B4C2] text-xs font-medium uppercase tracking-wide flex items-center justify-end gap-1">
              <Trophy size={12} className="text-[#FBBF24]" /> Melhor
            </p>
            <p className="text-3xl font-black text-[#FBBF24]">{stats.bestStreak}</p>
            <p className="text-[#A7B4C2] text-xs">dias</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Economizado"
            value={formatCurrency(stats.moneySaved)}
            highlight
            icon={<TrendingUp size={16} />}
          />
          <StatCard
            label="Cigarros evitados"
            value={String(stats.cigarettesAvoided)}
            sub={`${Math.floor(stats.cigarettesAvoided / (profile.cigarettesPerPack || 20))} maços`}
          />
          <StatCard
            label="Vontades resistidas"
            value={String(stats.totalResisted)}
            sub={`de ${stats.totalCravings} registradas`}
            icon={<Zap size={16} />}
          />
          <StatCard
            label="Taxa de resistência"
            value={stats.totalCravings > 0 ? `${Math.round((stats.totalResisted / stats.totalCravings) * 100)}%` : '--'}
            sub="das vontades registradas"
          />
        </div>

        {/* Gráfico últimos 14 dias */}
        {last14Days.some(d => d.resisted + d.relapsed > 0) && (
          <div className="glass-card p-5">
            <p className="text-[#A7B4C2] text-xs font-medium uppercase tracking-wide mb-4">Últimos 14 dias</p>
            <div className="flex items-end gap-1 h-20">
              {last14Days.map((d, i) => {
                const total = d.resisted + d.relapsed
                const h = total > 0 ? Math.max(6, (total / maxBar) * 72) : 4
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-sm transition-all ${
                        d.relapsed > 0
                          ? 'bg-[#FB7185]/60'
                          : total > 0
                          ? 'bg-gradient-to-t from-[#38BDF8] to-[#34D399]'
                          : 'bg-[#162230]'
                      }`}
                      style={{ height: `${h}px` }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[#64748B] text-[10px]">{last14Days[0]?.label}</p>
              <p className="text-[#64748B] text-[10px]">{last14Days[13]?.label}</p>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399]" />
                <span className="text-[#A7B4C2] text-xs">Resistiu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#FB7185]/60" />
                <span className="text-[#A7B4C2] text-xs">Fumou</span>
              </div>
            </div>
          </div>
        )}

        {/* Top gatilhos */}
        {topTriggers.length > 0 && (
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target size={16} className="text-[#FBBF24]" />
              <p className="text-[#A7B4C2] text-xs font-medium uppercase tracking-wide">Gatilhos mais frequentes</p>
            </div>
            <div className="flex flex-col gap-2.5">
              {topTriggers.map(t => (
                <div key={t.id} className="flex items-center gap-3">
                  <span className="text-lg">{t.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <p className="text-[#F8FAFC] text-sm">{t.label}</p>
                      <p className="text-[#A7B4C2] text-xs">{t.count}x</p>
                    </div>
                    <div className="h-1.5 bg-[#162230] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#38BDF8] to-[#34D399] rounded-full transition-all"
                        style={{ width: `${(t.count / topTriggers[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saúde — linguagem conservadora, como especificado */}
        <div className="glass-card p-4 border-[rgba(52,211,153,0.15)]">
          <p className="text-[#A7B4C2] text-xs font-medium uppercase tracking-wide mb-2">
            Melhorias comuns após parar de fumar
          </p>
          <p className="text-[#64748B] text-xs leading-relaxed">
            Resultados variam de pessoa para pessoa. Consulte um profissional de saúde para acompanhamento individualizado.
          </p>
        </div>

      </div>
      <BottomNav />
    </div>
  )
}
