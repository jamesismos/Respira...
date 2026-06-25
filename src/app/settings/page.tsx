'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loadAppData, saveProfile, clearAppData } from '@/lib/storage'
import type { UserProfile } from '@/types'
import { quitReasons } from '@/data/triggers'
import BottomNav from '@/components/BottomNav'
import BackupControls from '@/components/BackupControls'
import { Settings, Heart, AlertTriangle, ChevronRight, User } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Edit form state
  const [cigs, setCigs] = useState('')
  const [price, setPrice] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    const data = loadAppData()
    if (data.profile) {
      setProfile(data.profile)
      setCigs(String(data.profile.cigarettesPerDay))
      setPrice(String(data.profile.packPrice))
      setReason(data.profile.quitReason)
    }
  }, [])

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    const updated: UserProfile = {
      ...profile,
      cigarettesPerDay: Number(cigs),
      packPrice: Number(price),
      quitReason: reason,
    }
    saveProfile(updated)
    setProfile(updated)
    setIsEditing(false)
  }

  function handleClearData() {
    clearAppData()
    router.replace('/onboarding')
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-[#07111A] flex flex-col pb-safe mb-nav">
      <div className="max-w-md mx-auto w-full px-5 pt-10 flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-[#38BDF8]" />
          <h1 className="text-xl font-bold text-[#F8FAFC]">Configurações</h1>
        </div>

        {/* ── DADOS DO PERFIL ── */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-[rgba(56,189,248,0.15)] flex justify-between items-center bg-[#162230]/50">
            <div className="flex items-center gap-2 text-[#F8FAFC] font-medium">
              <User size={16} className="text-[#38BDF8]" />
              Meus dados
            </div>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="text-[#38BDF8] text-sm font-medium">
                Editar
              </button>
            ) : (
              <button onClick={() => setIsEditing(false)} className="text-[#A7B4C2] text-sm">
                Cancelar
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="p-4 flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-[#A7B4C2] text-sm">Cigarros por dia</span>
                <span className="text-[#F8FAFC] font-medium">{profile.cigarettesPerDay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A7B4C2] text-sm">Preço do maço</span>
                <span className="text-[#F8FAFC] font-medium">R$ {profile.packPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A7B4C2] text-sm">Cigarros no maço</span>
                <span className="text-[#F8FAFC] font-medium">{profile.cigarettesPerPack}</span>
              </div>
              <div className="flex flex-col mt-1">
                <span className="text-[#A7B4C2] text-sm mb-1">Motivo principal</span>
                <span className="text-[#F8FAFC] font-medium text-sm p-3 rounded-lg bg-[#162230]">
                  {profile.quitReason || 'Nenhum motivo definido'}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="p-4 flex flex-col gap-4">
              <div>
                <label className="block text-[#A7B4C2] text-sm mb-1">Cigarros por dia</label>
                <input
                  type="number"
                  value={cigs}
                  onChange={e => setCigs(e.target.value)}
                  className="w-full bg-[#07111A] border border-[rgba(56,189,248,0.3)] rounded-lg px-3 py-2 text-[#F8FAFC]"
                />
              </div>
              <div>
                <label className="block text-[#A7B4C2] text-sm mb-1">Preço do maço (R$)</label>
                <input
                  type="number"
                  step="0.5"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full bg-[#07111A] border border-[rgba(56,189,248,0.3)] rounded-lg px-3 py-2 text-[#F8FAFC]"
                />
              </div>
              <div>
                <label className="block text-[#A7B4C2] text-sm mb-1">Motivo principal</label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full bg-[#07111A] border border-[rgba(56,189,248,0.3)] rounded-lg px-3 py-2 text-[#F8FAFC]"
                >
                  <option value="">Selecione...</option>
                  {quitReasons.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white font-semibold mt-2">
                Salvar alterações
              </button>
            </form>
          )}
        </div>

        {/* ── BACKUP E DADOS ── */}
        <div>
          <h2 className="text-[#A7B4C2] text-xs font-medium uppercase tracking-wide mb-3 pl-1">Backup local</h2>
          <BackupControls />
        </div>

        {/* ── SOBRE O RESPIRA E DOAÇÃO ── */}
        <div className="flex flex-col gap-3 mt-4">
          <Link
            href="/settings/donate"
            className="glass-card p-4 flex items-center justify-between border-[rgba(52,211,153,0.15)] hover:bg-[rgba(52,211,153,0.05)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Heart size={18} className="text-[#34D399]" />
              <span className="text-[#F8FAFC] font-medium text-sm">Apoie o projeto</span>
            </div>
            <ChevronRight size={16} className="text-[#A7B4C2]" />
          </Link>
          
          <a
            href="https://github.com/jamesismos/Respira"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-[#64748B] text-xs underline underline-offset-4 pt-2 pb-4"
          >
            Código aberto no GitHub (v1.0.0)
          </a>
        </div>

        {/* ── APAGAR DADOS (DANGER ZONE) ── */}
        <div className="mt-8 mb-4">
          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-3 text-[#FB7185] text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
            >
              Apagar todos os meus dados
            </button>
          ) : (
            <div className="glass-card p-4 border-[rgba(251,113,133,0.3)] bg-[rgba(251,113,133,0.05)] flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#FB7185] font-semibold">
                <AlertTriangle size={18} />
                Tem certeza absoluta?
              </div>
              <p className="text-[#A7B4C2] text-xs leading-relaxed">
                Isso vai apagar todo o seu histórico, dias sem fumar e gatilhos deste dispositivo. Essa ação não pode ser desfeita.
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[rgba(56,189,248,0.2)] text-[#F8FAFC] text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleClearData}
                  className="flex-1 py-2.5 rounded-lg bg-[#FB7185] text-white font-medium text-sm"
                >
                  Sim, apagar tudo
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
      <BottomNav />
    </div>
  )
}
