'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { loadAppData, getStorageError, recordRelapse } from '@/lib/storage'
import {
  calculateSmokeFreeSeconds,
  formatSmokeFreeTime,
  calculateMoneySaved,
  calculateCigarettesAvoided,
  formatCurrency,
} from '@/lib/stats'
import { getBestStreakDays } from '@/lib/storage'
import type { UserProfile, RelapseLog, CravingLog } from '@/types'
import StatCard from '@/components/StatCard'
import SOSButton from '@/components/SOSButton'
import BottomNav from '@/components/BottomNav'
import RelapseModal from '@/components/RelapseModal'
import { Clock, DollarSign, CigaretteOff, BookOpen, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [smokeFreeTime, setSmokeFreeTime] = useState({ days: 0, hours: 0, minutes: 0, secs: 0, label: '' })
  const [moneySaved, setMoneySaved] = useState(0)
  const [cigarettesAvoided, setCigarettesAvoided] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [showRelapseModal, setShowRelapseModal] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [greeting, setGreeting] = useState('')

  const refreshStats = useCallback(() => {
    const data = loadAppData()
    if (!data.profile) return
    const p = data.profile
    setProfile(p)
    const secs = calculateSmokeFreeSeconds(p.lastSmoked)
    setSmokeFreeTime(formatSmokeFreeTime(secs))
    setMoneySaved(calculateMoneySaved(p, secs))
    setCigarettesAvoided(calculateCigarettesAvoided(p, secs))
    setBestStreak(getBestStreakDays())
  }, [])

  useEffect(() => {
    const data = loadAppData()
    if (!data.settings.hasCompletedOnboarding || !data.profile) {
      router.replace('/onboarding')
      return
    }
    refreshStats()

    // Live counter
    const interval = setInterval(refreshStats, 1000)
    return () => clearInterval(interval)
  }, [router, refreshStats])

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Bom dia')
    else if (hour < 18) setGreeting('Boa tarde')
    else setGreeting('Boa noite')
  }, [])

  function handleRelapse(formData: {
    whatHappened: string
    mood: string
    where: string
    wasAutomatic: boolean
    whatCouldHelp: string
  }): boolean {
    if (!profile) return false
    setSaveError(null)
    const nowIso = new Date().toISOString()
    const currentSecs = calculateSmokeFreeSeconds(profile.lastSmoked)
    const currentDays = Math.floor(currentSecs / 86400)
    const currentHours = Math.floor((currentSecs % 86400) / 3600)

    const log: RelapseLog = {
      id: 'relapse-' + Date.now(),
      timestamp: nowIso,
      previousStreakDays: currentDays,
      previousStreakHours: currentHours,
      ...formData,
    }

    let mappedTrigger = 'outro'
    if (formData.where === 'trabalho') mappedTrigger = 'trabalho'
    else if (formData.where === 'social') mappedTrigger = 'social'
    else if (formData.where === 'bar') mappedTrigger = 'alcool'
    else if (formData.where === 'carro') mappedTrigger = 'dirigindo'

    const diaryEntry: CravingLog = {
      id: 'craving-relapse-' + Date.now(),
      timestamp: nowIso,
      trigger: mappedTrigger,
      intensity: 5,
      resisted: false,
      mood: formData.mood,
      notes: formData.whatHappened + (formData.whatCouldHelp ? '\n\nO que pode ajudar na próxima vez: ' + formData.whatCouldHelp : ''),
    }

    if (!recordRelapse(log, diaryEntry)) {
      setSaveError(getStorageError() || 'Não foi possível salvar a recaída. Seus dados não foram confirmados como salvos.')
      return false
    }

    setShowRelapseModal(false)
    refreshStats()
    return true
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-[#07111A] flex flex-col pb-safe mb-nav">
      <div className="max-w-md mx-auto w-full px-5 pt-10 flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between animate-float-up">
          <div>
            <p className="text-[#A7B4C2] text-sm">{greeting} 👋</p>
            <h1 className="text-2xl font-bold gradient-text">Respira.</h1>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/respira_app_icon.png"
            alt="Respira"
            className="w-10 h-10 rounded-2xl opacity-80"
          />
        </div>

        {/* ── TEMPO SEM FUMAR — destaque máximo ── */}
        <div
          className="glass-card p-6 flex flex-col items-center gap-2 animate-glow animate-float-up border-[rgba(56,189,248,0.25)]"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex items-center gap-2 text-[#A7B4C2] text-xs font-medium uppercase tracking-widest">
            <Clock size={14} className="text-[#38BDF8]" />
            Tempo sem fumar
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            {smokeFreeTime.days > 0 && (
              <div className="text-center">
                <span className="text-5xl font-black gradient-text tabular-nums">{smokeFreeTime.days}</span>
                <p className="text-[#A7B4C2] text-xs mt-0.5">dias</p>
              </div>
            )}
            <div className="text-center">
              <span className={`font-black gradient-text tabular-nums ${smokeFreeTime.days > 0 ? 'text-3xl' : 'text-5xl'}`}>
                {String(smokeFreeTime.hours).padStart(2, '0')}
              </span>
              <p className="text-[#A7B4C2] text-xs mt-0.5">horas</p>
            </div>
            <span className="text-[#38BDF8] text-2xl font-light">:</span>
            <div className="text-center">
              <span className={`font-black gradient-text tabular-nums ${smokeFreeTime.days > 0 ? 'text-3xl' : 'text-5xl'}`}>
                {String(smokeFreeTime.minutes).padStart(2, '0')}
              </span>
              <p className="text-[#A7B4C2] text-xs mt-0.5">min</p>
            </div>
            <span className="text-[#38BDF8] text-2xl font-light">:</span>
            <div className="text-center">
              <span className={`font-black text-[#F8FAFC]/60 tabular-nums ${smokeFreeTime.days > 0 ? 'text-2xl' : 'text-4xl'}`}>
                {String(smokeFreeTime.secs).padStart(2, '0')}
              </span>
              <p className="text-[#A7B4C2] text-xs mt-0.5">seg</p>
            </div>
          </div>
          {profile.quitReason && (
            <p className="text-[#A7B4C2] text-xs text-center mt-1 italic">
              Motivo: {profile.quitReason}
            </p>
          )}
        </div>

        {/* ── SOS BUTTON — protagonista ── */}
        <div className="flex flex-col items-center gap-3 py-2 animate-float-up" style={{ animationDelay: '0.15s' }}>
          <SOSButton size="xl" />
          <p className="text-[#A7B4C2] text-sm">Bateu vontade? Toca aqui.</p>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 gap-3 animate-float-up" style={{ animationDelay: '0.2s' }}>
          <StatCard
            label="Economizado"
            value={formatCurrency(moneySaved)}
            icon={<DollarSign size={16} />}
            highlight
          />
          <StatCard
            label="Cigarros evitados"
            value={String(cigarettesAvoided)}
            sub={cigarettesAvoided > 0 ? `${Math.floor(cigarettesAvoided / (profile.cigarettesPerPack || 20))} maços` : 'contando...'}
            icon={<CigaretteOff size={16} />}
          />
        </div>

        {/* Melhor sequência */}
        {bestStreak > 0 && (
          <div className="glass-card p-4 flex items-center gap-3 animate-float-up" style={{ animationDelay: '0.25s' }}>
            <TrendingUp size={18} className="text-[#FBBF24] shrink-0" />
            <div>
              <p className="text-[#A7B4C2] text-xs">Melhor sequência</p>
              <p className="text-[#F8FAFC] font-semibold text-sm">{bestStreak} dias</p>
            </div>
          </div>
        )}

        {/* ── AÇÕES RÁPIDAS ── */}
        <div className="flex flex-col gap-2 animate-float-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-[#A7B4C2] text-xs font-medium uppercase tracking-wide">Ações rápidas</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-log-craving"
              onClick={() => router.push('/sos')}
              className="py-3.5 px-4 rounded-xl bg-[#0F1B24] border border-[rgba(56,189,248,0.15)] text-[#F8FAFC] text-sm font-medium text-left flex items-center gap-2 active:bg-[#162230] transition-colors"
            >
              💨 Estou com vontade
            </button>
            <button
              id="btn-report-relapse"
              onClick={() => { setSaveError(null); setShowRelapseModal(true) }}
              className="py-3.5 px-4 rounded-xl bg-[#0F1B24] border border-[rgba(251,113,133,0.15)] text-[#FB7185] text-sm font-medium text-left flex items-center gap-2 active:bg-[#1a1520] transition-colors"
            >
              🌿 Fumei agora
            </button>
            <Link
              href="/triggers"
              id="btn-log-trigger"
              className="py-3.5 px-4 rounded-xl bg-[#0F1B24] border border-[rgba(56,189,248,0.15)] text-[#F8FAFC] text-sm font-medium text-left flex items-center gap-2 active:bg-[#162230] transition-colors"
            >
              <BookOpen size={15} className="text-[#38BDF8]" /> Registrar gatilho
            </Link>
            <Link
              href="/progress"
              id="btn-see-progress"
              className="py-3.5 px-4 rounded-xl bg-[#0F1B24] border border-[rgba(52,211,153,0.15)] text-[#F8FAFC] text-sm font-medium text-left flex items-center gap-2 active:bg-[#0f1a14] transition-colors"
            >
              <TrendingUp size={15} className="text-[#34D399]" /> Ver progresso
            </Link>
          </div>
        </div>

        {/* Saúde disclaimer */}
        <p className="text-[#64748B] text-xs text-center pb-2">
          Melhorias comuns após parar de fumar variam por pessoa. Consulte um profissional de saúde.
        </p>
      </div>

      {/* Relapse modal overlay */}
      {showRelapseModal && profile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0F1B24] rounded-3xl w-full max-w-md p-6 border border-[rgba(56,189,248,0.15)] max-h-[85vh] overflow-y-auto">
            {saveError && <p role="alert" className="mb-4 rounded-xl border border-[#FB7185]/30 bg-[#FB7185]/10 p-3 text-sm text-[#FDA4AF]">{saveError}</p>}
            <RelapseModal
              currentStreakDays={smokeFreeTime.days}
              currentStreakHours={smokeFreeTime.hours}
              onConfirm={handleRelapse}
              onCancel={() => setShowRelapseModal(false)}
            />
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
