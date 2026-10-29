'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getStorageError, loadAppData, saveProfile, clearAppData } from '@/lib/storage'
import type { UserProfile } from '@/types'
import { defaultTriggers, quitReasons } from '@/data/triggers'
import { formatDateTimeLocal, parseDateTimeLocal } from '@/lib/dates'
import BottomNav from '@/components/BottomNav'
import BackupControls from '@/components/BackupControls'
import NotificationSettings from '@/components/NotificationSettings'
import { Settings, Heart, AlertTriangle, ChevronRight, User, ExternalLink, HeartHandshake } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [cigs, setCigs] = useState('')
  const [price, setPrice] = useState('')
  const [cigsPerPack, setCigsPerPack] = useState('')
  const [lastSmoked, setLastSmoked] = useState('')
  const [reason, setReason] = useState('')
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const [clearError, setClearError] = useState<string | null>(null)

  function populateForm(value: UserProfile) {
    setCigs(String(value.cigarettesPerDay))
    setPrice(String(value.packPrice))
    setCigsPerPack(String(value.cigarettesPerPack))
    setLastSmoked(formatDateTimeLocal(new Date(value.lastSmoked)))
    setReason(value.quitReason)
    setSelectedTriggers(value.triggers || [])
  }

  useEffect(() => {
    const data = loadAppData()
    if (data.profile) {
      setProfile(data.profile)
      populateForm(data.profile)
    }
  }, [])

  function startEditing() {
    if (profile) populateForm(profile)
    setFormError(null)
    setIsEditing(true)
  }

  function toggleTrigger(id: string) {
    setSelectedTriggers(current => current.includes(id)
      ? current.filter(item => item !== id)
      : [...current, id])
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setFormError(null)

    const cigarettesPerDay = Number(cigs)
    const packPrice = Number(price)
    const cigarettesPerPack = Number(cigsPerPack)
    const lastSmokedIso = parseDateTimeLocal(lastSmoked)

    if (!Number.isFinite(cigarettesPerDay) || cigarettesPerDay <= 0 || cigarettesPerDay > 200) {
      setFormError('Informe entre 1 e 200 cigarros por dia.')
      return
    }
    if (!Number.isFinite(packPrice) || packPrice < 0 || packPrice > 10000) {
      setFormError('Informe um preço de maço válido.')
      return
    }
    if (!Number.isFinite(cigarettesPerPack) || cigarettesPerPack <= 0 || cigarettesPerPack > 200) {
      setFormError('Informe uma quantidade válida de cigarros por maço.')
      return
    }
    if (!lastSmokedIso || Date.parse(lastSmokedIso) > Date.now()) {
      setFormError('A data do último cigarro precisa ser válida e não pode estar no futuro.')
      return
    }

    const updated: UserProfile = {
      ...profile,
      cigarettesPerDay,
      packPrice,
      cigarettesPerPack,
      lastSmoked: lastSmokedIso,
      quitReason: reason,
      triggers: selectedTriggers,
    }
    if (!saveProfile(updated)) {
      setFormError(getStorageError() || 'Não foi possível salvar as alterações. Tente novamente.')
      return
    }
    setProfile(updated)
    setIsEditing(false)
  }

  function handleClearData() {
    setClearError(null)
    if (!clearAppData()) {
      setClearError(getStorageError() || 'Não foi possível apagar os dados locais.')
      return
    }
    router.replace('/onboarding')
  }

  if (!profile) return null

  const triggerLabels = profile.triggers.map(id => defaultTriggers.find(trigger => trigger.id === id)?.label || id)

  return (
    <div className="min-h-screen bg-[#07111A] flex flex-col pb-safe mb-nav">
      <div className="max-w-md mx-auto w-full px-5 pt-10 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-[#38BDF8]" />
          <h1 className="text-xl font-bold text-[#F8FAFC]">Configurações</h1>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-[rgba(56,189,248,0.15)] flex justify-between items-center bg-[#162230]/50">
            <div className="flex items-center gap-2 text-[#F8FAFC] font-medium">
              <User size={16} className="text-[#38BDF8]" />
              Meus dados
            </div>
            {!isEditing ? (
              <button type="button" onClick={startEditing} className="text-[#38BDF8] text-sm font-medium">
                Editar perfil
              </button>
            ) : (
              <button type="button" onClick={() => { populateForm(profile); setFormError(null); setIsEditing(false) }} className="text-[#A7B4C2] text-sm">
                Cancelar
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="p-4 flex flex-col gap-3">
              <div className="flex justify-between gap-4">
                <span className="text-[#A7B4C2] text-sm">Cigarros por dia</span>
                <span className="text-[#F8FAFC] font-medium">{profile.cigarettesPerDay}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#A7B4C2] text-sm">Preço do maço</span>
                <span className="text-[#F8FAFC] font-medium">R$ {profile.packPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#A7B4C2] text-sm">Cigarros no maço</span>
                <span className="text-[#F8FAFC] font-medium">{profile.cigarettesPerPack}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#A7B4C2] text-sm">Último cigarro</span>
                <span className="text-right text-[#F8FAFC] text-sm">{new Date(profile.lastSmoked).toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex flex-col mt-1">
                <span className="text-[#A7B4C2] text-sm mb-1">Motivo principal</span>
                <span className="text-[#F8FAFC] font-medium text-sm p-3 rounded-lg bg-[#162230]">
                  {profile.quitReason || 'Nenhum motivo definido'}
                </span>
              </div>
              <div className="flex flex-col mt-1">
                <span className="text-[#A7B4C2] text-sm mb-1">Gatilhos selecionados</span>
                <span className="text-[#F8FAFC] text-sm p-3 rounded-lg bg-[#162230]">
                  {triggerLabels.length ? triggerLabels.join(', ') : 'Nenhum gatilho selecionado'}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="p-4 flex flex-col gap-4">
              <div>
                <label htmlFor="profile-cigarettes-per-day" className="block text-[#A7B4C2] text-sm mb-1">Cigarros por dia</label>
                <input id="profile-cigarettes-per-day" type="number" min="1" max="200" required value={cigs} onChange={e => setCigs(e.target.value)} className="w-full bg-[#07111A] border border-[rgba(56,189,248,0.3)] rounded-lg px-3 py-2 text-[#F8FAFC]" />
              </div>
              <div>
                <label htmlFor="profile-pack-price" className="block text-[#A7B4C2] text-sm mb-1">Preço do maço (R$)</label>
                <input id="profile-pack-price" type="number" min="0" max="10000" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-[#07111A] border border-[rgba(56,189,248,0.3)] rounded-lg px-3 py-2 text-[#F8FAFC]" />
              </div>
              <div>
                <label htmlFor="profile-cigarettes-per-pack" className="block text-[#A7B4C2] text-sm mb-1">Cigarros por maço</label>
                <input id="profile-cigarettes-per-pack" type="number" min="1" max="200" required value={cigsPerPack} onChange={e => setCigsPerPack(e.target.value)} className="w-full bg-[#07111A] border border-[rgba(56,189,248,0.3)] rounded-lg px-3 py-2 text-[#F8FAFC]" />
              </div>
              <div>
                <label htmlFor="profile-last-smoked" className="block text-[#A7B4C2] text-sm mb-1">Data e horário do último cigarro</label>
                <input id="profile-last-smoked" type="datetime-local" max={formatDateTimeLocal(new Date())} required value={lastSmoked} onChange={e => setLastSmoked(e.target.value)} className="w-full bg-[#07111A] border border-[rgba(56,189,248,0.3)] rounded-lg px-3 py-2 text-[#F8FAFC] [color-scheme:dark]" />
              </div>
              <div>
                <label htmlFor="profile-quit-reason" className="block text-[#A7B4C2] text-sm mb-1">Motivo principal</label>
                <select id="profile-quit-reason" value={reason} onChange={e => setReason(e.target.value)} className="w-full bg-[#07111A] border border-[rgba(56,189,248,0.3)] rounded-lg px-3 py-2 text-[#F8FAFC]">
                  <option value="">Selecione...</option>
                  {quitReasons.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <fieldset>
                <legend className="block text-[#A7B4C2] text-sm mb-2">Gatilhos que você quer acompanhar</legend>
                <div className="grid grid-cols-2 gap-2">
                  {defaultTriggers.filter(item => item.id !== 'outro').map(item => (
                    <button key={item.id} type="button" aria-pressed={selectedTriggers.includes(item.id)} onClick={() => toggleTrigger(item.id)} className={'rounded-lg border px-3 py-2 text-left text-sm ' + (selectedTriggers.includes(item.id) ? 'border-[#38BDF8] bg-[#38BDF8]/10 text-[#7DD3FC]' : 'border-white/10 text-[#A7B4C2]')}>
                      <span aria-hidden="true">{item.emoji}</span> {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              {formError && <p role="alert" className="rounded-lg border border-[#FB7185]/30 bg-[#FB7185]/10 p-3 text-sm text-[#FDA4AF]">{formError}</p>}
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white font-semibold mt-2">
                Salvar alterações
              </button>
            </form>
          )}
          {!isEditing && formError && <p role="alert" className="mx-4 mb-4 rounded-lg border border-[#FB7185]/30 bg-[#FB7185]/10 p-3 text-sm text-[#FDA4AF]">{formError}</p>}
        </div>

        <div>
          <h2 className="text-[#A7B4C2] text-xs font-medium uppercase tracking-wide mb-3 pl-1">Backup local</h2>
          <BackupControls />
        </div>

        <NotificationSettings />

        <section className="glass-card p-4 flex flex-col gap-3" aria-labelledby="support-resources-title">
          <div className="flex items-center gap-2">
            <HeartHandshake size={19} className="text-[#34D399]" aria-hidden="true" />
            <h2 id="support-resources-title" className="font-semibold text-[#F8FAFC]">Apoio profissional gratuito</h2>
          </div>
          <p className="text-sm leading-6 text-[#A7B4C2]">
            Você não precisa fazer isso sozinho. O SUS oferece tratamento para parar de fumar. Procure a Unidade Básica de Saúde (UBS) da sua região para saber como acessar o acompanhamento.
          </p>
          <a href="https://www.gov.br/inca/pt-br/assuntos/causas-e-prevencao-do-cancer/tabagismo/como-parar-de-fumar" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-xl bg-[#162230] p-3 text-sm text-[#7DD3FC]">
            Como parar de fumar — INCA
            <ExternalLink size={15} aria-hidden="true" />
          </a>
          <a href="https://www.saude.mg.gov.br/vidasaudavel/tabagismo/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-xl bg-[#162230] p-3 text-sm text-[#7DD3FC]">
            Tratamento em Minas Gerais
            <ExternalLink size={15} aria-hidden="true" />
          </a>
          <p className="text-xs leading-5 text-[#64748B]">Em Minas Gerais, o Disque Saúde 136 também orienta sobre o acesso ao tratamento.</p>
        </section>

        <div className="flex flex-col gap-3 mt-1">
          <Link href="/settings/donate" className="glass-card p-4 flex items-center justify-between border-[rgba(52,211,153,0.15)] hover:bg-[rgba(52,211,153,0.05)] transition-colors">
            <div className="flex items-center gap-3">
              <Heart size={18} className="text-[#34D399]" />
              <span className="text-[#F8FAFC] font-medium text-sm">Apoie o projeto</span>
            </div>
            <ChevronRight size={16} className="text-[#A7B4C2]" />
          </Link>
          <a href="https://github.com/jamesismos/Respira..." target="_blank" rel="noopener noreferrer" className="text-center text-[#64748B] text-xs underline underline-offset-4 pt-2 pb-4">
            Código-fonte no GitHub
          </a>
        </div>

        <div className="mt-4 mb-4">
          {!showClearConfirm ? (
            <button type="button" onClick={() => { setClearError(null); setShowClearConfirm(true) }} className="w-full py-3 text-[#FB7185] text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">
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
              {clearError && <p role="alert" className="text-sm text-[#FDA4AF]">{clearError}</p>}
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setShowClearConfirm(false)} className="flex-1 py-2.5 rounded-lg border border-[rgba(56,189,248,0.2)] text-[#F8FAFC] text-sm">
                  Cancelar
                </button>
                <button type="button" onClick={handleClearData} className="flex-1 py-2.5 rounded-lg bg-[#FB7185] text-white font-medium text-sm">
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
